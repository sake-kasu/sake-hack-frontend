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
 * 必須フィールド:
 *   category, name.name, name.phonetic, remainingVolume
 *
 * 任意フィールド:
 *   kindName, originRegion, memo, objectKey, abv, purchaseVolume, price
 */
export const stockFormSchema = yup.object({
  // SakeName.name: string (required, non-empty)
  name: yup
    .string()
    .required(() => i18n.t("validation.required.name"))
    .trim()
    .min(1, () => i18n.t("validation.required.name"))
    .max(50, () => i18n.t("validation.maxLength.chars50"))
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

  // SakeKind.name: string (optional)
  kindName: yup
    .string()
    .defined()
    .default("")
    .trim()
    .max(100, () => i18n.t("validation.maxLength.chars100")),

  // Brewery.originRegion?: string | null (optional)
  originRegion: yup.string().defined().default(""),

  // abv: number | null (optional)
  abv: yup
    .number()
    .transform((value: unknown, original: unknown) =>
      original === "" ? null : value,
    )
    .defined()
    .nullable()
    .min(0, () => i18n.t("validation.range.min0"))
    .max(100, () => i18n.t("validation.range.max100")),

  // purchaseVolume: number | null (optional)
  purchaseVolume: yup
    .number()
    .transform((value: unknown, original: unknown) =>
      original === "" ? null : value,
    )
    .defined()
    .nullable()
    .min(0, () => i18n.t("validation.range.min0"))
    .max(10000, () => i18n.t("validation.range.max10000")),

  // remainingVolume: 25%刻み (UI上はパーセント文字列)
  remainingVolume: yup.string().required().default("100"),

  // price: number | null (optional)
  price: yup
    .number()
    .transform((value: unknown, original: unknown) =>
      original === "" ? null : value,
    )
    .defined()
    .nullable()
    .min(0, () => i18n.t("validation.range.min0"))
    .max(1000000, () => i18n.t("validation.range.max1000000"))
    .integer(() => i18n.t("validation.integer")),

  // memo: string | null (optional)
  memo: yup
    .string()
    .defined()
    .default("")
    .max(500, () => i18n.t("validation.maxLength.chars500")),
});

export type StockFormValues = yup.InferType<typeof stockFormSchema>;
