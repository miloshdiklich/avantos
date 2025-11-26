import { describe, it, expect } from '@jest/globals';
import convertApiForm from '../../../src/utils/convertApiForm';
import type { ApiForm } from '../../../src/types/api';

describe('convertApiForm', () => {
  it('converts ApiForm with field_schema.properties to a Form with fields', () => {
    const apiForm: ApiForm = {
      id: 'f_123',
      name: 'Test Form',
      field_schema: {
        properties: {
          email: {},
          name: {},
        },
      },
    };

    const result = convertApiForm(apiForm);

    expect(result.id).toBe('f_123');
    expect(result.name).toBe('Test Form');
    expect(result.fields).toEqual([
      { id: 'email', label: 'email' },
      { id: 'name', label: 'name' },
    ]);
  });

  it('handles missing field_schema by producing an empty fields array', () => {
    const apiForm: ApiForm = {
      id: 'f_456',
      name: 'No Schema Form',
    };

    const result = convertApiForm(apiForm);

    expect(result.fields).toEqual([]);
  });

  it('handles field_schema without properties as empty fields array', () => {
    const apiForm: ApiForm = {
      id: 'f_789',
      name: 'Empty Schema Form',
      field_schema: {},
    };

    const result = convertApiForm(apiForm);

    expect(result.fields).toEqual([]);
  });
});
