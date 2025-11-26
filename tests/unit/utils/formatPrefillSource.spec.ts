import { formatPrefillSource } from '../../../src/utils/formatPrefillSource';
import type { Form, PrefillSource } from '../../../src/types/domain';

describe('formatPrefillSource', () => {
  const forms: Form[] = [
    { id: 'f1', name: 'Customer', fields: [] },
  ];

  it('formats form-based source', () => {
    const source: PrefillSource = {
      type: 'form',
      formId: 'f1',
      fieldId: 'email',
    };

    expect(formatPrefillSource(source, forms)).toBe('Customer.email');
  });

  it('formats fallback on unknown form', () => {
    const source: PrefillSource = {
      type: 'form',
      formId: 'unknown',
      fieldId: 'name',
    };

    expect(formatPrefillSource(source, forms)).toBe('unknown.name');
  });
});
