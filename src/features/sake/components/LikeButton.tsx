import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { IconButton, Typography, Box } from "@mui/material";
import type { MouseEvent } from "react";
import { useTranslation } from "react-i18next";

type LikeButtonProps = {
  isLiked: boolean;
  likeCount: number;
  onToggle: () => void;
  size?: "small" | "medium";
};

export const LikeButton = ({
  isLiked,
  likeCount,
  onToggle,
  size = "medium",
}: LikeButtonProps) => {
  const { t } = useTranslation();

  const handleClick = (event: MouseEvent) => {
    event.stopPropagation();
    onToggle();
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <IconButton
        onClick={handleClick}
        size={size}
        aria-label={t("common.like")}
      >
        {isLiked ? (
          <FavoriteIcon fontSize={size} sx={{ color: "#C75C2E" }} />
        ) : (
          <FavoriteBorderIcon color="action" fontSize={size} />
        )}
      </IconButton>
      <Typography variant="body2" color="text.secondary">
        {likeCount}
      </Typography>
    </Box>
  );
};
