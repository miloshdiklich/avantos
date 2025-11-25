export type Field = {
  id: string,
  label: string
}

export type Form = {
  id: string,
  name: string,
  fields: Field[],
  // ...
}

// formId -> (fieldId -> source description)
export type PrefillMappings = Record<string, Record<string, string>>;