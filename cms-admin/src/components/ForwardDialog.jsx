import { useEffect, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Loader2, Mail, X } from "lucide-react";
import { cms } from "../api/client";
import { useToast } from "./Toast";

/**
 * Modal dialog for forwarding one or more submissions to a recipient email.
 *
 * props:
 *   open              boolean
 *   onClose           () => void
 *   submissionIds     number[]
 *   defaultSubject?   string
 *   onSent?           (result) => void   — after successful send
 */
export default function ForwardDialog({
  open,
  onClose,
  submissionIds,
  defaultSubject,
  onSent,
}) {
  const { toast } = useToast();
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState(defaultSubject || "");
  const [note, setNote] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      setSubject(defaultSubject || "");
      setNote("");
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open, defaultSubject]);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape" && open) onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const forward = useMutation({
    mutationFn: (payload) =>
      cms.post("/submissions/forward/", payload).then((r) => r.data),
    onSuccess: (result) => {
      toast(
        `Forwarded ${result.submission_count} submission${
          result.submission_count === 1 ? "" : "s"
        } to ${result.to}.`,
        "success"
      );
      onSent?.(result);
      onClose();
    },
    onError: (err) => {
      const msg =
        err?.response?.data?.detail ||
        Object.values(err?.response?.data || {})
          .flat()
          .join(" ") ||
        "Email failed to send.";
      toast(msg, "error");
    },
  });

  function submit(e) {
    e.preventDefault();
    if (!to.trim()) return;
    forward.mutate({
      to: to.trim(),
      subject: subject.trim() || undefined,
      note: note.trim() || undefined,
      submission_ids: submissionIds,
    });
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/40"
      onClick={onClose}
    >
      <form
        onSubmit={submit}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-divider"
      >
        <header className="flex items-center justify-between px-5 py-3 border-b border-divider">
          <div className="flex items-center gap-2">
            <Mail size={16} className="text-primary" />
            <h3 className="font-medium tracking-tight">
              Forward {submissionIds.length} submission
              {submissionIds.length === 1 ? "" : "s"}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded hover:bg-divider"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </header>

        <div className="p-5 space-y-4">
          <label className="block text-sm">
            <span className="text-xs font-medium text-ink-soft uppercase tracking-wide">
              Send to
            </span>
            <input
              ref={inputRef}
              type="email"
              required
              autoComplete="off"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="team@example.com"
              className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </label>
          <label className="block text-sm">
            <span className="text-xs font-medium text-ink-soft uppercase tracking-wide">
              Subject (optional)
            </span>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder={
                submissionIds.length === 1
                  ? "PGP enquiry — <name>"
                  : `PGP enquiries — ${submissionIds.length} submissions`
              }
              className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </label>
          <label className="block text-sm">
            <span className="text-xs font-medium text-ink-soft uppercase tracking-wide">
              Note (optional)
            </span>
            <textarea
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Anything you want to add above the bundled submissions."
              className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </label>
          <p className="text-xs text-ink-muted">
            One email is sent containing all selected submissions. The first
            submission's address becomes the Reply-To when only one is selected.
          </p>
        </div>

        <footer className="px-5 py-3 border-t border-divider flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-border px-3 py-1.5 text-sm hover:bg-divider"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!to.trim() || forward.isPending}
            className="inline-flex items-center gap-1.5 rounded-md bg-navy text-white px-4 py-1.5 text-sm font-medium hover:bg-navy-2 disabled:opacity-60"
          >
            {forward.isPending ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Mail size={14} />
            )}
            Send
          </button>
        </footer>
      </form>
    </div>
  );
}
