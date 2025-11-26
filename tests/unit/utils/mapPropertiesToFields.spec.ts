import { describe, it, expect } from '@jest/globals';
import mapPropertiesToFields from '../../../src/utils/mapPropertiesToFields';

describe('mapPropertiesToFields', () => {
  it('returns empty array when properties is undefined', () => {
    const result = mapPropertiesToFields(undefined);
    expect(result).toEqual([]);
  });

  it('returns empty array when properties is an empty object', () => {
    const result = mapPropertiesToFields({});
    expect(result).toEqual([]);
  });

  it('maps property keys to Field objects', () => {
    const properties = {
      name: {},
      email: {},
    };

    const result = mapPropertiesToFields(properties);

    expect(result).toEqual([
      { id: 'name', label: 'name' },
      { id: 'email', label: 'email' },
    ]);
  });

  it('works with any value type in properties', () => {
    const properties = {
      foo: { some: 'meta' },
      bar: 123,
    };

    const result = mapPropertiesToFields(properties);

    expect(result).toEqual([
      { id: 'foo', label: 'foo' },
      { id: 'bar', label: 'bar' },
    ]);
  });
});
