import { useEffect, useState } from 'react';

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

  const handleSaveClick = (): void => {
    const trimmed = value.trim();
    if (!trimmed) {
      return;
    }

    onSave(trimmed);
  };

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
          padding: '2rem',
          borderRadius: '4px',
          minWidth: '320px',
          // maxWidth: '480px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
        }}
      >
        <h3 style={{ marginTop: 0, marginBottom: '0.5rem' }}>Configure prefill</h3>

        <p style={{ marginTop: 0, marginBottom: '0.75rem' }}>
          Target field: <strong>{fieldLabel}</strong>
        </p>

        <label style={{ display: 'block', marginBottom: '0.75rem' }}>
          <span style={{ display: 'block', marginBottom: '0.25rem' }}>
            Source (temporary free text):
          </span>
          <input
            type="text"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            style={{ width: '100%', padding: '0.4rem', backgroundColor: 'white' }}
            placeholder="e.g. Form A.email or client.name"
          />
        </label>

        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '0.5rem',
          }}
        >
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSaveClick}
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