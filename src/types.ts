export type Field = {
  id: string,
  label: string
}

export type Edge = {
  source: string,
  target: string,
}

export type Form = {
  id: string,
  name: string,
  fields: Field[],
  edges: Edge[],
}

// formId -> (fieldId -> source description)
export type PrefillMappings = Record<string, Record<string, string>>;