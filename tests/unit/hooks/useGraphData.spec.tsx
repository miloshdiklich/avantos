/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, waitFor, cleanup } from '@testing-library/react';
import { useGraphData } from '../../../src/hooks/useGraphData';
import { fetchGraphData } from '../../../src/api/fetchGraphData';
import type { Form, Edge } from '../../../src/types/domain';

jest.mock('../../../src/api/fetchGraphData', () => ({
  fetchGraphData: jest.fn(),
}));

const mockedFetch = fetchGraphData as jest.MockedFunction<typeof fetchGraphData>;

afterEach(() => {
  mockedFetch.mockReset();
  cleanup();
});

// Small wrapper component to expose hook results
const Wrapper = ({ onUpdate }: { onUpdate: (v: ReturnType<typeof useGraphData>) => void }) => {
  const value = useGraphData();
  onUpdate(value);
  return null;
};

describe('useGraphData', () => {
  it('loads forms + edges on success', async () => {
    const forms: Form[] = [
      { id: 'f1', name: 'Form 1', fields: [] }
    ];

    const edges: Edge[] = [
      { source: 'f1', target: 'f1' }
    ];

    mockedFetch.mockResolvedValue({ forms, edges });

    const emissions: Array<ReturnType<typeof useGraphData>> = [];

    render(<Wrapper onUpdate={(v) => emissions.push(v)} />);

    // First render → loading
    expect(emissions[0].isLoading).toBe(true);

    // Wait for success state
    await waitFor(() =>
      expect(emissions[emissions.length - 1].isLoading).toBe(false)
    );

    const final = emissions[emissions.length - 1];

    expect(final.forms).toEqual(forms);
    expect(final.edges).toEqual(edges);
    expect(final.error).toBeNull();
    expect(mockedFetch).toHaveBeenCalledTimes(1);
  });

  it('handles errors', async () => {
    mockedFetch.mockRejectedValue(new Error('Boom'));

    const emissions: Array<ReturnType<typeof useGraphData>> = [];

    render(<Wrapper onUpdate={(v) => emissions.push(v)} />);

    expect(emissions[0].isLoading).toBe(true);

    await waitFor(() =>
      expect(emissions[emissions.length - 1].isLoading).toBe(false)
    );

    const final = emissions[emissions.length - 1];

    expect(final.forms).toEqual([]);
    expect(final.edges).toEqual([]);
    expect(final.error).toContain('Boom');
  });
});
