import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from "@mui/material";
import ListIcon from "@mui/icons-material/List";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { NavigationMenuItem } from "@/types/common";

const menuItems: NavigationMenuItem[] = [
  {
    label: "酒一覧",
    labelKey: "menu.sakeList",
    icon: <ListIcon />,
    path: "/sakes",
  },
];

type NavigationMenuProps = {
  onItemClick?: () => void;
};

export const NavigationMenu = ({ onItemClick }: NavigationMenuProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const handleNavigate = (path: string) => {
    navigate(path);
    if (onItemClick) {
      onItemClick();
    }
  };

  return (
    <>
      <Toolbar />
      <List>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.path} disablePadding>
              <ListItemButton
                selected={isActive}
                onClick={() => {
                  handleNavigate(item.path);
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={t(item.labelKey)} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </>
  );
};
