import { useEffect, useState } from "react"
import type { Form } from "../types"
import { fetchGraphForms } from "../api/graph";

interface GraphFormsResult {
  forms: Form[],
  isLoading: boolean,
  error: string | null,
}

export const useGraphForms = (): GraphFormsResult => {
  const [forms, setForms] = useState<Form[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadResults = async (): Promise<void> => {
    try {
      const formsData = await fetchGraphForms();
      setForms(formsData);
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