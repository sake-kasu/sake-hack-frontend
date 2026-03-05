import { useEffect, useState } from "react";
import type { SakeKind } from "@/lib/api/generated/models";
import { getMaster } from "@/lib/api/generated/master/master";

type UseMasterDataReturn = {
  kinds: SakeKind[];
  isLoading: boolean;
  error: Error | null;
};

/**
 * マスタデータ（kinds）を取得するhook
 * - kinds: マウント時に全件取得
 */
export const useMasterData = (): UseMasterDataReturn => {
  const [kinds, setKinds] = useState<SakeKind[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setIsLoading(true);
        const api = getMaster();

        const kindsRes = await api.listKinds();
        setKinds(kindsRes.data ?? []);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchAll();
  }, []);

  return {
    kinds,
    isLoading,
    error,
  };
};
