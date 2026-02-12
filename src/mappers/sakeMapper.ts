import type {
  Brewery as ApiBrewery,
  DrinkStyle as ApiDrinkStyle,
  Sake as ApiSake,
  SakeType as ApiSakeType,
} from "@/lib/api/generated";
import type { Brewery, DrinkStyle, Sake, SakeType } from "@/types/sake";

export const mapSakeTypeFromApi = (apiSakeType: ApiSakeType): SakeType => ({
  id: apiSakeType.id,
  name: apiSakeType.name,
});

export const mapBreweryFromApi = (apiBrewery: ApiBrewery): Brewery => ({
  id: apiBrewery.id,
  name: apiBrewery.name,
  originCountry: apiBrewery.origin_country,
  originRegion: apiBrewery.origin_region ?? null,
  location:
    apiBrewery.latitude !== null &&
    apiBrewery.latitude !== undefined &&
    apiBrewery.longitude !== null &&
    apiBrewery.longitude !== undefined
      ? {
          latitude: apiBrewery.latitude,
          longitude: apiBrewery.longitude,
        }
      : null,
});

export const mapDrinkStyleFromApi = (
  apiDrinkStyle: ApiDrinkStyle,
): DrinkStyle => ({
  id: apiDrinkStyle.id,
  name: apiDrinkStyle.name,
  description: apiDrinkStyle.description ?? null,
});

export const mapSakeFromApi = (apiSake: ApiSake): Sake => ({
  id: apiSake.id,
  name: apiSake.name,
  type: mapSakeTypeFromApi(apiSake.type),
  brewery: mapBreweryFromApi(apiSake.brewery),
  abv: apiSake.abv,
  tasteNotes: apiSake.taste_notes,
  memo: apiSake.memo ?? null,
  drinkStyles: apiSake.drink_styles.map(mapDrinkStyleFromApi),
  imageUrl: null, // 将来的に実装
  likeCount: 0, // TODO: API実装後、apiSake.like_count を使用
  createdAt: new Date(apiSake.created_at),
  updatedAt: new Date(apiSake.updated_at),
});

export const mapSakeListFromApi = (apiSakes: ApiSake[]): Sake[] => {
  return apiSakes.map(mapSakeFromApi);
};
