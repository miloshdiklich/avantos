import { describe, it, expect } from '@jest/globals';
import { buildEdgesFromApi } from '../../../src/utils/buildEdgesFromApi';
import type { ApiGraphResponse } from '../../../src/types/api';

describe('buildEdgesFromApi', () => {
  it('returns an empty array when edges is undefined', () => {
    const api: ApiGraphResponse = {};

    const result = buildEdgesFromApi(api.edges);

    expect(result).toEqual([]);
  });

  it('maps ApiEdge entries to Edge objects', () => {
    const api: ApiGraphResponse = {
      edges: [
        { source: 'A', target: 'B' },
        { source: 'B', target: 'C' },
      ],
    };

    const result = buildEdgesFromApi(api.edges);

    expect(result).toEqual([
      { source: 'A', target: 'B' },
      { source: 'B', target: 'C' },
    ]);
  });
});



