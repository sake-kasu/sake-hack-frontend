// ドメインモデル
export type SakeName = {
  name: string;
  phonetic: string;
};

export type SakeCategory = {
  id: number;
  name: string;
};

export type SakeKind = {
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

// 酒一覧画面で必要な最低限の情報
export type Sake = {
  id: number;
  name: string;
  category: SakeCategory;
  imageUrl: string;
};

// 酒詳細画面で必要な全ての情報
export type SakeDetail = {
  id: number; // 一意に判別するID
  sakeName: SakeName; // その酒の名前
  category: SakeCategory; // 大分類
  kind: string[]; // 小分類
  originRegion: string; // 産地（一旦場所だけ）
  abv: number; // 度数
  PurchaseVolume: number; // 購入時容量s
  RemainingVolume: number; // 残容量 25%刻みなら0~4でも良い気がする
  memo: string | null; // 自由記述
  drinkStyles: string; // おすすめの飲み方
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
