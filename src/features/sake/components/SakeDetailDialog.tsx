import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import type { Sake } from "@/lib/api/generated/models";
import { LikeButton } from "@/features/sake/components/LikeButton";
import { getCategoryLabel } from "@/features/stocks/constants";

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

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
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
            color="inherit"
            onClick={onClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        {sake.imagePreview && (
          <Box
            sx={{
              width: "100%",
              height: 300,
              mb: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "grey.100",
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
        )}

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">
            大分類
          </Typography>
          <Typography variant="body1">
            {getCategoryLabel(sake.category)}
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
