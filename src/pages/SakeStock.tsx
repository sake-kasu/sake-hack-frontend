import {
  Alert,
  Box,
  CircularProgress,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import { SakeCard } from "@/features/sake/components/SakeCard";
import { SakeDetailDialog } from "@/features/sake/components/SakeDetailDialog";
import { useSakeList } from "@/features/sake/hooks/useSakeList";
import type { Sake } from "@/types/sake";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export const SakeStock = () => {
  const { t } = useTranslation();
  const { sakes, isLoading, error } = useSakeList();
  const [selectedSake, setSelectedSake] = useState<Sake | null>(null);

  const handleCardClick = (sake: Sake) => {
    setSelectedSake(sake);
  };

  const handleDialogClose = () => {
    setSelectedSake(null);
  };

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
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {t("sake.list.title")}
      </Typography>

      <Grid container spacing={3}>
        {sakes.map((sake) => (
          <Grid item key={sake.id} xs={12} sm={6} md={4} lg={3}>
            <SakeCard sake={sake} onClick={() => handleCardClick(sake)} />
          </Grid>
        ))}
      </Grid>

      <SakeDetailDialog
        sake={selectedSake}
        open={selectedSake !== null}
        onClose={handleDialogClose}
      />
    </Container>
  );
};
