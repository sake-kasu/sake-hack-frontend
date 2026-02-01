import { useState } from "react";
import { useTranslation } from "react-i18next";
import { SakeListLayout } from "@/components/layouts/SakeListLayout";
import { SakeDetailDialog } from "@/features/stocks/components/SakeDetailDialog";
import { useSakeList } from "@/features/stocks/hooks/useSakeList";
import type { Sake } from "@/types/sake";
import { Fab } from "@mui/material";

export const SakeStocks = () => {
  const { t } = useTranslation();
  const { sakes, isLoading, error } = useSakeList();
  const [selectedSake, setSelectedSake] = useState<Sake | null>(null); // ここ別にidとかだけで良くね クリックしたら詳細API叩くし sakeとsakeDetailが欲しい
  // sakeに必要なのはidとsakeNameと大分類とimageurlくらいでは？
  const [open, setOpen] = useState(false);

  const handleCardClick = (sake: Sake) => {
    setSelectedSake(sake);
    setOpen(true);
  };

  const handleAddClick = () => {
    setSelectedSake(null);
    setOpen(true);
  };

  const handleDialogClose = () => {
    setSelectedSake(null);
    setOpen(false);
  };

  return (
    <>
      <SakeListLayout
        title={t("sake.list.title")}
        sakes={sakes}
        isLoading={isLoading}
        error={error}
        onCardClick={handleCardClick}
        floatingAction={
          <Fab color="primary" onClick={handleAddClick}>
            +
          </Fab>
        }
      />
      <SakeDetailDialog
        sakeId={selectedSake?.id}
        open={open}
        mode={selectedSake ? "edit" : "new"}
        onClose={handleDialogClose}
      />
    </>
  );
};
