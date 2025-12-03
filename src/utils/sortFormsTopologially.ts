import type { Form, Edge } from "../types/domain";

export const sortFormsTopologically = (forms: Form[], edges: Edge[]): Form[] => {
  if (forms.length === 0) {
    return [];
  }

  const formById = new Map<string, Form>(
    forms.map((form) => [form.id, form]),
  );

  const incomingEdgeCounts = new Map<string, number>();
  const childrenByFormId = new Map<string, string[]>();

  forms.forEach((form) => {
    incomingEdgeCounts.set(form.id, 0);
    childrenByFormId.set(form.id, []);
  });

  edges.forEach((edge) => {
    if (!formById.has(edge.source) || !formById.has(edge.target)) {
      return;
    }

    const currentCount = incomingEdgeCounts.get(edge.target) ?? 0;
    incomingEdgeCounts.set(edge.target, currentCount + 1);

    const existingChildren = childrenByFormId.get(edge.source) ?? [];
    childrenByFormId.set(edge.source, [...existingChildren, edge.target]);
  });

  const readyFormIds = forms
    .filter((form) => (incomingEdgeCounts.get(form.id) ?? 0) === 0)
    .map((form) => form.id);

  const orderedForms: Form[] = [];

  while (readyFormIds.length > 0) {
    const currentFormId = readyFormIds.shift() as string;
    const currentForm = formById.get(currentFormId);

    if (!currentForm) {
      continue;
    }

    orderedForms.push(currentForm);

    const childIds = childrenByFormId.get(currentFormId) ?? [];

    childIds.forEach((childId) => {
      const count = incomingEdgeCounts.get(childId);

      if (typeof count !== "number") {
        return;
      }

      const nextCount = count - 1;
      incomingEdgeCounts.set(childId, nextCount);

      if (nextCount === 0) {
        readyFormIds.push(childId);
      }
    });
  }

  if (orderedForms.length === forms.length) {
    return orderedForms;
  }

  const seenIds = new Set(orderedForms.map((form) => form.id));
  const remainingForms = forms.filter((form) => !seenIds.has(form.id));

  return [...orderedForms, ...remainingForms];
};
