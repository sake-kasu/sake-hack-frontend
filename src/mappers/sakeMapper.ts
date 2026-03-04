import { CATEGORY_ENUM } from "@/config";
import type { Sake as ApiSake } from "@/lib/api/generated";
import type { Sake } from "@/types/sake";

export const mapSakeFromApi = (apiSake: ApiSake): Sake => ({
  id: String(apiSake.id), // TODO: API更新後はuuidに変更
  name: apiSake.name,
  phonetic: "", // TODO: API未実装
  image: null, // TODO: API未実装
  category: CATEGORY_ENUM.OTHER, // TODO: API更新後に正しいcategoryフィールドを使用
  description: apiSake.taste_notes, // 暫定: 現APIのtaste_notesをdescription(小分類)に充当
  alcoholPercentage: apiSake.abv,
  volumeMax: null, // TODO: API未実装
  volumeRemain: null, // TODO: API未実装
  region: apiSake.brewery.origin_region ?? null, // 暫定: 現APIのbrewery.origin_regionを使用
  price: null, // TODO: API未実装
  memo: apiSake.memo ?? null,
  createdAt: new Date(apiSake.created_at),
  updatedAt: new Date(apiSake.updated_at),
});

export const mapSakeListFromApi = (apiSakes: ApiSake[]): Sake[] => {
  return apiSakes.map(mapSakeFromApi);
};
