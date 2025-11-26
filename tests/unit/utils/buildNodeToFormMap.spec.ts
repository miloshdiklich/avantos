import { describe, it, expect } from '@jest/globals';
import { buildNodeToFormMap } from '../../../src/utils/buildNodeToFormMap';
import type { ApiNode } from '../../../src/types/api';

describe('buildNodeToFormMap', () => {
  it('maps form nodes to their component_id', () => {
    const nodes: ApiNode[] = [
      {
        id: 'node-1',
        type: 'form',
        data: { component_id: 'f_1' },
      },
      {
        id: 'node-2',
        type: 'form',
        data: { component_id: 'f_2' },
      },
    ];

    const result = buildNodeToFormMap(nodes);

    expect(result).toEqual({
      'node-1': 'f_1',
      'node-2': 'f_2',
    });
  });

  it('ignores nodes that are not type "form"', () => {
    const nodes: ApiNode[] = [
      {
        id: 'node-1',
        type: 'form',
        data: { component_id: 'f_1' },
      },
      {
        id: 'node-2',
        type: 'task',
        data: { component_id: 'f_2' },
      },
    ];

    const result = buildNodeToFormMap(nodes);

    expect(result).toEqual({
      'node-1': 'f_1',
    });
  });

  it('ignores form nodes without component_id', () => {
    const nodes: ApiNode[] = [
      {
        id: 'node-1',
        type: 'form',
        data: { component_id: 'f_1' },
      },
      {
        id: 'node-2',
        type: 'form',
        data: {},
      },
      {
        id: 'node-3',
        type: 'form',
      },
    ];

    const result = buildNodeToFormMap(nodes);

    expect(result).toEqual({
      'node-1': 'f_1',
    });
  });

  it('returns an empty map when given an empty array', () => {
    const result = buildNodeToFormMap([]);
    expect(result).toEqual({});
  });
});
