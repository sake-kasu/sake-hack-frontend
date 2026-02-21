import { getSakes } from "@/lib/api/generated/sakes/sakes";
import type { Sake } from "@/lib/api/generated/models";
import { useCallback, useEffect, useState } from "react";

type UseSakeListReturn = {
  sakes: Sake[];
  isLoading: boolean;
  error: Error | null;
  updateSakeLike: (sakeId: number, isLiked: boolean, likeCount: number) => void;
};

export const useSakeList = (): UseSakeListReturn => {
  const [sakes, setSakes] = useState<Sake[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchSakes = async () => {
      try {
        setIsLoading(true);
        const api = getSakes();
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

  const updateSakeLike = useCallback(
    (sakeId: number, isLiked: boolean, likeCount: number) => {
      setSakes((prev) =>
        prev.map((sake) =>
          sake.id === sakeId ? { ...sake, isLiked, likeCount } : sake,
        ),
      );
    },
    [],
  );

  return { sakes, isLoading, error, updateSakeLike };
};
