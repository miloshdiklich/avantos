import type { Form, Edge } from "../types/domain";
import type { ApiGraphResponse } from "../types/api";
import { buildTemplateMap } from "../utils/buildTemplateMap";
import { buildFormsFromNodes } from "../utils/buildFormsFromNodes";
import { buildEdgesFromApi } from "../utils/buildEdgesFromApi";
import { sortFormsTopologically } from "../utils/sortFormsTopologially";

interface GraphData {
  forms: Form[];
  edges: Edge[];
}

const GRAPH_ENDPOINT = `${import.meta.env.VITE_GRAPH_BASE_URL.replace(/\/$/, '')}/api/v1/test/actions/blueprints/my-blueprint/graph`;

export const fetchGraphData = async (): Promise<GraphData> => {
  const response = await fetch(GRAPH_ENDPOINT);

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  const data = (await response.json()) as ApiGraphResponse;

  const templateMap = buildTemplateMap(data.forms);
  const unsortedForms: Form[] = buildFormsFromNodes(data.nodes ?? [], templateMap);
  const edges = buildEdgesFromApi(data.edges);

  const forms = sortFormsTopologically(unsortedForms, edges);

  return { forms, edges };
};
