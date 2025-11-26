import type { ApiNode } from "../types/api";

export const buildNodeToFormMap = (nodes: ApiNode[]): Record<string, string> => {
  const map: Record<string, string> = {};

  nodes.forEach((node) => {
    if (node.type === 'form' && node.data?.component_id) {
      map[node.id] = node.data.component_id;
    }
  });

  return map;
};