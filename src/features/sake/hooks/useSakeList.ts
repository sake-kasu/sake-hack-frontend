import { getSakeHackBackendAPI } from "@/lib/api/generated";
import type { Sake } from "@/lib/api/generated";
import { useEffect, useState } from "react";

type UseSakeListReturn = {
  sakes: Sake[];
  isLoading: boolean;
  error: Error | null;
};

export const useSakeList = (): UseSakeListReturn => {
  const [sakes, setSakes] = useState<Sake[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchSakes = async () => {
      try {
        setIsLoading(true);
        const api = getSakeHackBackendAPI();
        const response = await api.listSakes({ limit: 100 });

        if (response.data) {
          setSakes(response.data);
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchSakes();
  }, []);

  return { sakes, isLoading, error };
};
