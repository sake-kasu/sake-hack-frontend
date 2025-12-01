// ドメインモデル
export type SakeType = {
  id: number;
  name: string;
};

export type Brewery = {
  id: number;
  name: string;
  originCountry: string;
  originRegion: string | null;
  location: {
    latitude: number;
    longitude: number;
  } | null;
};

export type DrinkStyle = {
  id: number;
  name: string;
  description: string | null;
};

export type Sake = {
  id: number;
  name: string;
  type: SakeType;
  brewery: Brewery;
  abv: number;
  tasteNotes: string;
  memo: string | null;
  drinkStyles: DrinkStyle[];
  imageUrl: string | null; // 将来的な画像表示用
  createdAt: Date;
  updatedAt: Date;
};

export type SakeListParams = {
  offset?: number;
  limit?: number;
  typeId?: number;
  breweryId?: number;
};

export type SakeListMeta = {
  total: number;
  offset: number;
  limit: number;
};
