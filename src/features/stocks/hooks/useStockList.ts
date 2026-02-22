import i18n from "@/i18n/config";
import { getStocks } from "@/lib/api/generated/stocks/stocks";
import type { Sake } from "@/lib/api/generated/models";
import { useCallback, useEffect, useState } from "react";

type UseStockListReturn = {
  stocks: Sake[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
};

export const useStockList = (): UseStockListReturn => {
  const [stocks, setStocks] = useState<Sake[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchStocks = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const api = getStocks();
      const response = await api.listStocks({ limit: 100 });
      setStocks(response.data ?? []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error(i18n.t("stock.message.listFetchFailed")),
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStocks();
  }, [fetchStocks]);

  return { stocks, isLoading, error, refetch: fetchStocks };
};
