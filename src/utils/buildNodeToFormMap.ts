import type { ApiNode } from "../types/api";

export interface NodeToFormMap {
  nodeToForm: Record<string, string>;
  formNames: Record<string, string>;
}

export const buildNodeToFormMap = (nodes: ApiNode[]): NodeToFormMap => {
  const nodeToForm: Record<string, string> = {};
  const formNames: Record<string, string> = {};

  nodes.forEach((node) => {
    if (node.type === 'form' && node.data?.component_id) {
      const formId = node.data.component_id;

      nodeToForm[node.id] = formId;

      if (!formNames[formId]) {
        formNames[formId] = node.data.name ?? formId;
      }
    }
  });

  return { nodeToForm, formNames };
};
