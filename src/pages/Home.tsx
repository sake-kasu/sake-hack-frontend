import { Container, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

export const Home = () => {
  const { t } = useTranslation();

  return (
    <Container>
      <Typography variant="h4" component="h1" sx={{ mt: 4 }}>
        {t("welcome")}
      </Typography>
      <Typography variant="body1" sx={{ mt: 2 }}>
        {t("home")}
      </Typography>
    </Container>
  );
};
