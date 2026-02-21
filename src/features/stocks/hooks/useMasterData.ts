import type { Brewery, DrinkStyle, SakeKind } from "@/lib/api/generated";

type UseMasterDataReturn = {
  kinds: SakeKind[];
  breweries: Brewery[];
  drinkStyles: DrinkStyle[];
  isLoading: boolean;
  error: Error | null;
};

/**
 * マスタデータ（kinds, breweries, drinkStyles）を取得するhook
 * TODO: マスタデータAPIが実装されたら、実際のAPI呼び出しに置き換える
 *   - GET /api/kinds → kinds
 *   - GET /api/breweries → breweries
 *   - GET /api/drink-styles → drinkStyles
 */
export const useMasterData = (): UseMasterDataReturn => {
  return {
    kinds: [],
    breweries: [],
    drinkStyles: [],
    isLoading: false,
    error: null,
  };
};
