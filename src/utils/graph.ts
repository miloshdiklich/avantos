import type { Edge } from "../types/domain";

/**
 * Get Direct Parents
 * @param formId 
 * @param edges 
 * @returns 
 */
export const getDirectParents = (formId: string, edges: Edge[]): string[] => {
  return edges
    .filter(edge => edge.target === formId)
    .map(edge => edge.source)
};

/**
 * DFS to get all ancestors
 * @param formId 
 * @param edges 
 * @returns 
 */
export const getAllParents = (formId: string, edges: Edge[]): string[] => {
  const visited = new Set<string>();
  const stack = [formId];

  while (stack.length > 0) {
    const current = stack.pop()!;
    const direct = edges
      .filter(edge => edge.target === current)
      .map(edge => edge.source);

    for(const p of direct) {
      if(!visited.has(p)) {
        visited.add(p);
        stack.push(p);
      }
    }
  }

  return [...visited];
}

/**
 * Get Transitive Parents
 * @param formId 
 * @param edges 
 * @returns 
 */
export const getTransitiveParents = (formId: string, edges: Edge[]): string[] => {
  const direct = new Set(getDirectParents(formId, edges));
  const all = getAllParents(formId, edges);

  return all.filter(id => !direct.has(id));
}