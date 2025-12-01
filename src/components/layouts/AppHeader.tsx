import { AppBar, Toolbar, IconButton, Typography, Box } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LanguageIcon from "@mui/icons-material/Language";
import { useTranslation } from "react-i18next";

type AppHeaderProps = {
  onMenuClick: () => void;
  showMenuButton: boolean;
};

export const AppHeader = ({ onMenuClick, showMenuButton }: AppHeaderProps) => {
  const { t, i18n } = useTranslation();

  const handleLanguageToggle = () => {
    const newLang = i18n.language === "ja" ? "en" : "ja";
    i18n.changeLanguage(newLang);
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar>
        {showMenuButton && (
          <IconButton
            color="inherit"
            aria-label={t("layout.openDrawer")}
            edge="start"
            onClick={onMenuClick}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        )}
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          {t("layout.appTitle")}
        </Typography>
        <Box>
          <IconButton
            color="inherit"
            aria-label={t("layout.changeLanguage")}
            onClick={handleLanguageToggle}
          >
            <LanguageIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
