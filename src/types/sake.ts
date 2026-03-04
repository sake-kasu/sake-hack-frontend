import type { CategoryEnum } from "@/config";

export type SakeImage = {
  id: string;
  imageKey: string;
  createdAt: Date;
};

// ドメインモデル
export type Sake = {
  id: string; // uuid
  name: string;
  phonetic: string;
  image: SakeImage | null;
  category: CategoryEnum;
  description: string | null; // UI上の「小分類」に対応
  alcoholPercentage: number | null;
  volumeMax: number | null; // 最大容量（ml）
  volumeRemain: number | null; // 残り容量（%）
  region: string | null;
  price: number | null;
  memo: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type SakeListParams = {
  offset?: number;
  limit?: number;
};

export type SakeListMeta = {
  total: number;
  offset: number;
  limit: number;
};
