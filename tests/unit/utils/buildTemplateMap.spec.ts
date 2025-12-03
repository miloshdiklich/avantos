import { describe, it, expect } from '@jest/globals';
import { buildTemplateMap } from '../../../src/utils/buildTemplateMap';
import type { ApiForm } from '../../../src/types/api';

describe('buildTemplateMap', () => {
  it('returns an empty Map when given no forms', () => {
    const result = buildTemplateMap();

    expect(result.size).toBe(0);
  });

  it('maps form ids to ApiForm objects', () => {
    const forms: ApiForm[] = [
      { id: 'f1', name: 'Form 1' },
      { id: 'f2', name: 'Form 2' },
    ];

    const result = buildTemplateMap(forms);

    expect(result.size).toBe(2);
    expect(result.get('f1')).toEqual({ id: 'f1', name: 'Form 1' });
    expect(result.get('f2')).toEqual({ id: 'f2', name: 'Form 2' });
  });

  it('handles duplicate ids by keeping the last occurrence', () => {
    const forms: ApiForm[] = [
      { id: 'f1', name: 'First' },
      { id: 'f1', name: 'Second' },
    ];

    const result = buildTemplateMap(forms);

    expect(result.size).toBe(1);
    expect(result.get('f1')).toEqual({ id: 'f1', name: 'Second' });
  });
});


