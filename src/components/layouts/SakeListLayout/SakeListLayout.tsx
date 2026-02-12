import type { ReactNode } from "react";
import {
  Alert,
  Box,
  CircularProgress,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import { SakeCard } from "@/components/layouts/SakeListLayout/SakeCard";
import type { Sake } from "@/types/sake";
import { useTranslation } from "react-i18next";

type SakeListLayoutProps = {
  title: string;
  sakes: Sake[];
  isLoading: boolean;
  error: Error | null;
  onCardClick: (sake: Sake) => void;
  headerAction?: ReactNode;
  floatingAction?: ReactNode;
};

export const SakeListLayout = ({
  title,
  sakes,
  isLoading,
  error,
  onCardClick,
  headerAction,
  floatingAction,
}: SakeListLayoutProps) => {
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
        {headerAction && <Box>{headerAction}</Box>}
      </Box>

      <Grid container spacing={3}>
        {sakes.map((sake) => (
          <Grid key={sake.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <SakeCard sake={sake} onClick={() => onCardClick(sake)} />
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
