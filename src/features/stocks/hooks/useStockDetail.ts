import { getSakeHackBackendAPI } from "@/lib/api/generated";
import type { SakeDetail } from "@/lib/api/generated";
import { useCallback, useState } from "react";

type UseStockDetailReturn = {
  detail: SakeDetail | null;
  isLoading: boolean;
  error: Error | null;
  fetchDetail: (id: number) => Promise<void>;
  reset: () => void;
};

export const useStockDetail = (): UseStockDetailReturn => {
  const [detail, setDetail] = useState<SakeDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchDetail = useCallback(async (id: number) => {
    try {
      setIsLoading(true);
      setError(null);
      const api = getSakeHackBackendAPI();
      const response = await api.getStockDetail(id);
      setDetail(response);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("詳細取得に失敗しました"),
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setDetail(null);
    setError(null);
  }, []);

  return { detail, isLoading, error, fetchDetail, reset };
};
