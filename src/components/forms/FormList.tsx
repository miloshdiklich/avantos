import type { Form } from "../../types/domain"

interface FormListProps {
  forms: Form[],
  selectedFormId: string | null,
  onSelectForm: (formId: string) => void,
}

const FormList = ({
  forms,
  selectedFormId,
  onSelectForm,
}: FormListProps) => {

  return (
    <ul>
      {
        forms.map(form => (
          <li key={form.id}>
            <button
              type="button"
              onClick={() => onSelectForm(form.id)}
              style={{
                border: form.id === selectedFormId ? '2px solid green' : '1px solid #ccc'
              }}
            >
              {form.name}
            </button>
          </li>
        ))
      }
    </ul>
  );  
}

export default FormList;
