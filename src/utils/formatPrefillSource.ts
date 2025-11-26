import type { Form, PrefillSource } from "../types/domain";

export const formatPrefillSource = (
  source: PrefillSource,
  forms: Form[],
): string => {
  if(source.type === 'form') {
    const sourceForm = forms.find(form => form.id === source.formId);
    const formName = sourceForm?.name ?? source.formId;
    return `${formName}.${source.fieldId}`;
  }

  //global
  const prefix = source.category === 'action' ? 'Action' : 'Client';
  return `${prefix}.${source.key}`;
}