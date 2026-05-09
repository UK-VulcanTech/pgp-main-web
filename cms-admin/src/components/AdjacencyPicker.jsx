import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowDown, ArrowUp, Loader2, Plus, X } from "lucide-react";
import { cms } from "../api/client";
import { useToast } from "./Toast";

/**
 * "Adjacent sectors" / "More training programs" — a many-to-many through-model
 * picker. Renders the rows currently linked from `parentId` plus a dropdown
 * with the unselected siblings.
 *
 * Shape of the through model on the server:
 *   id, <fromKey>, <toKey>, sort_order
 *
 * config:
 *   listEndpoint   - GET all candidates (siblings) — e.g. "/solutions/"
 *   throughEndpoint- adjacency CRUD endpoint — e.g. "/solutions-children/adjacency/"
 *   fromKey        - the FK column for the parent row — e.g. "from_solution"
 *   toKey          - the FK column for the related row — e.g. "to_solution"
 *   title          - section title
 *   help           - subtitle (e.g. "Programs we often deliver alongside this one.")
 */
export default function AdjacencyPicker({ config, parentId }) {
  const qc = useQueryClient();
  const { toast } = useToast();
  const { listEndpoint, throughEndpoint, fromKey, toKey, title, help } = config;

  const candidatesKey = ["manage", listEndpoint];
  const linksKey = ["manage", throughEndpoint, fromKey, parentId];

  const { data: candidates = [], isLoading: candidatesLoading } = useQuery({
    queryKey: candidatesKey,
    queryFn: () => cms.get(listEndpoint).then((r) => r.data),
  });
  const { data: links = [], isLoading: linksLoading } = useQuery({
    queryKey: linksKey,
    queryFn: () =>
      cms.get(throughEndpoint, { params: { [fromKey]: parentId } }).then((r) => r.data),
    enabled: !!parentId,
  });

  const candidatesById = useMemo(() => {
    const m = new Map();
    candidates.forEach((c) => m.set(c.id, c));
    return m;
  }, [candidates]);
  const linksOrdered = useMemo(
    () => [...links].sort((a, b) => a.sort_order - b.sort_order),
    [links]
  );
  const linkedIds = useMemo(() => new Set(linksOrdered.map((l) => l[toKey])), [linksOrdered, toKey]);
  const available = candidates.filter((c) => c.id !== parentId && !linkedIds.has(c.id));

  const create = useMutation({
    mutationFn: (toId) =>
      cms
        .post(throughEndpoint, {
          [fromKey]: parentId,
          [toKey]: toId,
          sort_order: linksOrdered.length,
        })
        .then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: linksKey });
      toast("Linked.", "success");
    },
    onError: () => toast("Couldn't link.", "error"),
  });
  const destroy = useMutation({
    mutationFn: (id) => cms.delete(`${throughEndpoint}${id}/`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: linksKey });
      toast("Unlinked.", "success");
    },
    onError: () => toast("Couldn't unlink.", "error"),
  });
  const reorder = useMutation({
    mutationFn: ({ id, sort_order }) =>
      cms.patch(`${throughEndpoint}${id}/`, { sort_order }).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: linksKey }),
  });

  function move(row, dir) {
    const idx = linksOrdered.findIndex((r) => r.id === row.id);
    const swap = linksOrdered[idx + dir];
    if (!swap) return;
    reorder.mutate({ id: row.id, sort_order: swap.sort_order });
    reorder.mutate({ id: swap.id, sort_order: row.sort_order });
  }

  return (
    <section className="bg-white rounded-xl border border-divider shadow-sm">
      <header className="px-6 py-4 border-b border-divider flex items-center justify-between">
        <div>
          <h2 className="font-medium tracking-tight">{title}</h2>
          {help && <p className="text-sm text-ink-soft mt-0.5">{help}</p>}
        </div>
        <div className="flex items-center gap-2">
          {available.length > 0 ? (
            <select
              value=""
              onChange={(e) => {
                if (e.target.value) create.mutate(Number(e.target.value));
                e.target.value = "";
              }}
              className="rounded-md border border-border bg-white px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            >
              <option value="" disabled>
                + Add link…
              </option>
              {available.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          ) : (
            <span className="text-xs text-ink-muted">All linked.</span>
          )}
        </div>
      </header>

      <div className="divide-y divide-divider">
        {(candidatesLoading || linksLoading) && (
          <div className="p-6 text-sm text-ink-soft flex items-center gap-2">
            <Loader2 size={14} className="animate-spin" /> Loading…
          </div>
        )}
        {!candidatesLoading && !linksLoading && linksOrdered.length === 0 && (
          <div className="p-6 text-sm text-ink-muted">
            Nothing linked yet. Pick a row from the dropdown to add one.
          </div>
        )}
        {linksOrdered.map((row, i) => {
          const target = candidatesById.get(row[toKey]);
          return (
            <div
              key={row.id}
              className="px-6 py-3 flex items-center gap-3"
            >
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{target?.title || `(deleted #${row[toKey]})`}</div>
                {target?.snapshot && (
                  <div className="text-xs text-ink-muted truncate">{target.snapshot}</div>
                )}
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => move(row, -1)}
                  disabled={i === 0}
                  title="Move up"
                  className="p-1.5 rounded hover:bg-divider disabled:opacity-30"
                >
                  <ArrowUp size={14} />
                </button>
                <button
                  onClick={() => move(row, +1)}
                  disabled={i === linksOrdered.length - 1}
                  title="Move down"
                  className="p-1.5 rounded hover:bg-divider disabled:opacity-30"
                >
                  <ArrowDown size={14} />
                </button>
                <button
                  onClick={() => destroy.mutate(row.id)}
                  className="p-1.5 rounded text-red-600 hover:bg-red-50"
                  title="Unlink"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
