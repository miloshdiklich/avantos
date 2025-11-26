import type { ApiForm } from "../types/api";
import type { Form } from "../types/domain";
import mapPropertiesToFields from "./mapPropertiesToFields";

const convertApiForm = (apiForm: ApiForm): Form => {
  return {
    id: apiForm.id,
    name: apiForm.name,
    fields: mapPropertiesToFields(apiForm.field_schema?.properties),
  };
}

export default convertApiForm;
