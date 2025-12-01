import { Container, Typography, Button, Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export const NotFound = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate("/");
  };

  return (
    <Container>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "50dvh",
        }}
      >
        <Typography variant="h1" component="h1" sx={{ mb: 2 }}>
          404
        </Typography>
        <Typography variant="h5" component="h2" sx={{ mb: 4 }}>
          {t("notFound")}
        </Typography>
        <Button variant="contained" color="primary" onClick={handleBackToHome}>
          {t("backToHome")}
        </Button>
      </Box>
    </Container>
  );
};
