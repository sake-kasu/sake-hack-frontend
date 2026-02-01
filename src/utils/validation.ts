/**
 * 許可する文字のUnicode範囲
 *
 * 【文字】
 * - 半角英字: a-zA-Z
 * - 半角数字: 0-9
 * - 全角英字: Ａ-Ｚａ-ｚ (U+FF21-U+FF3A, U+FF41-U+FF5A)
 * - 全角数字: ０-９ (U+FF10-U+FF19)
 * - ひらがな: U+3040-U+309F
 * - カタカナ（全角）: U+30A0-U+30FF
 * - カタカナ（半角）: U+FF65-U+FF9F
 * - CJK漢字: U+4E00-U+9FFF
 * - CJK拡張A: U+3400-U+4DBF
 *
 * 【記号】
 * - 長音記号: ー (U+30FC) ※カタカナ範囲に含まれる
 * - 半角ハイフン: - (U+002D)
 * - 半角カンマ: , (U+002C)
 * - 半角ピリオド: . (U+002E)
 * - 句点: 。 (U+3002)
 * - 読点: 、 (U+3001)
 * - 中黒: ・ (U+30FB) ※カタカナ範囲に含まれる
 * - 全角ハイフン: － (U+FF0D)
 * - 波ダッシュ: ～ (U+301C)
 * - 全角チルダ: ～ (U+FF5E)
 * - 全角括弧: （）(U+FF08-U+FF09)
 * - 鉤括弧: 「」(U+300C-U+300D)
 * - パーセント: % (U+0025)
 * - 全角パーセント: ％ (U+FF05)
 */
const ALLOWED_PATTERN =
  /^[a-zA-Z0-9Ａ-Ｚａ-ｚ０-９\u3040-\u309F\u30A0-\u30FF\uFF65-\uFF9F\u4E00-\u9FFF\u3400-\u4DBF\-,.\u3001\u3002\uFF0D\u301C\uFF5E\uFF08\uFF09\u300C\u300D%\uFF05]*$/;

const DISALLOWED_PATTERN =
  /[^a-zA-Z0-9Ａ-Ｚａ-ｚ０-９\u3040-\u309F\u30A0-\u30FF\uFF65-\uFF9F\u4E00-\u9FFF\u3400-\u4DBF\-,.\u3001\u3002\uFF0D\u301C\uFF5E\uFF08\uFF09\u300C\u300D%\uFF05]/g;

/**
 * 入力値が許可された文字のみで構成されているか検証
 */
export const isValidInput = (value: string): boolean => {
  return ALLOWED_PATTERN.test(value);
};

/**
 * 禁止文字を除去した文字列を返す
 */
export const sanitizeInput = (value: string): string => {
  return value.replace(DISALLOWED_PATTERN, "");
};

/**
 * MUI TextField用のonChangeハンドラー生成
 * 禁止文字の入力を自動的にブロック
 */
export const createRestrictedInputHandler = (
  onChange: (value: string) => void,
) => {
  return (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitized = sanitizeInput(e.target.value);
    onChange(sanitized);
  };
};
