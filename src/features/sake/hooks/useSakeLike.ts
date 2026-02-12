import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "sake-likes";
const DEBOUNCE_DELAY = 1000; // 連打対策: 300ms

/**
 * LocalStorageからいいね状態を取得
 */
const getLikesFromStorage = (): Set<number> => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return new Set();
    return new Set(JSON.parse(stored) as number[]);
  } catch (error) {
    console.error("Failed to load likes from localStorage:", error);
    return new Set();
  }
};

/**
 * LocalStorageにいいね状態を保存
 */
const saveLikesToStorage = (likes: Set<number>): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...likes]));
  } catch (error) {
    console.error("Failed to save likes to localStorage:", error);
  }
};

/**
 * いいね機能のカスタムフック
 * @param sakeId - 酒のID
 * @param initialLikeCount - 初期いいね数（APIから取得した値）
 */
export const useSakeLike = (sakeId: number, initialLikeCount: number) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [isProcessing, setIsProcessing] = useState(false);

  // 初期化: LocalStorageからいいね状態を読み込み
  useEffect(() => {
    const likes = getLikesFromStorage();
    setIsLiked(likes.has(sakeId));
  }, [sakeId]);

  // いいねトグル処理
  const toggleLike = useCallback(() => {
    // 連打対策: 処理中は何もしない
    if (isProcessing) return;

    setIsProcessing(true);

    const likes = getLikesFromStorage();
    const wasLiked = likes.has(sakeId);
    const newIsLiked = !wasLiked;

    // LocalStorageを更新
    if (newIsLiked) {
      likes.add(sakeId);
    } else {
      likes.delete(sakeId);
    }
    saveLikesToStorage(likes);

    // UIを即座に更新
    setIsLiked(newIsLiked);
    setLikeCount((prev) => (newIsLiked ? prev + 1 : prev - 1));

    // TODO: バックエンドAPI実装後、ここでAPI呼び出しを行う
    // 連打対策のためdebounceを使用することを推奨
    // Example:
    // const apiCall = async () => {
    //   try {
    //     if (newIsLiked) {
    //       await addSakeLike(sakeId);
    //     } else {
    //       await removeSakeLike(sakeId);
    //     }
    //   } catch (error) {
    //     console.error("Failed to sync like status with API:", error);
    //     // エラー時はローカル状態をロールバック
    //     setIsLiked(wasLiked);
    //     setLikeCount(initialLikeCount);
    //     const rollbackLikes = getLikesFromStorage();
    //     if (wasLiked) {
    //       rollbackLikes.add(sakeId);
    //     } else {
    //       rollbackLikes.delete(sakeId);
    //     }
    //     saveLikesToStorage(rollbackLikes);
    //   }
    // };

    // 連打対策: debounce
    setTimeout(() => {
      setIsProcessing(false);
      // TODO: API実装後、ここでapiCall()を呼び出す
    }, DEBOUNCE_DELAY);

  }, [sakeId, isProcessing, initialLikeCount]);

  return {
    isLiked,
    likeCount,
    toggleLike,
    isProcessing,
  };
};

// TODO: バックエンドAPI実装後、以下のAPI呼び出し関数を実装
// import { customInstance } from "@/lib/axios/client";
//
// /**
//  * 酒にいいねを追加
//  * POST /api/sakes/{sakeId}/likes
//  */
// export const addSakeLike = async (sakeId: number): Promise<void> => {
//   await customInstance({
//     url: `/api/sakes/${sakeId}/likes`,
//     method: "POST",
//   });
// };
//
// /**
//  * 酒のいいねを削除
//  * DELETE /api/sakes/{sakeId}/likes
//  */
// export const removeSakeLike = async (sakeId: number): Promise<void> => {
//   await customInstance({
//     url: `/api/sakes/${sakeId}/likes`,
//     method: "DELETE",
//   });
// };
