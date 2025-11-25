import { useState } from "react";
import FormList from "../components/FormList";
import { useGraphForms } from "../hooks/useGraphForms";

const FormsPage = () => {
  const { forms, isLoading, error } = useGraphForms();
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null);

  const selectedForm = forms.find(form => form.id === selectedFormId) ?? null;

  if(isLoading) {
    return <div>Loading forms...</div>
  }

  if(error !== null) {
    return <div>Error loading forms: {error}</div>
  }

  if(forms.length === 0) {
    return <div>No forms available</div>
  }

  return (
    <div>
      {/* Left panel */}
      <aside>
        <h2>Forms</h2>
        <FormList 
          forms={forms}
          selectedFormId={selectedFormId}
          onSelectForm={setSelectedFormId}
        />
      </aside>
      {/* Right panel - detail, prefill editor */}
      <main>
        <h2>prefill configuration</h2>
        {
          selectedForm === null ? (
            <p>Select a form on the left to configure its prefill rules</p>
          ) : (
            <div>
              <h3>{selectedForm.name}</h3>
              <p>Here we'll show the fields of this form and allow configuration</p>
            </div>
          )
        }
      </main>
    </div>
  )
}

export default FormsPage;
