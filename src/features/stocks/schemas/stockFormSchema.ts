import i18n from "@/i18n/config";
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
  message: () => i18n.t("validation.invalidString"),
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
    .required(() => i18n.t("validation.required.name"))
    .trim()
    .min(1, () => i18n.t("validation.required.name"))
    .max(100, () => i18n.t("validation.maxLength.chars100"))
    .test(validInputTest),

  // SakeName.phonetic: string (required, 空値は許容)
  phonetic: yup
    .string()
    .defined()
    .default("")
    .max(100, () => i18n.t("validation.maxLength.chars100"))
    .test(validInputTest),

  // SakeCategory: 初期値 "" を許容し、送信時にバリデーションで弾く
  category: yup
    .string()
    .defined()
    .default("")
    .test(
      "valid-category",
      () => i18n.t("validation.required.category"),
      (value) => value !== "" && sakeCategoryValues.some((v) => v === value),
    ),

  // SakeKind.name: string (required, non-empty)
  kindName: yup
    .string()
    .required(() => i18n.t("validation.required.subcategory"))
    .trim()
    .min(1, () => i18n.t("validation.required.subcategory"))
    .max(100, () => i18n.t("validation.maxLength.chars100")),

  // Brewery.name: string (required, non-empty)
  breweryName: yup
    .string()
    .required(() => i18n.t("validation.required.breweryName"))
    .trim()
    .min(1, () => i18n.t("validation.required.breweryName"))
    .max(100, () => i18n.t("validation.maxLength.chars100")),

  // Brewery.originCountry: string (required, non-empty)
  originCountry: yup
    .string()
    .required(() => i18n.t("validation.required.country"))
    .trim()
    .min(1, () => i18n.t("validation.required.country")),

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
    .min(0, () => i18n.t("validation.range.min0"))
    .max(100, () => i18n.t("validation.range.max100"))
    .test(
      "required-abv",
      () => i18n.t("validation.required.abv"),
      (value) => value != null,
    ),

  // purchaseVolume: 初期値 null を許容し、送信時にバリデーションで弾く
  purchaseVolume: yup
    .number()
    .transform((value: unknown, original: unknown) =>
      original === "" ? null : value,
    )
    .defined()
    .nullable()
    .min(0, () => i18n.t("validation.range.min0"))
    .max(10000, () => i18n.t("validation.range.max10000"))
    .test(
      "required-purchaseVolume",
      () => i18n.t("validation.required.volume"),
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
    .min(0, () => i18n.t("validation.range.min0"))
    .max(1000000, () => i18n.t("validation.range.max1000000"))
    .integer(() => i18n.t("validation.integer"))
    .test(
      "required-price",
      () => i18n.t("validation.required.price"),
      (value) => value != null,
    ),

  // memo: string | null (optional)
  memo: yup
    .string()
    .defined()
    .default("")
    .max(500, () => i18n.t("validation.maxLength.chars500")),
});

export type StockFormValues = yup.InferType<typeof stockFormSchema>;
