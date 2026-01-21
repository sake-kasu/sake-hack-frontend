import { useState } from "react";
import { useTranslation } from "react-i18next";
import { SakeListLayout } from "@/components/layouts/SakeListLayout";
import { SakeDetailDialog } from "@/features/sake/components/SakeDetailDialog";
import { useSakeList } from "@/features/sake/hooks/useSakeList";
import type { Sake } from "@/types/sake";

export const SakeList = () => {
  const { t } = useTranslation();
  const { sakes, isLoading, error } = useSakeList();
  const [selectedSake, setSelectedSake] = useState<Sake | null>(null);

  const handleDialogClose = () => {
    setSelectedSake(null);
  };

  return (
    <>
      <SakeListLayout
        title={t("sake.list.title")}
        sakes={sakes}
        isLoading={isLoading}
        error={error}
        onCardClick={setSelectedSake}
      />
      <SakeDetailDialog
        sake={selectedSake}
        open={selectedSake !== null}
        onClose={handleDialogClose}
      />
    </>
  );
};
