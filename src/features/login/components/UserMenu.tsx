import { useState } from "react";
import {
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Box,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/features/login/contexts/AuthContext";

export const UserMenu = () => {
  const { t } = useTranslation();
  const { user, signOut } = useAuth();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const isOpen = anchorEl !== null;

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleClose();
    await signOut();
  };

  if (user === null) {
    return null;
  }

  const displayName = user.displayName ?? t("auth.anonymousUser");
  const avatarLetter = displayName.charAt(0).toUpperCase();

  return (
    <>
      <IconButton
        onClick={handleClick}
        aria-label={t("auth.userMenu")}
        aria-controls={isOpen ? "user-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={isOpen ? "true" : undefined}
      >
        <Avatar
          src={user.photoURL ?? undefined}
          alt={displayName}
          sx={{ width: 32, height: 32 }}
        >
          {avatarLetter}
        </Avatar>
      </IconButton>
      <Menu
        id="user-menu"
        anchorEl={anchorEl}
        open={isOpen}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="subtitle2">{displayName}</Typography>
          {user.email !== null && (
            <Typography variant="body2" color="text.secondary">
              {user.email}
            </Typography>
          )}
        </Box>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>{t("auth.logout")}</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};
