import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { IconButton, Typography, Box } from "@mui/material";
import type { MouseEvent } from "react";

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
  const handleClick = (event: MouseEvent) => {
    event.stopPropagation();
    onToggle();
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <IconButton onClick={handleClick} size={size} aria-label="いいね">
        {isLiked ? (
          <StarIcon color="warning" fontSize={size} />
        ) : (
          <StarBorderIcon color="action" fontSize={size} />
        )}
      </IconButton>
      <Typography variant="body2" color="text.secondary">
        {likeCount}
      </Typography>
    </Box>
  );
};
