import CloseIcon from "@mui/icons-material/Close";
import LocalBarIcon from "@mui/icons-material/LocalBar";
import {
  Box,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import RandomBoozeSpinner from "@/components/ui/RandomBoozeSpinner";
import { LikeButton } from "@/features/sake/components/LikeButton";
import {
  getCategoryColor,
  getCategoryLabel,
} from "@/features/stocks/constants";
import type { Sake } from "@/lib/api/generated/models";

type SakeDetailDialogProps = {
  sake: Sake | null;
  open: boolean;
  onClose: () => void;
  onLikeToggle: () => void;
};

export const SakeDetailDialog = ({
  sake,
  open,
  onClose,
  onLikeToggle,
}: SakeDetailDialogProps) => {
  const [isImageLoading, setIsImageLoading] = useState(false);

  useEffect(() => {
    if (sake?.imagePreview) {
      setIsImageLoading(true);
    } else {
      setIsImageLoading(false);
    }
  }, [sake?.imagePreview]);

  if (!sake) {
    return null;
  }

  const categoryColor = getCategoryColor(sake.category);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
            {sake.name}
          </Typography>
          <LikeButton
            isLiked={sake.isLiked}
            likeCount={sake.likeCount}
            onToggle={onLikeToggle}
            size="small"
          />
          <IconButton
            edge="end"
            onClick={onClose}
            aria-label="close"
            sx={{ color: "text.secondary" }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ pt: 0 }}>
        {sake.imagePreview ? (
          <Box
            sx={{
              position: "relative",
              width: "100%",
              height: 260,
              mb: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "grey.50",
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: isImageLoading ? 1 : 0,
                transition: "opacity 0.3s ease",
                pointerEvents: "none",
              }}
            >
              <RandomBoozeSpinner size={32} />
            </Box>
            <img
              src={sake.imagePreview}
              alt={sake.name}
              onLoad={() => setIsImageLoading(false)}
              onError={() => setIsImageLoading(false)}
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
                opacity: isImageLoading ? 0 : 1,
                filter: isImageLoading ? "blur(8px)" : "blur(0)",
                transition: "opacity 0.4s ease, filter 0.4s ease",
              }}
            />
          </Box>
        ) : (
          <Box
            sx={{
              width: "100%",
              height: 160,
              mb: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: `linear-gradient(135deg, ${categoryColor}18 0%, ${categoryColor}08 100%)`,
              borderRadius: 2,
            }}
          >
            <LocalBarIcon
              sx={{
                fontSize: 48,
                color: categoryColor,
                opacity: 0.3,
              }}
            />
          </Box>
        )}

        <Divider sx={{ mb: 2 }} />

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Typography
            variant="subtitle2"
            color="text.secondary"
            sx={{ minWidth: 56 }}
          >
            大分類
          </Typography>
          <Chip
            label={getCategoryLabel(sake.category)}
            size="small"
            sx={{
              height: 22,
              fontSize: "0.6875rem",
              backgroundColor: `${categoryColor}12`,
              color: categoryColor,
              border: `1px solid ${categoryColor}30`,
              fontWeight: 500,
            }}
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
};
