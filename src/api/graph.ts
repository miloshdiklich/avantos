import type { Field, Edge } from "../types";

interface GraphResponse {
  forms: {
    id: string,
    name: string,
    field_schema?: {
      properties?: Record<string, unknown>,
    },
  }[]
  edges: Edge[]
}

const GRAPH_ENDPOINT = `${import.meta.env.VITE_GRAPH_BASE_URL.replace(/\/$/, '')}/api/v1/test/actions/blueprints/my-blueprint/graph`;

const mapFieldsFromSchema = (fieldSchema: GraphResponse['forms'][number]['field_schema']): Field[] => {
  const properties = fieldSchema?.properties ?? {};

  return Object.keys(properties).map(key => ({
    id: key,
    label: key,
  }))
}

export const fetchGraphForms = async (): Promise<GraphResponse> => {
  const response = await fetch(GRAPH_ENDPOINT);

  if(!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  const data = (await response.json()) as GraphResponse;

  const mappedEdges = data.edges.map(edge => ({
    source: edge.source,
    target: edge.target,
  }));

  return {
    forms: data.forms.map(form => ({
      id: form.id,
      name: form.name,
      fields: mapFieldsFromSchema(form.field_schema)
    })),
    edges: mappedEdges,
  }
}