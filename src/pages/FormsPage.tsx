import { useState } from 'react';
import type { Form, PrefillMappings } from '../types/domain';
import { useGraphData } from '../hooks/useGraphData';
import FormList from '../components/forms/FormList';
import ConfigureFieldDialog from '../components/forms/ConfigureFieldDialog';

const FormsPage = () => {
  const { forms, isLoading, error } = useGraphData();
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null);

  const [mappings, setMappings] = useState<PrefillMappings>({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);

  const selectedForm: Form | null =
    forms.find((form) => form.id === selectedFormId) ?? null;

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

  const handleSaveMapping = (sourceLabel: string): void => {
    if (!selectedForm || !editingFieldId) {
      handleCloseDialog();
      return;
    }

    setMappings((prev) => {
      const formMappings = prev[selectedForm.id] ?? {};

      return {
        ...prev,
        [selectedForm.id]: {
          ...formMappings,
          [editingFieldId]: sourceLabel,
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
    return <div style={{ padding: '1rem' }}>Loading forms…</div>;
  }

  if (error !== null) {
    return (
      <div style={{ padding: '1rem', color: 'red' }}>
        Error loading forms: {error}
      </div>
    );
  }

  if (forms.length === 0) {
    return <div style={{ padding: '1rem' }}>No forms available.</div>;
  }

  const editingField =
    selectedForm && editingFieldId
      ? selectedForm.fields.find((field) => field.id === editingFieldId) ?? null
      : null;

  return (
    <>
      <div style={{ display: 'flex', height: '100vh' }}>
        <aside
          style={{
            width: '260px',
            borderRight: '1px solid #ddd',
            padding: '1rem',
          }}
        >
          <h2 style={{ marginTop: 0 }}>Forms</h2>
          <FormList
            forms={forms}
            selectedFormId={selectedFormId}
            onSelectForm={setSelectedFormId}
          />
        </aside>

        <main style={{ flex: 1, padding: '1rem' }}>
          <h2 style={{ marginTop: 0 }}>Prefill configuration</h2>

          {selectedForm === null ? (
            <p>Select a form on the left to configure its prefill rules.</p>
          ) : (
            <div>
              <h3>{selectedForm.name}</h3>

              {selectedForm.fields.length === 0 ? (
                <p>This form has no fields defined in its schema.</p>
              ) : (
                <table style={{ borderCollapse: 'collapse', minWidth: '480px' }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'left', padding: '4px' }}>Field</th>
                      <th style={{ textAlign: 'left', padding: '4px' }}>Prefill from</th>
                      <th style={{ textAlign: 'left', padding: '4px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedForm.fields.map((field) => {
                      const sourceLabel = currentFormMappings[field.id];

                      return (
                        <tr key={field.id}>
                          <td style={{ padding: '4px' }}>{field.label}</td>
                          <td style={{ padding: '4px' }}>
                            {sourceLabel ?? 'Not configured'}
                          </td>
                          <td style={{ padding: '4px' }}>
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
                                style={{ marginLeft: '0.5rem' }}
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
          initialValue={currentFormMappings[editingField.id] ?? ''}
          onSave={handleSaveMapping}
          onCancel={handleCloseDialog}
        />
      )}
    </>
  );
};

export default FormsPage;