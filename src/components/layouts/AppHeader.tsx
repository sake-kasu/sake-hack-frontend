import { AppBar, Toolbar, IconButton, Typography, Box } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useTranslation } from "react-i18next";
import { useHeaderActions } from "@/providers/HeaderActionsProvider";

type AppHeaderProps = {
  onMenuClick: () => void;
  showMenuButton: boolean;
};

export const AppHeader = ({ onMenuClick, showMenuButton }: AppHeaderProps) => {
  const { t } = useTranslation();
  const headerActions = useHeaderActions();

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
            aria-label={t("layout.openDrawer")}
            edge="start"
            onClick={onMenuClick}
            sx={{ mr: 2, color: "text.primary" }}
          >
            <MenuIcon />
          </IconButton>
        )}
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{
            flexGrow: 1,
            fontWeight: 700,
            letterSpacing: "0.04em",
            color: "text.primary",
          }}
        >
          {t("layout.appTitle")}
        </Typography>
        {headerActions && <Box>{headerActions}</Box>}
      </Toolbar>
    </AppBar>
  );
};
