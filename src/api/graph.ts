import type { Form, Edge } from "../types/domain";
import type { ApiGraphResponse } from "../types/api";
import convertApiForm from "../utils/convertApiForm";

interface GraphData {
  forms: Form[],
  edges: Edge[],
}

const GRAPH_ENDPOINT = `${import.meta.env.VITE_GRAPH_BASE_URL.replace(/\/$/, '')}/api/v1/test/actions/blueprints/my-blueprint/graph`;


export const fetchGraphForms = async (): Promise<GraphData> => {
  const response = await fetch(GRAPH_ENDPOINT);

  if(!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  const data = (await response.json()) as ApiGraphResponse;

  const forms: Form[] = (data.forms ?? []).map(convertApiForm);

  const edges: Edge[] = (data.edges ?? []).map(edge => ({
    source: edge.source,
    target: edge.target,
  })) 

  return { forms, edges };
}