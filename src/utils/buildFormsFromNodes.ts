import type { ApiForm, ApiNode } from "../types/api";
import type { Form } from "../types/domain";
import mapPropertiesToFields from "./mapPropertiesToFields";

export const buildFormsFromNodes = (
  nodes: ApiNode[] = [],
  templates: Map<string, ApiForm>,
): Form[] => {
  return nodes
    .filter(node => node.type === 'form' && node.data?.component_id)
    .map(node => {
      const template = templates.get(node.data!.component_id!);

      return {
        id: node.id,
        name: node.data!.name ?? template?.name ?? node.id,
        fields: template
          ? mapPropertiesToFields(template.field_schema?.properties)
          : [],
      };
    });
};