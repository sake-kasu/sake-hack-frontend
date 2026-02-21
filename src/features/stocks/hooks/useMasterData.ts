import { useCallback, useEffect, useState } from "react";
import type { Brewery, DrinkStyle, SakeKind } from "@/lib/api/generated/models";
import { getMaster } from "@/lib/api/generated/master/master";

type UseMasterDataReturn = {
  kinds: SakeKind[];
  breweries: Brewery[];
  drinkStyles: DrinkStyle[];
  isLoading: boolean;
  error: Error | null;
  searchBreweries: (keyword: string) => Promise<void>;
};

/**
 * マスタデータ（kinds, breweries, drinkStyles）を取得するhook
 * - kinds, drinkStyles: マウント時に全件取得
 * - breweries: マウント時に初期取得 + キーワード検索対応
 */
export const useMasterData = (): UseMasterDataReturn => {
  const [kinds, setKinds] = useState<SakeKind[]>([]);
  const [breweries, setBreweries] = useState<Brewery[]>([]);
  const [drinkStyles, setDrinkStyles] = useState<DrinkStyle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setIsLoading(true);
        const api = getMaster();

        const [kindsRes, breweriesRes, drinkStylesRes] = await Promise.all([
          api.listKinds(),
          api.listBreweries({ limit: 100 }),
          api.listDrinkStyles(),
        ]);

        setKinds(kindsRes.data ?? []);
        setBreweries(breweriesRes.data ?? []);
        setDrinkStyles(drinkStylesRes.data ?? []);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchAll();
  }, []);

  const searchBreweries = useCallback(async (keyword: string) => {
    try {
      const api = getMaster();
      const res = await api.listBreweries({
        keyword: keyword || undefined,
        limit: 100,
      });
      setBreweries(res.data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"));
    }
  }, []);

  return {
    kinds,
    breweries,
    drinkStyles,
    isLoading,
    error,
    searchBreweries,
  };
};
