import type { ApiForm } from "../types/api";

export const buildTemplateMap = (forms: ApiForm[] = []): Map<string, ApiForm> => {
  const map = new Map<string, ApiForm>;
  forms.forEach(form => {
    map.set(form.id, form);
  });

  return map;
}