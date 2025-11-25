import { useState, useEffect } from 'react';

interface ConfigureFieldDialogProps {
  isOpen: boolean;
  fieldLabel: string;
  initialValue: string;
  onSave: (value: string) => void;
  onCancel: () => void;
}

const ConfigureFieldDialog = ({
  isOpen,
  fieldLabel,
  initialValue,
  onSave,
  onCancel,
}: ConfigureFieldDialogProps) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    if (isOpen) {
      setValue(initialValue);
    }
  }, [isOpen, initialValue]);

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
      }}
    >
      <div
        style={{
          background: 'white',
          padding: '1rem',
          borderRadius: '4px',
          minWidth: '320px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
        }}
      >
        <h3 style={{ marginTop: 0 }}>Configure prefill</h3>
        <p style={{ marginBottom: '0.5rem' }}>
          Target field: <strong>{fieldLabel}</strong>
        </p>

        <label style={{ display: 'block', marginBottom: '0.5rem' }}>
          Source (temporary free text):
          <input
            type="text"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            style={{ width: '100%', marginTop: '0.25rem' }}
            placeholder="e.g. Form A.email or client.name"
          />
        </label>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onSave(value.trim())}
            disabled={value.trim().length === 0}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfigureFieldDialog;

