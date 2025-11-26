import type { Form, PrefillSource } from '../../types/domain';

interface ConfigureFieldDialogProps {
  isOpen: boolean;
  fieldLabel: string;
  directParents: Form[];
  transitiveParents: Form[];
  onSelectSource: (source: PrefillSource) => void;
  onCancel: () => void;
}

const actionProperties: string[] = ['status', 'created_at', 'type'];
const clientProperties: string[] = ['name', 'id', 'segment'];

const sectionTitleStyle: React.CSSProperties = {
  margin: '0 0 0.5rem',
};

const chipButtonStyle: React.CSSProperties = {
  padding: '0.25rem 0.5rem',
  borderRadius: '4px',
  border: '1px solid #ccc',
  background: '#f8f8f8',
  cursor: 'pointer',
  color: 'black',
};

const listStyle: React.CSSProperties = {
  listStyle: 'none',
  paddingLeft: 0,
  margin: 0,
};

const listItemStyle: React.CSSProperties = {
  marginBottom: '0.25rem',
};

const parentBlockStyle: React.CSSProperties = {
  marginBottom: '0.5rem',
};

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
        color: 'black',
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
        }}
      >
        <h3 style={{ marginTop: 0, marginBottom: '0.5rem', textAlign: 'center' }}>
          Configure prefill
        </h3>

        <p style={{ marginTop: 0, marginBottom: '1rem', textAlign: 'center' }}>
          Target field: <strong>{fieldLabel}</strong>
        </p>

        {/* Direct parents */}
        <section style={{ marginBottom: '1rem' }}>
          <h4 style={sectionTitleStyle}>Direct parent forms</h4>
          {directParents.length === 0 ? (
            <p style={{ margin: 0, opacity: 0.7 }}>No direct parents available.</p>
          ) : (
            directParents.map((parent) => (
              <div key={parent.id} style={parentBlockStyle}>
                <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>
                  {parent.name}
                </div>
                <ul style={listStyle}>
                  {parent.fields.map((field) => (
                    <li key={field.id} style={listItemStyle}>
                      <button
                        type="button"
                        onClick={() =>
                          onSelectSource({
                            type: 'form',
                            formId: parent.id,
                            fieldId: field.id,
                          })
                        }
                        style={chipButtonStyle}
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
          <h4 style={sectionTitleStyle}>Transitive parent forms</h4>
          {transitiveParents.length === 0 ? (
            <p style={{ margin: 0, opacity: 0.7 }}>No transitive parents available.</p>
          ) : (
            transitiveParents.map((parent) => (
              <div key={parent.id} style={parentBlockStyle}>
                <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>
                  {parent.name}
                </div>
                <ul style={listStyle}>
                  {parent.fields.map((field) => (
                    <li key={field.id} style={listItemStyle}>
                      <button
                        type="button"
                        onClick={() =>
                          onSelectSource({
                            type: 'form',
                            formId: parent.id,
                            fieldId: field.id,
                          })
                        }
                        style={chipButtonStyle}
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

        {/* Global data */}
        <section style={{ marginBottom: '1rem' }}>
          <h4 style={sectionTitleStyle}>Global data</h4>

          <div style={{ marginBottom: '0.5rem' }}>
            <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Action properties</div>
            <ul style={listStyle}>
              {actionProperties.map((key) => (
                <li key={key} style={listItemStyle}>
                  <button
                    type="button"
                    onClick={() =>
                      onSelectSource({
                        type: 'global',
                        category: 'action',
                        key,
                      })
                    }
                    style={chipButtonStyle}
                  >
                    {key}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>
              Client organisation properties
            </div>
            <ul style={listStyle}>
              {clientProperties.map((key) => (
                <li key={key} style={listItemStyle}>
                  <button
                    type="button"
                    onClick={() =>
                      onSelectSource({
                        type: 'global',
                        category: 'client',
                        key,
                      })
                    }
                    style={chipButtonStyle}
                  >
                    {key}
                  </button>
                </li>
              ))}
            </ul>
          </div>
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
