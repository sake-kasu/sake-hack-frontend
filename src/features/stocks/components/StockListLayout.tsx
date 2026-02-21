import type { ReactNode } from "react";
import {
  Alert,
  Box,
  CircularProgress,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import { StockCard } from "@/features/stocks/components/StockCard";
import type { Sake } from "@/lib/api/generated/models";
import { useTranslation } from "react-i18next";

type StockListLayoutProps = {
  title: string;
  stocks: Sake[];
  isLoading: boolean;
  error: Error | null;
  onCardClick: (stock: Sake) => void;
  floatingAction?: ReactNode;
};

export const StockListLayout = ({
  title,
  stocks,
  isLoading,
  error,
  onCardClick,
  floatingAction,
}: StockListLayoutProps) => {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "50vh",
          }}
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{t("sake.list.error")}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4, position: "relative" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 0 }}>
          {title}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {stocks.map((stock) => (
          <Grid key={stock.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <StockCard stock={stock} onClick={() => onCardClick(stock)} />
          </Grid>
        ))}
      </Grid>

      {floatingAction && (
        <Box
          sx={{
            position: "fixed",
            bottom: 24,
            right: 24,
          }}
        >
          {floatingAction}
        </Box>
      )}
    </Container>
  );
};
