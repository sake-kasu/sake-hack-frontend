import { getLikes } from "@/lib/api/generated/likes/likes";
import type { LikeResponse } from "@/lib/api/generated/models";

type UseSakeLikeReturn = {
  toggleLike: (
    sakeId: number,
    currentIsLiked: boolean,
  ) => Promise<LikeResponse>;
};

export const useSakeLike = (): UseSakeLikeReturn => {
  const toggleLike = async (
    sakeId: number,
    currentIsLiked: boolean,
  ): Promise<LikeResponse> => {
    const api = getLikes();

    if (currentIsLiked) {
      return api.deleteSakeLike(sakeId);
    }

    return api.createSakeLike(sakeId);
  };

  return { toggleLike };
};
