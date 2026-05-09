import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Save, RotateCcw, Loader2 } from "lucide-react";
import { cms } from "../api/client";
import { useToast } from "./Toast";
import Field from "./Field";
import InlineCollection from "./InlineCollection";

/**
 * Schema-driven editor for a singleton page.
 *
 * props:
 *   title:       page title shown at top
 *   description: optional sub-line
 *   endpoint:    /pages/<slug>/ — used for both GET and PUT
 *   sections:    [{ title, help?, fields: [{...}] }]
 *   inlines:     optional [{ key, title, endpoint, parentKey, parentValue, fields: [...] }]
 */
export default function PageEditor({
  title,
  description,
  endpoint,
  sections,
  inlines = [],
  onSaved,
  extraSections = [],
}) {
  const qc = useQueryClient();
  const { toast } = useToast();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["manage", endpoint],
    queryFn: () => cms.get(endpoint).then((r) => r.data),
  });

  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  const dirty = useRef(false);

  useEffect(() => {
    if (data) {
      setForm(data);
      dirty.current = false;
    }
  }, [data]);

  const mutate = useMutation({
    mutationFn: (payload) => cms.put(endpoint, payload).then((r) => r.data),
    onSuccess: (next) => {
      setForm(next);
      setErrors({});
      dirty.current = false;
      qc.invalidateQueries({ queryKey: ["manage", endpoint] });
      toast("Saved.", "success");
      onSaved?.(next);
    },
    onError: (err) => {
      const data = err?.response?.data;
      if (data && typeof data === "object") {
        setErrors(data);
        toast("Some fields need fixing.", "error");
      } else {
        toast("Save failed.", "error");
      }
    },
  });

  function setField(name, value) {
    dirty.current = true;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  const upload = useMutation({
    mutationFn: async ({ field, file }) => {
      const fd = new FormData();
      fd.append(field.imageField, file);
      // Clear the URL override so the uploaded file is the source of truth.
      fd.append(field.name, "");
      return cms
        .patch(endpoint, fd, { headers: { "Content-Type": "multipart/form-data" } })
        .then((r) => r.data);
    },
    onSuccess: (next) => {
      setForm(next);
      qc.invalidateQueries({ queryKey: ["manage", endpoint] });
      toast("Image uploaded.", "success");
    },
    onError: () => toast("Upload failed.", "error"),
  });
  const uploadingFields = upload.isPending ? upload.variables?.field?.name : null;
  function handleUpload(field, file) {
    upload.mutate({ field, file });
  }

  // "Clear image" — JSON PATCH that nulls the ImageField file and empties
  // the URL override in one round-trip. Multipart can't carry null, hence
  // JSON.
  const clearImage = useMutation({
    mutationFn: (field) =>
      cms
        .patch(endpoint, { [field.imageField]: null, [field.name]: "" })
        .then((r) => r.data),
    onSuccess: (next) => {
      setForm(next);
      qc.invalidateQueries({ queryKey: ["manage", endpoint] });
      toast("Image removed.", "success");
    },
    onError: () => toast("Couldn't remove image.", "error"),
  });
  const clearingFields = clearImage.isPending ? clearImage.variables?.name : null;
  function handleClear(field) {
    clearImage.mutate(field);
  }
  function reset() {
    setForm(data || {});
    setErrors({});
    dirty.current = false;
  }
  function save() {
    mutate.mutate(form);
  }

  const fieldErrors = useMemo(() => {
    if (!errors || Array.isArray(errors)) return {};
    const out = {};
    for (const [k, v] of Object.entries(errors)) {
      out[k] = Array.isArray(v) ? v.join(" ") : String(v);
    }
    return out;
  }, [errors]);

  if (isLoading) {
    return (
      <div className="p-10 flex items-center gap-2 text-ink-soft">
        <Loader2 className="animate-spin" size={16} />
        Loading…
      </div>
    );
  }
  if (isError) {
    return (
      <div className="p-10 text-red-700">
        Couldn't load: {error?.response?.data?.detail || error?.message || "unknown error"}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 lg:p-10">
      <header className="mb-8 flex items-start justify-between gap-4">
        <div>
          <div className="text-[11px] uppercase tracking-[0.16em] text-ink-muted mb-1.5">
            Edit page
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          {description && (
            <p className="text-sm text-ink-soft mt-1.5 max-w-prose">{description}</p>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={reset}
            disabled={!dirty.current}
            className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-sm hover:bg-divider disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <RotateCcw size={14} /> Reset
          </button>
          <button
            onClick={save}
            disabled={mutate.isPending}
            className="inline-flex items-center gap-1.5 rounded-md bg-navy text-white px-4 py-2 text-sm font-medium hover:bg-navy-2 disabled:opacity-60"
          >
            {mutate.isPending ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />}
            Save
          </button>
        </div>
      </header>

      <div className="space-y-6">
        {sections.map((sect) => (
          <section
            key={sect.title}
            className="bg-white rounded-xl border border-divider shadow-sm"
          >
            <header className="px-6 py-4 border-b border-divider">
              <h2 className="font-medium tracking-tight">{sect.title}</h2>
              {sect.help && (
                <p className="text-sm text-ink-soft mt-1">{sect.help}</p>
              )}
            </header>
            <div className="p-6 grid gap-5 md:grid-cols-2">
              {sect.fields.map((f) => (
                <div
                  key={f.name}
                  className={f.full ? "md:col-span-2" : "md:col-span-1"}
                >
                  <Field
                    field={f}
                    value={form[f.name]}
                    onChange={setField}
                    error={fieldErrors[f.name]}
                    onUpload={
                      f.type === "image" && f.imageField
                        ? (file) => handleUpload(f, file)
                        : undefined
                    }
                    uploading={uploadingFields === f.name}
                    onClear={
                      f.type === "image" && f.imageField
                        ? () => handleClear(f)
                        : undefined
                    }
                    clearing={clearingFields === f.name}
                  />
                </div>
              ))}
            </div>
          </section>
        ))}

        {inlines.map((inline) => (
          <InlineCollection
            key={inline.key}
            title={inline.title}
            endpoint={inline.endpoint}
            parentKey={inline.parentKey}
            parentValue={inline.parentValue ?? form.id ?? 1}
            fields={inline.fields}
          />
        ))}

        {extraSections.map((node, i) => (
          <div key={i}>{typeof node === "function" ? node(form) : node}</div>
        ))}
      </div>
    </div>
  );
}
