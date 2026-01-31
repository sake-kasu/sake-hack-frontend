import CloseIcon from "@mui/icons-material/Close";
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
import type { SakeDetail } from "@/types/sake";

type SakeDetailDialogProps = {
  sake: SakeDetail | null;
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

  // おすすめの飲み方を配列に変換
  const drinkStyleList = sake.drinkStyles && sake.drinkStyles.trim() !== ""
    ? sake.drinkStyles.split(",").map(style => style.trim())
    : [];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {sake.sakeName.name}
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
        {sake.imageUrl && (
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
              src={sake.imageUrl}
              alt={sake.sakeName.name}
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
            種類
          </Typography>
          <Typography variant="body1">{sake.category.name}</Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">
            産地
          </Typography>
          <Typography variant="body1">{sake.originRegion}</Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">
            アルコール度数
          </Typography>
          <Typography variant="body1">{sake.abv}%</Typography>
        </Box>
        {drinkStyleList.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="subtitle2"
              color="text.secondary"
              sx={{ mb: 1 }}
            >
              おすすめの飲み方
            </Typography>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {drinkStyleList.map((style, index) => (
                <Chip key={index} label={style} size="small" />
              ))}
            </Box>
          </Box>
        )}

        {sake.memo && (
          <>
            <Divider sx={{ my: 2 }} />
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                メモ
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
