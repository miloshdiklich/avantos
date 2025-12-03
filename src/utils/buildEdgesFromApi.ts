import type { ApiGraphResponse } from "../types/api";
import type { Edge } from "../types/domain";

export const buildEdgesFromApi = (
  edges: ApiGraphResponse['edges'] = [],
): Edge[] => 
  edges.map(edge => ({
    source: edge.source,
    target: edge.target,
  }));