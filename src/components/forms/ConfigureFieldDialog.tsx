import type { Form } from '../../types/domain';

interface ConfigureFieldDialogProps {
  isOpen: boolean;
  fieldLabel: string;
  directParents: Form[];
  transitiveParents: Form[];
  onSelectSource: (source: { type: 'form'; formId: string; fieldId: string }) => void;
  onCancel: () => void;
}

const ConfigureFieldDialog = ({
  isOpen,
  fieldLabel,
  directParents,
  transitiveParents,
  onSelectSource,
  onCancel,
}: ConfigureFieldDialogProps) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.35)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
        color: 'black'
      }}
    >
      <div
        style={{
          background: 'white',
          padding: '1rem',
          borderRadius: '4px',
          minWidth: '360px',
          maxWidth: '640px',
          maxHeight: '80vh',
          overflow: 'auto',
          boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
          color: 'black',
        }}
      >
        <h3 style={{ marginTop: 0, marginBottom: '0.5rem' }}>Configure prefill</h3>

        <p style={{ marginTop: 0, marginBottom: '1rem' }}>
          Target field: <strong>{fieldLabel}</strong>
        </p>

        {/* Direct parents */}
        <section style={{ marginBottom: '1rem' }}>
          <h4 style={{ margin: '0 0 0.5rem' }}>Direct parent forms</h4>
          {directParents.length === 0 ? (
            <p style={{ margin: 0, opacity: 0.7 }}>No direct parents available.</p>
          ) : (
            directParents.map((parent) => (
              <div key={parent.id} style={{ marginBottom: '0.5rem' }}>
                <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>
                  {parent.name}
                </div>
                <ul style={{ listStyle: 'none', paddingLeft: 0, margin: 0 }}>
                  {parent.fields.map((field) => (
                    <li key={field.id} style={{ marginBottom: '0.25rem' }}>
                      <button
                        type="button"
                        onClick={() =>
                          onSelectSource({
                            type: 'form',
                            formId: parent.id,
                            fieldId: field.id,
                          })
                        }
                        style={{
                          padding: '0.25rem 0.5rem',
                          borderRadius: '4px',
                          border: '1px solid #ccc',
                          background: '#f8f8f8',
                          cursor: 'pointer',
                          color: 'black',
                        }}
                      >
                        {field.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </section>

        {/* Transitive parents */}
        <section style={{ marginBottom: '1rem' }}>
          <h4 style={{ margin: '0 0 0.5rem' }}>Transitive parent forms</h4>
          {transitiveParents.length === 0 ? (
            <p style={{ margin: 0, opacity: 0.7 }}>No transitive parents available.</p>
          ) : (
            transitiveParents.map((parent) => (
              <div key={parent.id} style={{ marginBottom: '0.5rem' }}>
                <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>
                  {parent.name}
                </div>
                <ul style={{ listStyle: 'none', paddingLeft: 0, margin: 0 }}>
                  {parent.fields.map((field) => (
                    <li key={field.id} style={{ marginBottom: '0.25rem' }}>
                      <button
                        type="button"
                        onClick={() =>
                          onSelectSource({
                            type: 'form',
                            formId: parent.id,
                            fieldId: field.id,
                          })
                        }
                        style={{
                          padding: '0.25rem 0.5rem',
                          borderRadius: '4px',
                          border: '1px solid #ccc',
                          background: '#f8f8f8',
                          cursor: 'pointer',
                          color: 'black',
                        }}
                      >
                        {field.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </section>

        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginTop: '0.5rem',
          }}
        >
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfigureFieldDialog;