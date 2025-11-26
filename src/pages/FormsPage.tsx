import { useState } from 'react';
import type { Form, PrefillMappings, PrefillSource } from '../types/domain';
import { useGraphData } from '../hooks/useGraphData';
import FormList from '../components/forms/FormList';
import ConfigureFieldDialog from '../components/forms/ConfigureFieldDialog';
import { getDirectParents, getTransitiveParents } from '../utils/graph';

const FormsPage = () => {
  const { forms, edges, isLoading, error } = useGraphData();
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null);

  const [mappings, setMappings] = useState<PrefillMappings>({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);

  const selectedForm: Form | null =
    forms.find((form) => form.id === selectedFormId) ?? null;

  const directParentIds = selectedForm
    ? getDirectParents(selectedForm.id, edges)
    : [];

  const transitiveParentIds = selectedForm
    ? getTransitiveParents(selectedForm.id, edges)
    : [];

  const directParents: Form[] = directParentIds
    .map((id) => forms.find(form => form.id === id) ?? null)
    .filter((form): form is Form => form !== null);

  const transitiveParents: Form[] = transitiveParentIds
    .map((id) => forms.find(form => form.id === id) ?? null)
    .filter((form): form is Form => form !== null);

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

    let display: string;

    if (source.type === 'form') {
      const sourceForm = forms.find(form => form.id === source.formId);
      const formName = sourceForm?.name ?? source.formId;
      display = `${formName}.${source.fieldId}`;
    } else {
      const prefix = source.category === 'action' ? 'Action' : 'Client';
      display = `${prefix}.${source.key}`;
    }

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
          <h2 style={{ marginTop: 0, textAlign: 'center' }}>Prefill configuration</h2>

          {selectedForm === null ? (
            <p>Select a form on the left to configure its prefill rules.</p>
          ) : (
            <div>
              <h3 style={{ textAlign: 'center' }}>{selectedForm.name}</h3>

              {selectedForm.fields.length === 0 ? (
                <p>This form has no fields defined in its schema.</p>
              ) : (
                <table style={{ borderCollapse: 'collapse', minWidth: '480px', margin: '0 auto' }}>
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
