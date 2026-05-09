import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, Save, ArrowUp, ArrowDown, Loader2 } from "lucide-react";
import { cms } from "../api/client";
import { useToast } from "./Toast";
import Field from "./Field";

/**
 * Editable list of inline rows attached to a parent (page or sector).
 * Each row is editable in place; rows persist independently (PATCH per row).
 *
 * props:
 *   endpoint:    e.g. /home/pillars/
 *   parentKey:   e.g. "page" — the FK column on the row
 *   parentValue: PK of the parent (1 for singleton pages)
 *   fields:      [{ name, label, type, ... }]
 */
export default function InlineCollection({ title, endpoint, parentKey, parentValue, fields }) {
  const qc = useQueryClient();
  const { toast } = useToast();
  const queryKey = ["manage", endpoint, parentKey, parentValue];

  const { data: rows = [], isLoading } = useQuery({
    queryKey,
    queryFn: () =>
      cms.get(endpoint, { params: { [parentKey]: parentValue } }).then((r) => r.data),
  });

  const create = useMutation({
    mutationFn: (payload) => cms.post(endpoint, payload).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey });
      toast("Row added.", "success");
    },
    onError: () => toast("Couldn't add row.", "error"),
  });
  const update = useMutation({
    mutationFn: ({ id, ...payload }) =>
      cms.patch(`${endpoint}${id}/`, payload).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey });
      toast("Saved.", "success");
    },
    onError: () => toast("Save failed.", "error"),
  });
  const destroy = useMutation({
    mutationFn: (id) => cms.delete(`${endpoint}${id}/`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey });
      toast("Removed.", "success");
    },
    onError: () => toast("Delete failed.", "error"),
  });

  function addRow() {
    const draft = { [parentKey]: parentValue, sort_order: rows.length };
    fields.forEach((f) => {
      if (!(f.name in draft)) draft[f.name] = f.type === "checkbox" ? false : "";
    });
    create.mutate(draft);
  }
  function move(row, dir) {
    const ordered = [...rows].sort((a, b) => a.sort_order - b.sort_order);
    const idx = ordered.findIndex((r) => r.id === row.id);
    const swap = ordered[idx + dir];
    if (!swap) return;
    update.mutate({ id: row.id, sort_order: swap.sort_order });
    update.mutate({ id: swap.id, sort_order: row.sort_order });
  }

  return (
    <section className="bg-white rounded-xl border border-divider shadow-sm">
      <header className="px-6 py-4 border-b border-divider flex items-center justify-between">
        <h2 className="font-medium tracking-tight">{title}</h2>
        <button
          onClick={addRow}
          className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-primary-hover font-medium"
        >
          <Plus size={14} /> Add
        </button>
      </header>
      <div className="divide-y divide-divider">
        {isLoading && (
          <div className="p-6 flex items-center gap-2 text-ink-soft text-sm">
            <Loader2 className="animate-spin" size={14} /> Loading…
          </div>
        )}
        {!isLoading && rows.length === 0 && (
          <div className="p-6 text-sm text-ink-muted">
            No rows yet. Click <span className="text-primary">Add</span> to create one.
          </div>
        )}
        {rows.map((row, i) => (
          <Row
            key={row.id}
            row={row}
            fields={fields}
            isFirst={i === 0}
            isLast={i === rows.length - 1}
            onMoveUp={() => move(row, -1)}
            onMoveDown={() => move(row, +1)}
            onDelete={() => destroy.mutate(row.id)}
            onSave={(payload) => update.mutate({ id: row.id, ...payload })}
            saving={update.isPending}
          />
        ))}
      </div>
    </section>
  );
}

function Row({ row, fields, isFirst, isLast, onMoveUp, onMoveDown, onDelete, onSave, saving }) {
  const [draft, setDraft] = useState(row);
  const [dirty, setDirty] = useState(false);

  // Re-sync if upstream changes (e.g. after sort_order swap).
  if (row && row.id === draft.id && !dirty) {
    let needsSync = false;
    for (const f of fields) {
      if (row[f.name] !== draft[f.name]) {
        needsSync = true;
        break;
      }
    }
    if (needsSync) setDraft(row);
  }

  function update(name, value) {
    setDirty(true);
    setDraft((prev) => ({ ...prev, [name]: value }));
  }
  function save() {
    const payload = {};
    fields.forEach((f) => (payload[f.name] = draft[f.name]));
    onSave(payload);
    setDirty(false);
  }

  return (
    <div className="p-6">
      <div className="grid gap-4 md:grid-cols-2">
        {fields.map((f) => (
          <div key={f.name} className={f.full ? "md:col-span-2" : "md:col-span-1"}>
            <Field field={f} value={draft[f.name]} onChange={update} />
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <button
            onClick={onMoveUp}
            disabled={isFirst}
            title="Move up"
            className="p-1.5 rounded hover:bg-divider disabled:opacity-30"
          >
            <ArrowUp size={14} />
          </button>
          <button
            onClick={onMoveDown}
            disabled={isLast}
            title="Move down"
            className="p-1.5 rounded hover:bg-divider disabled:opacity-30"
          >
            <ArrowDown size={14} />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (confirm("Delete this row?")) onDelete();
            }}
            className="inline-flex items-center gap-1.5 rounded-md border border-red-200 text-red-700 px-2.5 py-1.5 text-xs hover:bg-red-50"
          >
            <Trash2 size={13} /> Delete
          </button>
          <button
            onClick={save}
            disabled={!dirty || saving}
            className="inline-flex items-center gap-1.5 rounded-md bg-navy text-white px-3 py-1.5 text-xs font-medium hover:bg-navy-2 disabled:opacity-50"
          >
            {saving ? <Loader2 className="animate-spin" size={12} /> : <Save size={12} />}
            Save row
          </button>
        </div>
      </div>
    </div>
  );
}
