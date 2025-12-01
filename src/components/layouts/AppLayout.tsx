import { useState } from "react";
import { Box, Drawer, useTheme, useMediaQuery } from "@mui/material";
import { Outlet } from "react-router-dom";
import { AppHeader } from "@/components/layouts/AppHeader";
import { NavigationMenu } from "@/components/layouts/NavigationMenu";

const DRAWER_WIDTH_DESKTOP = 240;
const DRAWER_WIDTH_MOBILE = 280;

export const AppLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleDrawerClose = () => {
    setMobileOpen(false);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <AppHeader onMenuClick={handleDrawerToggle} showMenuButton={isMobile} />

      {/* モバイル */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerClose}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: DRAWER_WIDTH_MOBILE,
          },
        }}
      >
        <NavigationMenu onItemClick={handleDrawerClose} />
      </Drawer>

      {/* デスクトップ */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: DRAWER_WIDTH_DESKTOP,
          },
        }}
        open
      >
        <NavigationMenu />
      </Drawer>

      {/* メインコンテンツ */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: {
            xs: "100%",
            md: `calc(100% - ${DRAWER_WIDTH_DESKTOP}px)`,
          },
          mt: 8,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};
