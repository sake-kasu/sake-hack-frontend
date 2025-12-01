import { getSakeHackBackendAPI } from "@/lib/api/generated";
import { mapSakeListFromApi } from "@/mappers/sakeMapper";
import type { Sake } from "@/types/sake";
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
          const domainSakes = mapSakeListFromApi(response.data);
          setSakes(domainSakes);
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
