import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Trash2, Search, Mail, RefreshCw, Square, CheckSquare } from "lucide-react";
import { cms } from "../api/client";
import { useToast } from "../components/Toast";
import ForwardDialog from "../components/ForwardDialog";

export default function Submissions() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState(null);
  const [picked, setPicked] = useState(new Set());
  const [forwardOpen, setForwardOpen] = useState(false);
  const [forwardIds, setForwardIds] = useState([]);
  const [forwardSubject, setForwardSubject] = useState("");

  const { data: rows = [], isLoading, isFetching, refetch } = useQuery({
    queryKey: ["manage", "/submissions/"],
    queryFn: () => cms.get("/submissions/").then((r) => r.data),
  });

  const destroy = useMutation({
    mutationFn: (id) => cms.delete(`/submissions/${id}/`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["manage", "/submissions/"] });
      setSelected(null);
      setPicked((prev) => {
        if (!prev.size) return prev;
        return new Set();
      });
      toast("Removed.", "success");
    },
    onError: () => toast("Delete failed.", "error"),
  });

  const filtered = useMemo(() => {
    if (!q.trim()) return rows;
    const needle = q.toLowerCase();
    return rows.filter(
      (r) =>
        (r.name || "").toLowerCase().includes(needle) ||
        (r.email || "").toLowerCase().includes(needle) ||
        (r.organization || "").toLowerCase().includes(needle) ||
        (r.country || "").toLowerCase().includes(needle) ||
        (r.message || "").toLowerCase().includes(needle)
    );
  }, [rows, q]);

  // Drop pickeds that no longer exist (e.g. after delete or filter purge).
  useEffect(() => {
    const currentIds = new Set(rows.map((r) => r.id));
    setPicked((prev) => {
      let changed = false;
      const next = new Set();
      for (const id of prev) {
        if (currentIds.has(id)) next.add(id);
        else changed = true;
      }
      return changed ? next : prev;
    });
  }, [rows]);

  const allFilteredPicked =
    filtered.length > 0 && filtered.every((r) => picked.has(r.id));

  function togglePick(id) {
    setPicked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }
  function toggleAllVisible() {
    setPicked((prev) => {
      if (allFilteredPicked) {
        const next = new Set(prev);
        filtered.forEach((r) => next.delete(r.id));
        return next;
      }
      const next = new Set(prev);
      filtered.forEach((r) => next.add(r.id));
      return next;
    });
  }
  function clearPicked() {
    setPicked(new Set());
  }

  function openForwardSelected() {
    if (picked.size === 0) return;
    setForwardIds([...picked]);
    setForwardSubject("");
    setForwardOpen(true);
  }
  function openForwardOne(row) {
    setForwardIds([row.id]);
    setForwardSubject(`PGP enquiry — ${row.name}`);
    setForwardOpen(true);
  }

  return (
    <div className="max-w-6xl mx-auto p-6 lg:p-10">
      <header className="mb-6 flex items-start justify-between gap-4">
        <div>
          <div className="text-[11px] uppercase tracking-[0.16em] text-ink-muted mb-1.5">
            Inbox
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Form submissions</h1>
          <p className="text-sm text-ink-soft mt-1.5">
            Inbound contact-form posts. Select rows to forward them to a
            recipient as one email.
          </p>
        </div>
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-sm hover:bg-divider disabled:opacity-50"
          title="Refresh"
        >
          <RefreshCw size={14} className={isFetching ? "animate-spin" : ""} />
          Refresh
        </button>
      </header>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-md min-w-[260px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name, email, organization, message…"
            className="w-full pl-9 pr-3 py-2 rounded-md border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
        </div>
        <button
          onClick={toggleAllVisible}
          disabled={filtered.length === 0}
          className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-sm hover:bg-divider disabled:opacity-40"
        >
          {allFilteredPicked ? <CheckSquare size={14} /> : <Square size={14} />}
          {allFilteredPicked ? "Unselect all" : "Select all"}
        </button>
      </div>

      {picked.size > 0 && (
        <div className="mb-4 flex items-center justify-between gap-3 rounded-lg border border-primary/30 bg-blue-50/60 px-4 py-2.5 text-sm">
          <div>
            <span className="font-medium">{picked.size} selected</span>
            <button
              onClick={clearPicked}
              className="ml-3 text-ink-soft hover:text-ink underline-offset-2 hover:underline"
            >
              Clear
            </button>
          </div>
          <button
            onClick={openForwardSelected}
            className="inline-flex items-center gap-1.5 rounded-md bg-navy text-white px-4 py-1.5 text-sm font-medium hover:bg-navy-2"
          >
            <Mail size={14} /> Forward to email
          </button>
        </div>
      )}

      <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] gap-4">
        <div className="bg-white rounded-xl border border-divider shadow-sm overflow-hidden">
          {isLoading && (
            <div className="p-6 flex items-center gap-2 text-sm text-ink-soft">
              <Loader2 size={14} className="animate-spin" /> Loading…
            </div>
          )}
          {!isLoading && filtered.length === 0 && (
            <div className="p-10 text-center text-ink-muted">
              {rows.length === 0 ? "No submissions yet." : "No matches."}
            </div>
          )}
          {filtered.map((r) => {
            const isPicked = picked.has(r.id);
            return (
              <div
                key={r.id}
                className={`flex items-center gap-3 px-4 py-3 border-b border-divider last:border-0 transition ${
                  selected?.id === r.id ? "bg-paper" : "hover:bg-paper"
                }`}
              >
                <button
                  onClick={() => togglePick(r.id)}
                  className="p-1 -ml-1 rounded hover:bg-divider"
                  aria-label={isPicked ? "Unselect" : "Select"}
                  title={isPicked ? "Unselect" : "Select"}
                >
                  {isPicked ? (
                    <CheckSquare size={16} className="text-primary" />
                  ) : (
                    <Square size={16} className="text-ink-muted" />
                  )}
                </button>
                <button
                  onClick={() => setSelected(r)}
                  className="flex-1 min-w-0 text-left flex items-center gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{r.name}</div>
                    <div className="text-xs text-ink-muted truncate">
                      {r.email}
                      {r.organization ? ` · ${r.organization}` : ""}
                    </div>
                  </div>
                  <div className="text-xs text-ink-muted whitespace-nowrap">
                    {new Date(r.created_at).toLocaleDateString()}
                  </div>
                </button>
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-xl border border-divider shadow-sm p-5 lg:sticky lg:top-6 self-start">
          {!selected ? (
            <div className="text-sm text-ink-muted">Select a submission to view it.</div>
          ) : (
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-ink-muted">
                    {new Date(selected.created_at).toLocaleString()}
                  </div>
                  <h3 className="text-lg font-semibold tracking-tight mt-0.5">
                    {selected.name}
                  </h3>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openForwardOne(selected)}
                    className="inline-flex items-center gap-1.5 rounded-md border border-border text-ink px-2.5 py-1.5 text-xs hover:bg-divider"
                    title="Forward to email"
                  >
                    <Mail size={13} /> Forward
                  </button>
                  <button
                    onClick={() => {
                      if (confirm("Delete this submission?")) destroy.mutate(selected.id);
                    }}
                    className="p-1.5 rounded text-red-600 hover:bg-red-50"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <dl className="mt-4 grid grid-cols-3 gap-x-4 gap-y-3 text-sm">
                <Detail term="Email" desc={<a className="text-primary" href={`mailto:${selected.email}`}>{selected.email}</a>} />
                <Detail term="Organization" desc={selected.organization || "—"} />
                <Detail term="Country" desc={selected.country || "—"} />
                <Detail term="Sector" desc={selected.sector || "—"} />
                <Detail term="IP" desc={selected.ip_address || "—"} mono />
              </dl>

              <div className="mt-5">
                <div className="text-[11px] uppercase tracking-wider text-ink-muted mb-1">
                  Message
                </div>
                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                  {selected.message}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <ForwardDialog
        open={forwardOpen}
        onClose={() => setForwardOpen(false)}
        submissionIds={forwardIds}
        defaultSubject={forwardSubject}
      />
    </div>
  );
}

function Detail({ term, desc, mono = false }) {
  return (
    <>
      <dt className="text-[11px] uppercase tracking-wider text-ink-muted col-span-1">
        {term}
      </dt>
      <dd className={`col-span-2 break-words ${mono ? "font-mono text-xs" : ""}`}>{desc}</dd>
    </>
  );
}
