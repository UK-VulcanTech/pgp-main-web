import { useRef } from "react";
import { Upload, ExternalLink, Loader2 } from "lucide-react";

/**
 * One form field. Field types:
 *   text, textarea, url, slug, number, checkbox, select, image
 *
 * For type=image: renders a URL text input alongside a file-upload button +
 * thumbnail preview. Selecting a file invokes `onUpload(file)` on the parent;
 * clearing the URL means "use the uploaded ImageField instead."
 */
export default function Field({ field, value, onChange, error, onUpload, uploading, onClear, clearing }) {
  const { name, label, type = "text", help, placeholder, rows = 4, options } = field;
  const id = `f_${name}`;
  const common =
    "w-full rounded-md border border-border px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary";

  if (type === "image") {
    return (
      <ImageWidget
        id={id}
        label={label}
        help={help}
        placeholder={placeholder}
        value={value}
        onChange={(v) => onChange(name, v)}
        onUpload={onUpload}
        uploading={uploading}
        onClear={onClear}
        clearing={clearing}
        error={error}
      />
    );
  }

  let control;
  if (type === "textarea") {
    control = (
      <textarea
        id={id}
        rows={rows}
        value={value ?? ""}
        onChange={(e) => onChange(name, e.target.value)}
        placeholder={placeholder}
        className={common}
      />
    );
  } else if (type === "checkbox") {
    control = (
      <label className="inline-flex items-center gap-2 text-sm">
        <input
          id={id}
          type="checkbox"
          checked={!!value}
          onChange={(e) => onChange(name, e.target.checked)}
          className="rounded border-border"
        />
        <span className="text-ink-soft">{help || "Yes"}</span>
      </label>
    );
  } else if (type === "select") {
    control = (
      <select
        id={id}
        value={value ?? ""}
        onChange={(e) => onChange(name, e.target.value)}
        className={common}
      >
        {(options || []).map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    );
  } else if (type === "number") {
    control = (
      <input
        id={id}
        type="number"
        value={value ?? ""}
        onChange={(e) => onChange(name, e.target.value === "" ? "" : Number(e.target.value))}
        placeholder={placeholder}
        className={common}
      />
    );
  } else {
    control = (
      <input
        id={id}
        type={type === "url" ? "url" : "text"}
        value={value ?? ""}
        onChange={(e) => onChange(name, e.target.value)}
        placeholder={placeholder}
        className={common}
      />
    );
  }

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-medium text-ink-soft tracking-wide uppercase">
        {label}
      </label>
      {control}
      {help && type !== "checkbox" && (
        <div className="text-xs text-ink-muted">{help}</div>
      )}
      {error && <div className="text-xs text-red-600">{error}</div>}
    </div>
  );
}

function ImageWidget({
  id,
  label,
  help,
  placeholder,
  value,
  onChange,
  onUpload,
  uploading,
  onClear,
  clearing,
  error,
}) {
  const fileRef = useRef(null);

  function pickFile() {
    fileRef.current?.click();
  }
  function onFileChange(e) {
    const file = e.target.files?.[0];
    if (file && onUpload) onUpload(file);
    // reset so the same file can be picked again later
    e.target.value = "";
  }
  function clearImage() {
    if (onClear) {
      // Wipes both the URL override and any uploaded ImageField file.
      onClear();
    } else {
      onChange("");
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-medium text-ink-soft tracking-wide uppercase">
        {label}
      </label>

      <div className="flex flex-col sm:flex-row gap-3 items-start">
        <div className="w-28 h-20 shrink-0 rounded-md border border-divider bg-paper overflow-hidden flex items-center justify-center text-ink-muted text-[11px]">
          {value ? (
            <img src={value} alt="" className="w-full h-full object-cover" />
          ) : (
            <span>No image</span>
          )}
        </div>
        <div className="flex-1 min-w-0 flex flex-col gap-2 w-full">
          <input
            id={id}
            type="text"
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder || "/images/your-image.webp or https://…"}
            className="w-full rounded-md border border-border px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={pickFile}
              disabled={!onUpload || uploading}
              className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs hover:bg-divider disabled:opacity-50"
            >
              {uploading ? (
                <Loader2 size={12} className="animate-spin" />
              ) : (
                <Upload size={12} />
              )}
              {uploading ? "Uploading…" : "Upload file"}
            </button>
            {value && (
              <a
                href={value}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs text-ink-soft hover:text-ink"
              >
                Open <ExternalLink size={11} />
              </a>
            )}
            {value && (
              <button
                type="button"
                onClick={clearImage}
                disabled={clearing}
                title="Remove image (clears the URL and any uploaded file)"
                className="text-xs text-ink-soft hover:text-red-600 disabled:opacity-50"
              >
                {clearing ? "Clearing…" : "Clear"}
              </button>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={onFileChange}
            className="hidden"
          />
        </div>
      </div>
      {help && <div className="text-xs text-ink-muted">{help}</div>}
      {error && <div className="text-xs text-red-600">{error}</div>}
    </div>
  );
}
