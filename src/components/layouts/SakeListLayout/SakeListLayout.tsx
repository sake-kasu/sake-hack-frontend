import { Box, Container, Grid, Typography } from "@mui/material";
import { type ReactNode, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { SakeCard } from "@/components/layouts/SakeListLayout/SakeCard";
import RandomBoozeSpinner from "@/components/ui/RandomBoozeSpinner";
import { useNotification } from "@/hooks/useNotification";
import type { Sake } from "@/lib/api/generated/models";

type SakeListLayoutProps = {
  title: string;
  sakes: Sake[];
  isLoading: boolean;
  error: Error | null;
  onCardClick: (sake: Sake) => void;
  onLikeToggle: (sakeId: number) => void;
  headerAction?: ReactNode;
  floatingAction?: ReactNode;
};

export const SakeListLayout = ({
  title,
  sakes,
  isLoading,
  error,
  onCardClick,
  onLikeToggle,
  headerAction,
  floatingAction,
}: SakeListLayoutProps) => {
  const { t } = useTranslation();
  const { notifyError } = useNotification();

  useEffect(() => {
    if (error) {
      notifyError(t("sake.list.error"));
    }
  }, [error, notifyError, t]);

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
          <RandomBoozeSpinner />
        </Box>
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
          <Grid key={sake.id} size={{ xs: 6, sm: 6, md: 4, lg: 3 }}>
            <SakeCard
              sake={sake}
              onClick={() => onCardClick(sake)}
              onLikeToggle={() => onLikeToggle(sake.id)}
            />
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
