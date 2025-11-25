import type { Field } from "../types/domain";

const mapPropertiesToFields = (
  properties?: Record<string, unknown>,
): Field[] => {
  if (!properties) {
    return [];
  }

  return Object.keys(properties).map((key) => ({
    id: key,
    label: key,
  }));
};

export default mapPropertiesToFields;

