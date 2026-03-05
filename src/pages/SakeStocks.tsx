import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StockListLayout } from "@/features/stocks/components/StockListLayout";
import { StockDetailDialog } from "@/features/stocks/components/StockDetailDialog";
import { useStockList } from "@/features/stocks/hooks/useStockList";
import type { Sake } from "@/lib/api/generated/models";
import { Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

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
        title={t("stock.list.title")}
        stocks={stocks}
        isLoading={isLoading}
        error={error}
        onCardClick={handleCardClick}
        floatingAction={
          <Fab color="primary" onClick={handleAddClick}>
            <AddIcon />
          </Fab>
        }
      />
      <StockDetailDialog
        stockId={selectedStockId}
        open={open}
        mode={selectedStockId !== undefined ? "edit" : "new"}
        onClose={handleDialogClose}
        onSaveSuccess={handleSaveSuccess}
      />
    </>
  );
};
