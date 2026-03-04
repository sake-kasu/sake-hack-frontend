import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Typography,
} from "@mui/material";
import type { Sake } from "@/types/sake";
import { CATEGORY_LABEL } from "@/config";

type SakeDetailDialogProps = {
  sake: Sake | null;
  open: boolean;
  onClose: () => void;
};

export const SakeDetailDialog = ({
  sake,
  open,
  onClose,
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
        {/* TODO: API更新後、sake.image.imageKeyからURLを構築して表示する */}

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">
            ふりがな
          </Typography>
          <Typography variant="body1">{sake.phonetic || "-"}</Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">
            大分類
          </Typography>
          <Typography variant="body1">
            {CATEGORY_LABEL[sake.category]}
          </Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">
            小分類
          </Typography>
          <Typography variant="body1">{sake.description ?? "-"}</Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">
            産地
          </Typography>
          <Typography variant="body1">{sake.region ?? "-"}</Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">
            アルコール度数
          </Typography>
          <Typography variant="body1">
            {sake.alcoholPercentage !== null
              ? `${sake.alcoholPercentage}%`
              : "-"}
          </Typography>
        </Box>

        {sake.memo && (
          <>
            <Divider sx={{ my: 2 }} />
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                自由記述
              </Typography>
              <Typography variant="body1">{sake.memo}</Typography>
            </Box>
          </>
        )}

        <Divider sx={{ my: 2 }} />
        <Box>
          <Typography variant="caption" color="text.secondary">
            作成日: {sake.createdAt.toLocaleDateString("ja-JP")}
          </Typography>
          <br />
          <Typography variant="caption" color="text.secondary">
            更新日: {sake.updatedAt.toLocaleDateString("ja-JP")}
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
