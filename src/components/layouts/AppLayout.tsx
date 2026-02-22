import { useState } from "react";
import { Box, Drawer, Toolbar, useTheme } from "@mui/material";
import { Outlet } from "react-router-dom";
import { AppHeader } from "@/components/layouts/AppHeader";
import { NavigationMenu } from "@/components/layouts/NavigationMenu";
import { HeaderActionsProvider } from "@/providers/HeaderActionsProvider";

const DRAWER_WIDTH_DESKTOP = 240;
const DRAWER_WIDTH_MOBILE = 280;
const DRAWER_WIDTH_MINI = 64;

export const AppLayout = () => {
  const theme = useTheme();
  const [drawerOpen, setDrawerOpen] = useState(true);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  return (
    <HeaderActionsProvider>
      <Box sx={{ display: "flex" }}>
        <AppHeader onMenuClick={handleDrawerToggle} showMenuButton={true} />

        {/* モバイル: temporary drawer */}
        <Drawer
          variant="temporary"
          open={drawerOpen}
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

        {/* デスクトップ: persistent drawer with mini variant */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", md: "block" },
            width: drawerOpen ? DRAWER_WIDTH_DESKTOP : DRAWER_WIDTH_MINI,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerOpen ? DRAWER_WIDTH_DESKTOP : DRAWER_WIDTH_MINI,
              overflowX: "hidden",
              transition: theme.transitions.create("width", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
            },
          }}
        >
          <NavigationMenu mini={!drawerOpen} />
        </Drawer>

        {/* メインコンテンツ */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: {
              xs: "100%",
              md: drawerOpen
                ? `calc(100% - ${DRAWER_WIDTH_DESKTOP}px)`
                : `calc(100% - ${DRAWER_WIDTH_MINI}px)`,
            },
            transition: theme.transitions.create(["width", "margin"], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
          }}
        >
          <Toolbar />
          <Outlet />
        </Box>
      </Box>
    </HeaderActionsProvider>
  );
};
