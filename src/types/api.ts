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

export type ApiGraphResponse = {
  forms?: ApiForm[];
  edges?: ApiEdge[];
}
