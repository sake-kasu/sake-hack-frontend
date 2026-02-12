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
            種類
          </Typography>
          <Typography variant="body1">{sake.type.name}</Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">
            酒造
          </Typography>
          <Typography variant="body1">
            {sake.brewery.name}
            {sake.brewery.originRegion ? ` (${sake.brewery.originRegion})` : ""}
          </Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">
            アルコール度数
          </Typography>
          <Typography variant="body1">{sake.abv}%</Typography>
        </Box>
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
