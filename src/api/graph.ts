import type { Form } from "../types";

interface GraphResponse {
  forms: {
    id: string,
    name: string,
  }[]
  // edges..
}

const GRAPH_ENDPOINT = `${import.meta.env.VITE_GRAPH_BASE_URL.replace(/\/$/, '')}/api/v1/test/actions/blueprints/my-blueprint/graph`;

export const fetchGraphForms = async (): Promise<Form[]> => {
  const response = await fetch(GRAPH_ENDPOINT);

  if(!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  const data = (await response.json()) as GraphResponse;

  return data.forms.map(form => ({
    id: form.id,
    name: form.name,
  }))
}