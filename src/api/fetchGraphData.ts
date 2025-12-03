import type { Form, Edge } from "../types/domain";
import type { ApiGraphResponse } from "../types/api";
import { buildTemplateMap } from "../utils/buildTemplateMap";
import { buildFormsFromNodes } from "../utils/buildFormsFromNodes";
import { buildEdgesFromApi } from "../utils/buildEdgesFromApi";

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
  const forms = buildFormsFromNodes(data.nodes, templateMap)
    .sort((a, b) => a.name.localeCompare(b.name));
  const edges = buildEdgesFromApi(data.edges);

  return { forms, edges };
};
