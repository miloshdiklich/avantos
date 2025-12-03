import { describe, it, expect } from '@jest/globals';
import { buildFormsFromNodes } from '../../../src/utils/buildFormsFromNodes';
import type { ApiForm, ApiNode } from '../../../src/types/api';

describe('buildFormsFromNodes', () => {
  const templateForms: ApiForm[] = [
    {
      id: 't1',
      name: 'Template 1',
      field_schema: {
        properties: {
          email: {},
          name: {},
        },
      },
    },
    {
      id: 't2',
      name: 'Template 2',
      field_schema: {},
    },
  ];

  const templatesMap = new Map<string, ApiForm>(
    templateForms.map(form => [form.id, form]),
  );

  it('returns empty array when there are no nodes', () => {
    const result = buildFormsFromNodes([], templatesMap);
    expect(result).toEqual([]);
  });

  it('filters to only form-type nodes with a component_id and maps them to Forms', () => {
    const nodes: ApiNode[] = [
      {
        id: 'n1',
        type: 'form',
        data: {
          component_id: 't1',
          name: 'Custom Name',
        },
      },
      {
        id: 'n2',
        type: 'form',
        data: {
          component_id: 't2',
        },
      },
      {
        id: 'n3',
        type: 'not-form',
        data: {
          component_id: 't1',
        },
      },
      {
        id: 'n4',
        type: 'form',
        data: {},
      },
    ];

    const result = buildFormsFromNodes(nodes, templatesMap);

    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      id: 'n1',
      name: 'Custom Name',
      fields: [
        { id: 'email', label: 'email' },
        { id: 'name', label: 'name' },
      ],
    });
    expect(result[1]).toEqual({
      id: 'n2',
      name: 'Template 2',
      fields: [],
    });
  });

  it('falls back to template name and then node id when node name is missing', () => {
    const nodes: ApiNode[] = [
      {
        id: 'n1',
        type: 'form',
        data: {
          component_id: 't1',
        },
      },
      {
        id: 'n2',
        type: 'form',
        data: {
          component_id: 'unknown',
        },
      },
    ];

    const result = buildFormsFromNodes(nodes, templatesMap);

    expect(result[0].name).toBe('Template 1');
    expect(result[1].name).toBe('n2');
  });
});


