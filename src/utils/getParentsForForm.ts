import type { Form, Edge } from '../types/domain';

export interface ParentsForForm {
  direct: Form[];
  transitive: Form[];
}

const getDirectParentIds = (formId: string, edges: Edge[]): string[] => {
  const ids = edges
    .filter((edge) => edge.target === formId)
    .map((edge) => edge.source);

  return Array.from(new Set(ids)); // deduplicate keys
}

const getAllAncestorIds = (formId: string, edges: Edge[]): string[] => {
  const visited = new Set<string>();
  const stack: string[] = [formId];

  while (stack.length > 0) {
    const current = stack.pop() as string;

    const directParents = edges
      .filter((edge) => edge.target === current)
      .map((edge) => edge.source);

    directParents.forEach((parentId) => {
      if (!visited.has(parentId)) {
        visited.add(parentId);
        stack.push(parentId);
      }
    });
  }

  return Array.from(visited);
};

export const getParentsForForm = (
  formId: string | null,
  forms: Form[],
  edges: Edge[],
): ParentsForForm => {
  if (!formId) {
    return { direct: [], transitive: [] };
  }

  const directIds = getDirectParentIds(formId, edges);
  const allAncestorIds = getAllAncestorIds(formId, edges);

  // transitive = all ancestors minus direct and minus self
  const directSet = new Set(directIds);
  const seen = new Set<string>();
  const transitiveIds: string[] = [];

  allAncestorIds.forEach((id) => {
    if (id === formId) return;
    if (directSet.has(id)) return;
    if (seen.has(id)) return;

    seen.add(id);
    transitiveIds.push(id);
  });

  const direct: Form[] = directIds
    .map((id) => forms.find(form => form.id === id) ?? null)
    .filter((form): form is Form => form !== null);

  const transitive: Form[] = transitiveIds
    .map((id) => forms.find(form => form.id === id) ?? null)
    .filter((form): form is Form => form !== null);

  return { direct, transitive };
};
