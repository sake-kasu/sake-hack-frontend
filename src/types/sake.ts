// ドメインモデル
export type SakeName = {
  name: string;
  phonetic: string;
}

export type SakeKind = {
  id: number;
  name: string;
};

export type SakeType = {
  id: number;
  name: string;
}

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
  id: number; // 一意に判別するID
  sakeName: SakeName // その酒の名前
  kind: SakeKind; // 大分類
  type: SakeType; // 小分類
  brewery: Brewery; // 産地
  abv: number; // 度数
  tasteNotes: string; // いる？
  PurchaseVolume: number; // 購入時容量
  RemainingVolume: number; // 残容量 25%刻みなら0~4でも良い気がする
  memo: string | null; // 自由記述
  drinkStyles: DrinkStyle[]; // おすすめの飲み方
  price: number; // 購入時価格
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
