import { SakeCategory } from "@/lib/api/generated/models";
import { isValidInput } from "@/utils/validation";
import * as yup from "yup";

const sakeCategoryValues = Object.values(SakeCategory);

/** SakeCategoryの型ガード */
export const isSakeCategory = (value: string): value is SakeCategory =>
  sakeCategoryValues.some((v) => v === value);

// isValidInput のカスタムテスト（空文字は許容）
const validInputTest: yup.TestConfig<string | undefined, yup.AnyObject> = {
  name: "validInput",
  message: "不正な文字列の入力です",
  test: (value) => {
    if (value === undefined || value === "") return true;
    return isValidInput(value);
  },
};

/**
 * CreateSakeRequest / UpdateSakeRequest の型定義に基づくバリデーションスキーマ
 *
 * 必須フィールド (型に `?` なし):
 *   category, kind.name, brewery.name, brewery.originCountry,
 *   name.name, name.phonetic, abv, purchaseVolume, remainingVolume, price
 *
 * 任意フィールド:
 *   brewery.originRegion, memo, objectKey
 */
export const stockFormSchema = yup.object({
  // SakeName.name: string (required, non-empty)
  name: yup
    .string()
    .required("名前は必須です")
    .trim()
    .min(1, "名前は必須です")
    .max(100, "100文字以内で入力してください")
    .test(validInputTest),

  // SakeName.phonetic: string (required, 空値は許容)
  phonetic: yup
    .string()
    .defined()
    .default("")
    .max(100, "100文字以内で入力してください")
    .test(validInputTest),

  // SakeCategory: 初期値 "" を許容し、送信時にバリデーションで弾く
  category: yup
    .string()
    .defined()
    .default("")
    .test(
      "valid-category",
      "大分類は必須です",
      (value) => value !== "" && sakeCategoryValues.some((v) => v === value),
    ),

  // SakeKind.name: string (required, non-empty)
  kindName: yup
    .string()
    .required("小分類は必須です")
    .trim()
    .min(1, "小分類は必須です")
    .max(100, "100文字以内で入力してください"),

  // Brewery.name: string (required, non-empty)
  breweryName: yup
    .string()
    .required("酒造名は必須です")
    .trim()
    .min(1, "酒造名は必須です")
    .max(100, "100文字以内で入力してください"),

  // Brewery.originCountry: string (required, non-empty)
  originCountry: yup
    .string()
    .required("所在国は必須です")
    .trim()
    .min(1, "所在国は必須です"),

  // Brewery.originRegion?: string | null (optional)
  originRegion: yup.string().defined().default(""),

  // abv: 初期値 null を許容し、送信時にバリデーションで弾く
  abv: yup
    .number()
    .transform((value: unknown, original: unknown) =>
      original === "" ? null : value,
    )
    .defined()
    .nullable()
    .min(0, "0以上で入力してください")
    .max(100, "100以下で入力してください")
    .test("required-abv", "アルコール度数は必須です", (value) => value != null),

  // purchaseVolume: 初期値 null を許容し、送信時にバリデーションで弾く
  purchaseVolume: yup
    .number()
    .transform((value: unknown, original: unknown) =>
      original === "" ? null : value,
    )
    .defined()
    .nullable()
    .min(0, "0以上で入力してください")
    .max(10000, "10000以下で入力してください")
    .test(
      "required-purchaseVolume",
      "購入時容量は必須です",
      (value) => value != null,
    ),

  // remainingVolume: 25%刻み (UI上はパーセント文字列)
  remainingVolume: yup.string().required().default("100"),

  // price: 初期値 null を許容し、送信時にバリデーションで弾く
  price: yup
    .number()
    .transform((value: unknown, original: unknown) =>
      original === "" ? null : value,
    )
    .defined()
    .nullable()
    .min(0, "0以上で入力してください")
    .max(1000000, "1,000,000以下で入力してください")
    .integer("整数で入力してください")
    .test("required-price", "購入時価格は必須です", (value) => value != null),

  // memo: string | null (optional)
  memo: yup
    .string()
    .defined()
    .default("")
    .max(500, "500文字以内で入力してください"),
});

export type StockFormValues = yup.InferType<typeof stockFormSchema>;
