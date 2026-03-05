import i18n from "@/i18n/config";

const HEIC_MIME_TYPES = ["image/heic", "image/heif"];
const HEIC_EXTENSIONS = [".heic", ".heif"];

/**
 * HEIC/HEIF ファイルかどうかを判定する
 */
export function isHeicFile(file: File): boolean {
  if (HEIC_MIME_TYPES.includes(file.type.toLowerCase())) {
    return true;
  }
  const name = file.name.toLowerCase();
  return HEIC_EXTENSIONS.some((ext) => name.endsWith(ext));
}

let heicSupportCache: boolean | null = null;

/**
 * ブラウザが HEIC をデコードできるか判定する（結果はキャッシュ）
 */
export async function canBrowserDecodeHeic(): Promise<boolean> {
  if (heicSupportCache !== null) {
    return heicSupportCache;
  }

  // 最小限の HEIC コンテナ（1x1 ピクセル）でデコード可否を確認
  const testBlob = new Blob(
    [
      new Uint8Array([
        0x00, 0x00, 0x00, 0x1c, 0x66, 0x74, 0x79, 0x70, 0x68, 0x65, 0x69, 0x63,
      ]),
    ],
    { type: "image/heic" },
  );
  const url = URL.createObjectURL(testBlob);

  try {
    const result = await new Promise<boolean>((resolve) => {
      const img = new Image();
      img.onload = () => resolve(img.width > 0);
      img.onerror = () => resolve(false);
      img.src = url;
      // タイムアウト: 3秒以内にロードされなければ非対応と判定
      setTimeout(() => resolve(false), 3000);
    });
    heicSupportCache = result;
    return result;
  } finally {
    URL.revokeObjectURL(url);
  }
}

/**
 * HEIC ファイルを PNG に変換する（Canvas API 使用）
 */
export function convertHeicToPng(file: File): Promise<File> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error(i18n.t("systemError.canvasContextFailed")));
          return;
        }

        ctx.drawImage(img, 0, 0);

        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error(i18n.t("systemError.pngConversionFailed")));
            return;
          }

          const baseName = file.name.replace(/\.[^.]+$/, "");
          const converted = new File([blob], `${baseName}.png`, {
            type: "image/png",
          });
          resolve(converted);
        }, "image/png");
      } finally {
        URL.revokeObjectURL(url);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error(i18n.t("systemError.heicLoadFailed")));
    };

    img.src = url;
  });
}
