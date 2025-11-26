import { useState } from 'react';
import type { Form, PrefillMappings, PrefillSource } from '../types/domain';
import { useGraphData } from '../hooks/useGraphData';
import FormList from '../components/forms/FormList';
import ConfigureFieldDialog from '../components/forms/ConfigureFieldDialog';
import { getParentsForForm } from '../utils/getParentsForForm';
import { formatPrefillSource } from '../utils/formatPrefillSource';

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
        {/* Left panel - List of Forms */}
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
        
        {/* Right panel - details, prefill editor */}
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
