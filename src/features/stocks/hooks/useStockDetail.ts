import { getStocks } from "@/lib/api/generated/stocks/stocks";
import type { SakeDetail } from "@/lib/api/generated/models";
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
      const api = getStocks();
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
