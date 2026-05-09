import { Link, useNavigate, useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import PageEditor from "../components/PageEditor";
import AdjacencyPicker from "../components/AdjacencyPicker";

/**
 * Edit a single Solution / TrainingArea row, reusing the singleton page editor.
 *
 * Slug renames need three things:
 *   1. PUT /<old-slug>/ — DRF matches by URL slug, body has new slug, server
 *      saves and returns the renamed row.
 *   2. Navigate to /<new-slug> so the next refetch hits the right URL.
 *   3. Drop the old detail-query cache + invalidate the parent list so any
 *      other tab / sibling component picks up the new state.
 */
export default function CollectionEdit({
  schema,
  listPath,
  listLabel,
  parentKey,
  adjacency,
}) {
  const { slug } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const endpoint = `${schema.endpointBase}${slug}/`;

  const inlines = schema.inlines.map((inline) => ({
    ...inline,
    parentKey,
  }));

  function onSaved(next) {
    if (next?.slug && next.slug !== slug) {
      const newEndpoint = `${schema.endpointBase}${next.slug}/`;
      // Pre-populate the new key with the response so the next render skips
      // a re-fetch round-trip, then drop the old key entirely.
      qc.setQueryData(["manage", newEndpoint], next);
      qc.removeQueries({ queryKey: ["manage", endpoint], exact: true });
      // Refresh the list so the renamed row appears with its new slug.
      qc.invalidateQueries({ queryKey: ["manage", schema.endpointBase] });
      navigate(`${listPath}/${next.slug}`, { replace: true });
    }
  }

  const extraSections = adjacency
    ? [(form) => (form?.id ? <AdjacencyPicker config={adjacency} parentId={form.id} /> : null)]
    : [];

  return (
    <div>
      <div className="max-w-4xl mx-auto px-6 lg:px-10 pt-6 lg:pt-8">
        <Link
          to={listPath}
          className="inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-ink"
        >
          <ArrowLeft size={14} /> {listLabel}
        </Link>
      </div>
      <PageEditor
        title={`${schema.title}: ${slug}`}
        endpoint={endpoint}
        sections={schema.sections}
        inlines={inlines}
        extraSections={extraSections}
        onSaved={onSaved}
      />
    </div>
  );
}
