import { useEffect, useState } from "react"
import type { Edge, Form } from "../types"
import { fetchGraphForms } from "../api/graph";

interface GraphFormsResult {
  forms: Form[],
  edges: {
    from: string,
    to: string,
  }[],
  isLoading: boolean,
  error: string | null,
}

export const useGraphForms = (): GraphFormsResult => {
  const [forms, setForms] = useState<Form[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadResults = async (): Promise<void> => {
    try {
      const graphData = await fetchGraphForms();
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
    isLoading,
    error,
  }
}