import type { Form, Edge } from "../types/domain";
import type { ApiGraphResponse } from "../types/api";
import convertApiForm from "../utils/convertApiForm";
import { buildNodeToFormMap } from "../utils/buildNodeToFormMap";

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

  const { nodeToForm, formNames } = buildNodeToFormMap(data.nodes ?? []);

  // Override name from node metadata
  const formsById = new Map<string, Form>();

  (data.forms ?? []).forEach((apiForm) => {
    if (!formsById.has(apiForm.id)) {
      formsById.set(
        apiForm.id,
        convertApiForm(apiForm, formNames[apiForm.id])
      );
    }
  });

  const forms: Form[] = Array.from(formsById.values());

  const edges: Edge[] = (data.edges ?? [])
    .map((edge) => {
      const sourceFormId = nodeToForm[edge.source];
      const targetFormId = nodeToForm[edge.target];

      if (!sourceFormId || !targetFormId) {
        return null;
      }

      return {
        source: sourceFormId,
        target: targetFormId,
      };
    })
    .filter((edge): edge is Edge => edge !== null);

  return { forms, edges };
};
