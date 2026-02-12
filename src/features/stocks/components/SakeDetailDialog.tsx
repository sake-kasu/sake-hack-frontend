import { Box, Dialog, DialogContent, DialogTitle, Divider, IconButton, TextField, Button, Menu, MenuItem } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import DeleteIcon from "@mui/icons-material/Delete";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { useEffect, useState, useRef } from "react";
import type { CategoryEnum } from "@/config";

export type SakeDetailForm = {
  id: number | null;
  name: string;
  phonetic: string;
  category: CategoryEnum | null; // ENUM String
  kind: string;
  originRegion: string;
  abv: string;
  purchaseVolume: string;
  remainingVolume: string;
  memo: string;
  price: string;
  imageUrl: string | null;
};

type SakeDetailDialogProps = {
  sakeId: number | undefined;
  open: boolean;
  mode: "new" | "edit" | null;
  onClose: () => void;
};

export const SakeDetailDialog = ({
  sakeId,
  open,
  mode,
  onClose,
}: SakeDetailDialogProps) => {
  const [isLoading, setIsLoading] = useState(true);
  // 編集用
  const [forms, setForms] = useState<SakeDetailForm>({
    id: 0,
    name: "",
    phonetic: "",
    category: null,
    kind: "",
    originRegion: "",
    abv: "",
    purchaseVolume: "",
    remainingVolume: "",
    price: "",
    imageUrl: null,
    memo: "",
  })

  // 画像選択メニュー用
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);
  const captureInputRef = useRef<HTMLInputElement>(null);
  const selectInputRef = useRef<HTMLInputElement>(null);

  const handleImageAreaClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleCaptureClick = () => {
    handleMenuClose();
    captureInputRef.current?.click();
  };

  const handleSelectClick = () => {
    handleMenuClose();
    selectInputRef.current?.click();
  };

  const handleImageDelete = () => {
    setForms({ ...forms, imageUrl: null });
    handleMenuClose();
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // MIMEタイプチェック                                                                                        
    if (!file.type.startsWith("image/")) {                                                                       
      alert("画像ファイルを選択してください");                                                                   
      return;                                                                                                    
    }   

    // ファイルサイズ制限（5MB）
    if (file.size > 5 * 1024 * 1024) {
      alert("ファイルサイズは5MB以下にしてください");
      return;
    }

    // FileReaderでプレビュー表示
    const reader = new FileReader();
    reader.onload = (e) => {
      const { result } = e.target ?? {};
      if (typeof result === "string") {
        setForms({ ...forms, imageUrl: result });
      }
    };
    reader.onerror = () => {
      alert("画像の読み込みに失敗しました");
    };
    reader.readAsDataURL(file);

    // input要素をリセット（同じファイルを再選択可能にする）
    event.target.value = "";
  };
  // sakeIdを使って酒詳細を取得
  useEffect(()=>{
    if(mode === "edit" && sakeId){
      // APIの戻り値を詰める
    } else if(mode === "new") {
      setIsLoading(false)
    } else {
      return;
    }
  }, [sakeId]);

  const handleSave = () => {
    // FIXME API実装
    if (mode === "new") {
      // 新規保存処理
    } else {
      // 編集保存処理
    }
    onClose();
  };

  if (isLoading) {
    return <>読み込み中</>;
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <TextField
            label="酒の名前"
            value={forms.name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setForms({ ...forms, name: e.target.value })
            }
            fullWidth
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
        {/* 画像表示領域（クリックでメニュー表示） */}
        <Box
          onClick={handleImageAreaClick}
          sx={{
            width: "100%",
            height: 300,
            mb: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "grey.100",
            cursor: "pointer",
            border: "2px dashed",
            borderColor: "grey.400",
            borderRadius: 1,
            "&:hover": {
              backgroundColor: "grey.200",
              borderColor: "primary.main",
            },
          }}
        >
          {forms.imageUrl ? (
            <img
              src={forms.imageUrl}
              alt={forms.name}
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
              }}
            />
          ) : (
            <Box sx={{ textAlign: "center", color: "grey.600" }}>
              <AddPhotoAlternateIcon sx={{ fontSize: 60, mb: 1 }} />
              <Box>画像を追加</Box>
            </Box>
          )}
        </Box>

        {/* 画像選択メニュー */}
        <Menu
          anchorEl={anchorEl}
          open={menuOpen}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleCaptureClick}>
            <CameraAltIcon sx={{ mr: 1 }} />
            写真を撮影
          </MenuItem>
          <MenuItem onClick={handleSelectClick}>
            <PhotoLibraryIcon sx={{ mr: 1 }} />
            写真を選択
          </MenuItem>
          {forms.imageUrl && (
            <MenuItem onClick={handleImageDelete}>
              <DeleteIcon sx={{ mr: 1 }} />
              削除
            </MenuItem>
          )}
        </Menu>

        {/* 非表示のinput要素（カメラ撮影用） */}
        <input
          ref={captureInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          style={{ display: "none" }}
          onChange={handleImageChange}
        />

        {/* 非表示のinput要素（画像選択用） */}
        <input
          ref={selectInputRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleImageChange}
        />

        {/* 種類 */}
        <Box sx={{ mb: 2 }}>
          <TextField
            label="種類"
            value={forms.kind}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setForms({ ...forms, kind: e.target.value })
            }
            fullWidth
          />
        </Box>

        {/* 酒造 */}
        <Box sx={{ mb: 2 }}>
          <TextField
            label="酒造名"
            value={forms.originRegion}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setForms({ ...forms, originRegion: e.target.value })
            }
            fullWidth
          />
        </Box>

        {/* アルコール度数 */}
        <Box sx={{ mb: 2 }}>
          <TextField
            label="アルコール度数 (%)"
            type="number"
            value={forms.abv}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setForms({ ...forms, abv: e.target.value })
            }
            fullWidth
          />
        </Box>

        {/* メモ */}
        <Box sx={{ mb: 2 }}>
          <TextField
            label="メモ"
            value={forms.memo ?? ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setForms({ ...forms, memo: e.target.value })
            }
            fullWidth
            multiline
            minRows={3}
          />
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* 日付表示は省略 or 別途管理が必要 */}

        <Button onClick={onClose} startIcon={<CloseIcon />} color="inherit">
          キャンセル
        </Button>

        <Button
          onClick={handleSave}
          startIcon={<SaveIcon />}
          variant="contained"
          color="primary"
        >
          {mode === "edit" ? "更新" : "保存"}
        </Button>
      </DialogContent>
    </Dialog>
  );
};
