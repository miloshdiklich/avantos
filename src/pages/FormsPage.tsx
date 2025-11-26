import { useState } from 'react';
import type { Form, PrefillMappings, PrefillSource } from '../types/domain';
import { useGraphData } from '../hooks/useGraphData';
import FormList from '../components/forms/FormList';
import ConfigureFieldDialog from '../components/dialogs/ConfigureFieldDialog';
import { getParentsForForm } from '../utils/getParentsForForm';
import { formatPrefillSource } from '../utils/formatPrefillSource';
import './FormsPage.scss';

const FormsPage = () => {
  const { forms, edges, isLoading, error } = useGraphData();
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null);

  const [mappings, setMappings] = useState<PrefillMappings>({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);

  const selectedForm: Form | null =
    forms.find((form) => form.id === selectedFormId) ?? null;

  // Get direct and transitive parents
  const { direct: directParents, transitive: transitiveParents} = getParentsForForm(
    selectedFormId,
    forms,
    edges,
  );

  const currentFormMappings = selectedForm
    ? mappings[selectedForm.id] ?? {}
    : {};

  const handleOpenConfigure = (fieldId: string): void => {
    if (!selectedForm) {
      return;
    }

    setEditingFieldId(fieldId);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = (): void => {
    setIsDialogOpen(false);
    setEditingFieldId(null);
  };

  const handleSourceSelected = (source: PrefillSource): void => {
    if (!selectedForm || !editingFieldId) {
      handleCloseDialog();
      return;
    }

    const display = formatPrefillSource(source, forms);    

    setMappings((prev) => {
      const formMappings = prev[selectedForm.id] ?? {};

      return {
        ...prev,
        [selectedForm.id]: {
          ...formMappings,
          [editingFieldId]: display,
        },
      };
    });

    handleCloseDialog();
  };

  const handleClearMapping = (fieldId: string): void => {
    if (!selectedForm) {
      return;
    }

    setMappings((prev) => {
      const formMappings = { ...(prev[selectedForm.id] ?? {}) };
      delete formMappings[fieldId];

      return {
        ...prev,
        [selectedForm.id]: formMappings,
      };
    });
  };

  if (isLoading) {
    return <div className="forms-page__message">Loading forms…</div>;
  }

  if (error !== null) {
    return (
      <div className="forms-page__message forms-page__message--error">
        Error loading forms: {error}
      </div>
    );
  }

  if (forms.length === 0) {
    return <div className="forms-page__message">No forms available.</div>;
  }

  const editingField =
    selectedForm && editingFieldId
      ? selectedForm.fields.find((field) => field.id === editingFieldId) ?? null
      : null;

  return (
    <>
      <div className="forms-page">
        {/* Left panel - List of Forms */}
        <aside className="forms-page__sidebar">
          <h2 className="forms-page__title">Forms</h2>
          <FormList
            forms={forms}
            selectedFormId={selectedFormId}
            onSelectForm={setSelectedFormId}
          />
        </aside>
        
        {/* Right panel - details, prefill editor */}
        <main className="forms-page__main">
          <h2 className="forms-page__main-title">Prefill configuration</h2>

          {selectedForm === null ? (
            <p>Select a form on the left to configure its prefill rules.</p>
          ) : (
            <div>
              <h3 className="forms-page__form-name">{selectedForm.name}</h3>

              {selectedForm.fields.length === 0 ? (
                <p>This form has no fields defined in its schema.</p>
              ) : (
                <table className="forms-page__table">
                  <thead>
                    <tr>
                      <th className="forms-page__table-header">Field</th>
                      <th className="forms-page__table-header">Prefill from</th>
                      <th className="forms-page__table-header">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedForm.fields.map((field) => {
                      const sourceLabel = currentFormMappings[field.id];

                      return (
                        <tr key={field.id}>
                          <td className="forms-page__table-cell">{field.label}</td>
                          <td className="forms-page__table-cell">
                            {sourceLabel ?? 'Not configured'}
                          </td>
                          <td className="forms-page__table-cell">
                            <button
                              type="button"
                              onClick={() => handleOpenConfigure(field.id)}
                            >
                              Configure
                            </button>
                            {sourceLabel && (
                              <button
                                type="button"
                                onClick={() => handleClearMapping(field.id)}
                                className="forms-page__clear-button"
                              >
                                Clear
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </main>
      </div>

      {editingField && (
        <ConfigureFieldDialog
          isOpen={isDialogOpen}
          fieldLabel={editingField.label}
          directParents={directParents}
          transitiveParents={transitiveParents}
          onSelectSource={handleSourceSelected}
          onCancel={handleCloseDialog}
        />
      )}
    </>
  );
};

export default FormsPage;
