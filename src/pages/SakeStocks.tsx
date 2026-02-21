import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StockListLayout } from "@/features/stocks/components/StockListLayout";
import { SakeDetailDialog } from "@/features/stocks/components/SakeDetailDialog";
import { useStockList } from "@/features/stocks/hooks/useStockList";
import type { Sake } from "@/lib/api/generated";
import { Fab, Typography } from "@mui/material";

export const SakeStocks = () => {
  const { t } = useTranslation();
  const { stocks, isLoading, error, refetch } = useStockList();
  const [selectedStockId, setSelectedStockId] = useState<number | undefined>(
    undefined,
  );
  const [open, setOpen] = useState(false);

  const handleCardClick = (stock: Sake) => {
    setSelectedStockId(stock.id);
    setOpen(true);
  };

  const handleAddClick = () => {
    setSelectedStockId(undefined);
    setOpen(true);
  };

  const handleDialogClose = () => {
    setSelectedStockId(undefined);
    setOpen(false);
  };

  const handleSaveSuccess = () => {
    handleDialogClose();
    refetch();
  };

  return (
    <>
      <StockListLayout
        title={t("sake.list.title")}
        stocks={stocks}
        isLoading={isLoading}
        error={error}
        onCardClick={handleCardClick}
        floatingAction={
          <Fab color="primary" onClick={handleAddClick}>
            <Typography fontSize={50} paddingBottom="10px">
              +
            </Typography>
          </Fab>
        }
      />
      <SakeDetailDialog
        stockId={selectedStockId}
        open={open}
        mode={selectedStockId !== undefined ? "edit" : "new"}
        onClose={handleDialogClose}
        onSaveSuccess={handleSaveSuccess}
      />
    </>
  );
};
