import { describe, it, expect } from '@jest/globals';
import type { Form, Edge } from '../../../src/types/domain';
import { sortFormsTopologically } from '../../../src/utils/sortFormsTopologially';

const createForm = (id: string, name: string): Form => ({
  id,
  name,
  fields: [],
});

describe('sortFormsTopologially', () => {
  it('returns empty array when there are no forms', () => {
    const result = sortFormsTopologically([], []);
    expect(result).toEqual([]);
  });

  it('returns forms in their original order when there are no edges', () => {
    const forms: Form[] = [
      createForm('A', 'Form A'),
      createForm('B', 'Form B'),
      createForm('C', 'Form C'),
    ];

    const result = sortFormsTopologically(forms, []);

    expect(result.map(f => f.id)).toEqual(['A', 'B', 'C']);
  });

  it('sorts forms respecting dependencies for a simple chain', () => {
    // A -> B -> C
    const forms: Form[] = [
      createForm('A', 'Form A'),
      createForm('B', 'Form B'),
      createForm('C', 'Form C'),
    ];

    const edges: Edge[] = [
      { source: 'A', target: 'B' },
      { source: 'B', target: 'C' },
    ];

    const result = sortFormsTopologically(forms, edges);

    expect(result.map(f => f.id)).toEqual(['A', 'B', 'C']);
  });

  it('handles branching dependencies', () => {
    // A -> C, B -> C, A and B have no dependency relationship
    const forms: Form[] = [
      createForm('A', 'Form A'),
      createForm('B', 'Form B'),
      createForm('C', 'Form C'),
    ];

    const edges: Edge[] = [
      { source: 'A', target: 'C' },
      { source: 'B', target: 'C' },
    ];

    const result = sortFormsTopologically(forms, edges);
    const ids = result.map(f => f.id);

    // A and B must both come before C; between A and B, original order is preserved
    expect(ids.indexOf('C')).toBeGreaterThan(ids.indexOf('A'));
    expect(ids.indexOf('C')).toBeGreaterThan(ids.indexOf('B'));
    expect(ids.slice(0, 2)).toEqual(['A', 'B']);
  });

  it('ignores edges that reference unknown forms', () => {
    const forms: Form[] = [
      createForm('A', 'Form A'),
      createForm('B', 'Form B'),
    ];

    const edges: Edge[] = [
      { source: 'A', target: 'B' },
      // Unknown nodes, should be ignored
      { source: 'X', target: 'A' },
      { source: 'B', target: 'Y' },
    ];

    const result = sortFormsTopologically(forms, edges);

    expect(result.map(f => f.id)).toEqual(['A', 'B']);
  });

  it('places forms that are only in cycles after all reachable forms', () => {
    const forms: Form[] = [
      createForm('A', 'Form A'),
      createForm('B', 'Form B'),
      createForm('C', 'Form C'),
    ];

    // A and B form a cycle, C is independent
    const edges: Edge[] = [
      { source: 'A', target: 'B' },
      { source: 'B', target: 'A' },
    ];

    const result = sortFormsTopologically(forms, edges);
    const ids = result.map(f => f.id);

    // C should appear first (no dependencies), the cycle participants follow in original order
    expect(ids[0]).toBe('C');
    expect(ids.slice(1)).toEqual(['A', 'B']);
  });
});


