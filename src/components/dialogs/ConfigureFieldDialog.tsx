import type { Form, PrefillSource } from '../../types/domain';
import './ConfigureFieldDialog.scss';

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
    <div className="configure-field-dialog-backdrop">
      <div className="configure-field-dialog">
        <h3 className="configure-field-dialog__title">
          Configure prefill
        </h3>

        <p className="configure-field-dialog__subtitle">
          Target field: <strong>{fieldLabel}</strong>
        </p>

        {/* Direct parents */}
        <section className="configure-field-dialog__section">
          <h4 className="configure-field-dialog__section-title">Direct parent forms</h4>
          {directParents.length === 0 ? (
            <p className="configure-field-dialog__empty-state">No direct parents available.</p>
          ) : (
            directParents.map((parent) => (
              <div key={parent.id} className="configure-field-dialog__parent-block">
                <div className="configure-field-dialog__parent-name">
                  {parent.name}
                </div>
                <ul className="configure-field-dialog__list">
                  {parent.fields.map((field) => (
                    <li key={field.id} className="configure-field-dialog__list-item">
                      <button
                        type="button"
                        onClick={() =>
                          onSelectSource({
                            type: 'form',
                            formId: parent.id,
                            fieldId: field.id,
                          })
                        }
                        className="configure-field-dialog__chip-button"
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
        <section className="configure-field-dialog__section">
          <h4 className="configure-field-dialog__section-title">Transitive parent forms</h4>
          {transitiveParents.length === 0 ? (
            <p className="configure-field-dialog__empty-state">No transitive parents available.</p>
          ) : (
            transitiveParents.map((parent) => (
              <div key={parent.id} className="configure-field-dialog__parent-block">
                <div className="configure-field-dialog__parent-name">
                  {parent.name}
                </div>
                <ul className="configure-field-dialog__list">
                  {parent.fields.map((field) => (
                    <li key={field.id} className="configure-field-dialog__list-item">
                      <button
                        type="button"
                        onClick={() =>
                          onSelectSource({
                            type: 'form',
                            formId: parent.id,
                            fieldId: field.id,
                          })
                        }
                        className="configure-field-dialog__chip-button"
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
        <section className="configure-field-dialog__section">
          <h4 className="configure-field-dialog__section-title">Global data</h4>

          <div>
            <div className="configure-field-dialog__parent-name">Action properties</div>
            <ul className="configure-field-dialog__list">
              {actionProperties.map((key) => (
                <li key={key} className="configure-field-dialog__list-item">
                  <button
                    type="button"
                    onClick={() =>
                      onSelectSource({
                        type: 'global',
                        category: 'action',
                        key,
                      })
                    }
                    className="configure-field-dialog__chip-button"
                  >
                    {key}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="configure-field-dialog__parent-name">Client organisation properties</div>
            <ul className="configure-field-dialog__list">
              {clientProperties.map((key) => (
                <li key={key} className="configure-field-dialog__list-item">
                  <button
                    type="button"
                    onClick={() =>
                      onSelectSource({
                        type: 'global',
                        category: 'client',
                        key,
                      })
                    }
                    className="configure-field-dialog__chip-button"
                  >
                    {key}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <div className="configure-field-dialog__footer">
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfigureFieldDialog;
