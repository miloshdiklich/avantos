export type Field = {
  id: string,
  label: string,
}

export type Form = {
  id: string,
  name: string,
  fields: Field[],
}

export type Edge = {
  source: string,
  target: string,
}

// formId -> (fieldId -> sourceLabel)
export type PrefillMappings = Record<string, Record<string, string>>;

export type PrefillSource = 
  | {
      type: 'form',
      formId: string,
      fieldId: string,
    }
  | {
      type: 'global',
      category: 'action' | 'client',
      key: string,
    }
