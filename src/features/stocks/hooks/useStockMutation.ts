import { getSakeHackBackendAPI } from "@/lib/api/generated";
import type { CreateSakeRequest, UpdateSakeRequest } from "@/lib/api/generated";
import { useCallback, useState } from "react";

type UseStockMutationReturn = {
  createStock: (
    request: CreateSakeRequest,
    imageFile: File | null,
  ) => Promise<void>;
  updateStock: (
    id: number,
    request: UpdateSakeRequest,
    imageFile: File | null,
  ) => Promise<void>;
  isSaving: boolean;
  error: Error | null;
};

export const useStockMutation = (
  onSuccess: () => void,
): UseStockMutationReturn => {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const uploadImage = useCallback(async (stockId: number, imageFile: File) => {
    const api = getSakeHackBackendAPI();

    // Step 2: 署名付きURL取得
    const presigned = await api.createStockUploadUrl(stockId, {
      contentType: imageFile.type,
      filename: imageFile.name,
    });

    // Step 3: S3に直接アップロード
    const uploadRes = await fetch(presigned.uploadUrl, {
      method: "PUT",
      headers: { "Content-Type": imageFile.type },
      body: imageFile,
    });
    if (!uploadRes.ok) {
      throw new Error("画像アップロードに失敗しました");
    }

    // Step 4: objectKeyをDBに保存
    await api.patchStock(stockId, { objectKey: presigned.objectKey });
  }, []);

  const createStock = useCallback(
    async (request: CreateSakeRequest, imageFile: File | null) => {
      try {
        setIsSaving(true);
        setError(null);
        const api = getSakeHackBackendAPI();

        // Step 1: 在庫登録
        const response = await api.createStock(request);
        const stockId = response.data?.id;

        // Steps 2-4: 画像アップロード
        if (stockId !== undefined && imageFile) {
          await uploadImage(stockId, imageFile);
        }

        onSuccess();
      } catch (err) {
        const errorObj =
          err instanceof Error ? err : new Error("保存に失敗しました");
        setError(errorObj);
        throw errorObj;
      } finally {
        setIsSaving(false);
      }
    },
    [onSuccess, uploadImage],
  );

  const updateStock = useCallback(
    async (id: number, request: UpdateSakeRequest, imageFile: File | null) => {
      try {
        setIsSaving(true);
        setError(null);
        const api = getSakeHackBackendAPI();

        await api.updateStock(id, request);

        if (imageFile) {
          await uploadImage(id, imageFile);
        }

        onSuccess();
      } catch (err) {
        const errorObj =
          err instanceof Error ? err : new Error("更新に失敗しました");
        setError(errorObj);
        throw errorObj;
      } finally {
        setIsSaving(false);
      }
    },
    [onSuccess, uploadImage],
  );

  return { createStock, updateStock, isSaving, error };
};
