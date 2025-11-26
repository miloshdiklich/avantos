import { describe, it, expect } from '@jest/globals';
import type { Form, Edge } from '../../../src/types/domain';
import { getParentsForForm } from '../../../src/utils/getParentsForForm';

const createForm = (id: string, name: string): Form => ({
  id,
  name,
  fields: [],
});

describe('getParentsForForm', () => {
  const forms: Form[] = [
    createForm('A', 'Form A'),
    createForm('B', 'Form B'),
    createForm('C', 'Form C'),
    createForm('D', 'Form D'),
  ];

  // A -> B -> C, A -> D
  const edges: Edge[] = [
    { source: 'A', target: 'B' },
    { source: 'B', target: 'C' },
    { source: 'A', target: 'D' },
  ];

  it('returns empty arrays when formId is null', () => {
    const result = getParentsForForm(null, forms, edges);
    expect(result.direct).toEqual([]);
    expect(result.transitive).toEqual([]);
  });

  it('returns empty arrays when form does not exist', () => {
    const result = getParentsForForm('X', forms, edges);
    expect(result.direct).toEqual([]);
    expect(result.transitive).toEqual([]);
  });

  it('returns direct parents correctly', () => {
    const result = getParentsForForm('B', forms, edges);
    const directIds = result.direct.map(form => form.id);
    expect(directIds).toEqual(['A']);
  });

  it('returns direct + transitive parents correctly for a deeper node', () => {
    const result = getParentsForForm('C', forms, edges);
    const directIds = result.direct.map(form => form.id);
    const transitiveIds = result.transitive.map(form => form.id);

    expect(directIds).toEqual(['B']);
    expect(transitiveIds).toEqual(['A']);
  });

  it('excludes direct parents from the transitive list', () => {
    const result = getParentsForForm('B', forms, edges);
    const transitiveIds = result.transitive.map(form => form.id);

    expect(transitiveIds).not.toContain('A');
  });

  it('handles cycles without including the form itself as a parent', () => {
    const cyclicEdges: Edge[] = [
      { source: 'A', target: 'B' },
      { source: 'B', target: 'A' },
    ];

    const result = getParentsForForm('A', forms, cyclicEdges);
    const directIds = result.direct.map(form => form.id);
    const transitiveIds = result.transitive.map(form => form.id);

    expect(directIds).toEqual(['B']);
    expect(transitiveIds).toEqual([]);
  });
});
