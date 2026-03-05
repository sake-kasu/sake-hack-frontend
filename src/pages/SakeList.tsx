import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { SakeListLayout } from "@/components/layouts/SakeListLayout";
import { SakeDetailDialog } from "@/features/sake/components/SakeDetailDialog";
import { useSakeLike } from "@/features/sake/hooks/useSakeLike";
import { useSakeList } from "@/features/sake/hooks/useSakeList";
import type { Sake } from "@/lib/api/generated/models";

export const SakeList = () => {
  const { t } = useTranslation();
  const { sakes, isLoading, error, updateSakeLike } = useSakeList();
  const { toggleLike } = useSakeLike();
  const [selectedSake, setSelectedSake] = useState<Sake | null>(null);

  const handleDialogClose = () => {
    setSelectedSake(null);
  };

  const handleLikeToggle = useCallback(
    async (sakeId: number) => {
      const target = sakes.find((s) => s.id === sakeId);
      if (!target) return;

      const prevIsLiked = target.isLiked;
      const prevLikeCount = target.likeCount;

      // 楽観的更新
      const optimisticIsLiked = !prevIsLiked;
      const optimisticLikeCount = prevIsLiked
        ? prevLikeCount - 1
        : prevLikeCount + 1;
      updateSakeLike(sakeId, optimisticIsLiked, optimisticLikeCount);

      // selectedSake も同期
      setSelectedSake((prev) =>
        prev?.id === sakeId
          ? {
              ...prev,
              isLiked: optimisticIsLiked,
              likeCount: optimisticLikeCount,
            }
          : prev,
      );

      try {
        const response = await toggleLike(sakeId, prevIsLiked);
        // サーバーの実際の値で更新
        updateSakeLike(sakeId, response.isLiked, response.likeCount);
        setSelectedSake((prev) =>
          prev?.id === sakeId
            ? {
                ...prev,
                isLiked: response.isLiked,
                likeCount: response.likeCount,
              }
            : prev,
        );
      } catch {
        // ロールバック
        updateSakeLike(sakeId, prevIsLiked, prevLikeCount);
        setSelectedSake((prev) =>
          prev?.id === sakeId
            ? { ...prev, isLiked: prevIsLiked, likeCount: prevLikeCount }
            : prev,
        );
      }
    },
    [sakes, toggleLike, updateSakeLike],
  );

  return (
    <>
      <SakeListLayout
        title={t("sake.list.title")}
        sakes={sakes}
        isLoading={isLoading}
        error={error}
        onCardClick={setSelectedSake}
        onLikeToggle={handleLikeToggle}
      />
      <SakeDetailDialog
        sake={selectedSake}
        open={selectedSake !== null}
        onClose={handleDialogClose}
        onLikeToggle={() => {
          if (selectedSake) {
            handleLikeToggle(selectedSake.id);
          }
        }}
      />
    </>
  );
};
