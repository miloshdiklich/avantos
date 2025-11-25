export type ApiForm = {
  id: string;
  name: string;
  field_schema?: {
    properties?: Record<string, unknown>;
  };
}

export type ApiEdge = {
  source: string;
  target: string;
}

export type ApiNode = {
  id: string,
  type?: string,
  data?: {
    component_id?: string,
  }
}

export type ApiGraphResponse = {
  forms?: ApiForm[],
  edges?: ApiEdge[],
  nodes?: ApiNode[],
}
