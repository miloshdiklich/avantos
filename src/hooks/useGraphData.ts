import { useEffect, useState } from "react"
import type { Edge, Form } from "../types/domain"
import { fetchGraphData } from "../api/fetchGraphData";

interface UseGraphData {
  forms: Form[],
  edges: Edge[],
  isLoading: boolean,
  error: string | null,
}

export const useGraphData = (): UseGraphData => {
  const [forms, setForms] = useState<Form[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadResults = async (): Promise<void> => {
    try {
      const graphData = await fetchGraphData();
      setForms(graphData.forms);
      setEdges(graphData.edges);
      setError(null);
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadResults();
  },[])


  return {
    forms,
    edges,
    isLoading,
    error,
  }
}