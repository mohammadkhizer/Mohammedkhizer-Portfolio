import { useState, useEffect, useCallback } from 'react';

export interface UseApiCollectionResult<T> {
  data: T[] | null;
  isLoading: boolean;
  error: Error | null;
  mutate: () => Promise<void>;
  add: (item: any) => Promise<any>;
  update: (id: string, item: any) => Promise<any>;
  remove: (id: string) => Promise<any>;
}

export function useApiCollection<T = any>(apiPath: string): UseApiCollectionResult<T> {
  const [data, setData] = useState<T[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(apiPath);
      if (!response.ok) {
        throw new Error(`Failed to fetch from ${apiPath}`);
      }
      const json = await response.json();
      setData(json);
      setError(null);
    } catch (err: any) {
      setError(err);
      console.error(`Error in useApiCollection(${apiPath}):`, err);
    } finally {
      setIsLoading(false);
    }
  }, [apiPath]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const add = async (item: any) => {
    try {
      const response = await fetch(apiPath, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      if (!response.ok) {
        const errJson = await response.json();
        throw new Error(errJson.error || 'Failed to add item');
      }
      const result = await response.json();
      await fetchData(); // Refetch collection to stay in sync
      return result;
    } catch (err: any) {
      console.error(`Error adding to ${apiPath}:`, err);
      throw err;
    }
  };

  const update = async (id: string, item: any) => {
    try {
      const response = await fetch(apiPath, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...item }),
      });
      if (!response.ok) {
        const errJson = await response.json();
        throw new Error(errJson.error || 'Failed to update item');
      }
      const result = await response.json();
      await fetchData(); // Refetch collection to stay in sync
      return result;
    } catch (err: any) {
      console.error(`Error updating in ${apiPath}:`, err);
      throw err;
    }
  };

  const remove = async (id: string) => {
    try {
      const response = await fetch(`${apiPath}?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errJson = await response.json();
        throw new Error(errJson.error || 'Failed to delete item');
      }
      const result = await response.json();
      await fetchData(); // Refetch collection to stay in sync
      return result;
    } catch (err: any) {
      console.error(`Error deleting from ${apiPath}:`, err);
      throw err;
    }
  };

  return {
    data,
    isLoading,
    error,
    mutate: fetchData,
    add,
    update,
    remove,
  };
}
