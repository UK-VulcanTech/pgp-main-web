import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, ChevronRight, Loader2, Trash2, Eye, EyeOff } from "lucide-react";
import { cms } from "../api/client";
import { useToast } from "../components/Toast";

/**
 * Generic list page used by Solutions and Training programs.
 *
 * props:
 *   title        - page heading
 *   description  - sub-line
 *   endpoint     - e.g. /solutions/
 *   detailPath   - URL builder (slug) => `/solutions/${slug}`
 */
export default function CollectionList({ title, description, endpoint, detailPath }) {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState({ slug: "", title: "" });

  const { data: rows = [], isLoading } = useQuery({
    queryKey: ["manage", endpoint],
    queryFn: () => cms.get(endpoint).then((r) => r.data),
  });

  const create = useMutation({
    mutationFn: (payload) => cms.post(endpoint, payload).then((r) => r.data),
    onSuccess: (created) => {
      qc.invalidateQueries({ queryKey: ["manage", endpoint] });
      toast("Created.", "success");
      setCreating(false);
      setDraft({ slug: "", title: "" });
      navigate(detailPath(created.slug));
    },
    onError: (err) => {
      const msg = err?.response?.data
        ? Object.entries(err.response.data)
            .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(" ") : v}`)
            .join(" · ")
        : "Couldn't create row.";
      toast(msg, "error");
    },
  });
  const destroy = useMutation({
    mutationFn: (slug) => cms.delete(`${endpoint}${slug}/`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["manage", endpoint] });
      toast("Removed.", "success");
    },
    onError: () => toast("Delete failed.", "error"),
  });
  const togglePublished = useMutation({
    mutationFn: ({ slug, is_published }) =>
      cms.patch(`${endpoint}${slug}/`, { is_published }).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["manage", endpoint] }),
  });

  return (
    <div className="max-w-5xl mx-auto p-6 lg:p-10">
      <header className="mb-8 flex items-start justify-between gap-4">
        <div>
          <div className="text-[11px] uppercase tracking-[0.16em] text-ink-muted mb-1.5">
            Collection
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          {description && (
            <p className="text-sm text-ink-soft mt-1.5 max-w-prose">{description}</p>
          )}
        </div>
        <button
          onClick={() => setCreating((v) => !v)}
          className="inline-flex items-center gap-1.5 rounded-md bg-navy text-white px-4 py-2 text-sm font-medium hover:bg-navy-2"
        >
          <Plus size={14} /> New
        </button>
      </header>

      {creating && (
        <div className="mb-6 bg-white rounded-xl border border-divider shadow-sm p-5 grid gap-4 md:grid-cols-2">
          <label className="text-sm">
            <span className="text-xs font-medium text-ink-soft uppercase tracking-wide">Slug</span>
            <input
              autoFocus
              value={draft.slug}
              onChange={(e) =>
                setDraft((d) => ({ ...d, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-") }))
              }
              placeholder="my-new-thing"
              className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </label>
          <label className="text-sm">
            <span className="text-xs font-medium text-ink-soft uppercase tracking-wide">Title</span>
            <input
              value={draft.title}
              onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
              placeholder="My New Thing"
              className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </label>
          <div className="md:col-span-2 flex justify-end gap-2 pt-1">
            <button
              onClick={() => {
                setCreating(false);
                setDraft({ slug: "", title: "" });
              }}
              className="rounded-md border border-border px-3 py-2 text-sm hover:bg-divider"
            >
              Cancel
            </button>
            <button
              onClick={() =>
                create.mutate({
                  slug: draft.slug,
                  title: draft.title,
                  is_published: false,
                  sort_order: rows.length,
                })
              }
              disabled={!draft.slug || !draft.title || create.isPending}
              className="rounded-md bg-navy text-white px-4 py-2 text-sm font-medium hover:bg-navy-2 disabled:opacity-50"
            >
              {create.isPending ? "Creating…" : "Create + edit"}
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-divider shadow-sm overflow-hidden">
        {isLoading && (
          <div className="p-6 text-sm text-ink-soft flex items-center gap-2">
            <Loader2 size={14} className="animate-spin" /> Loading…
          </div>
        )}
        {!isLoading && rows.length === 0 && (
          <div className="p-10 text-center text-ink-muted">No rows yet.</div>
        )}
        {rows.map((row) => (
          <div
            key={row.slug}
            className="flex items-center gap-3 px-5 py-4 border-b border-divider last:border-0 hover:bg-paper transition group"
          >
            <Link
              to={detailPath(row.slug)}
              className="flex-1 min-w-0 flex items-center gap-3"
            >
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{row.title}</div>
                <div className="text-xs text-ink-muted font-mono">{row.slug}</div>
              </div>
              <div className="hidden md:block text-xs text-ink-soft truncate max-w-md">
                {row.snapshot}
              </div>
            </Link>
            <button
              onClick={() =>
                togglePublished.mutate({ slug: row.slug, is_published: !row.is_published })
              }
              title={row.is_published ? "Unpublish" : "Publish"}
              className={`p-1.5 rounded ${row.is_published ? "text-emerald-600" : "text-ink-muted"} hover:bg-divider`}
            >
              {row.is_published ? <Eye size={16} /> : <EyeOff size={16} />}
            </button>
            <button
              onClick={() => {
                if (confirm(`Delete "${row.title}"? This can't be undone.`)) destroy.mutate(row.slug);
              }}
              className="p-1.5 rounded text-red-600 hover:bg-red-50"
              title="Delete"
            >
              <Trash2 size={16} />
            </button>
            <Link to={detailPath(row.slug)} className="text-ink-muted">
              <ChevronRight size={16} />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
