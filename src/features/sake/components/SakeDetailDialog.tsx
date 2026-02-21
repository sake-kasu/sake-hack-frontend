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
import type { Sake } from "@/lib/api/generated/models";
import { LikeButton } from "@/features/sake/components/LikeButton";
import {
  getCategoryLabel,
  getCategoryColor,
} from "@/features/stocks/constants";

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
            <img
              src={sake.imagePreview}
              alt={sake.name}
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
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
