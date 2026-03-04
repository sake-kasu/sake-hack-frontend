import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  TextField,
  Button,
  Menu,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import DeleteIcon from "@mui/icons-material/Delete";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { useEffect, useState, useRef } from "react";
import { CATEGORY_LABEL } from "@/config";
import type { CategoryEnum } from "@/config";
import { isValidInput } from "@/utils/validation";

// 残容量の選択肢（0から100の間の25の倍数）
const REMAINING_VOLUME_OPTIONS = [0, 25, 50, 75, 100];

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
  sakeId: string | undefined;
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
    remainingVolume: "100",
    price: "",
    imageUrl: null,
    memo: "",
  });

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
  useEffect(() => {
    if (mode === "edit" && sakeId) {
      // APIの戻り値を詰める
    } else if (mode === "new") {
      setIsLoading(false);
    } else {
      return;
    }
  }, [sakeId, mode]);

  const handleSave = () => {
    // FIXME API実装
    if (mode === "new") {
      // 新規保存処理
    } else {
      // 編集保存処理
    }
    onClose();
  };

  // 必須項目のバリデーション
  const isFormValid = () => {
    return (
      forms.name.trim() !== "" &&
      isValidInput(forms.name) &&
      isValidInput(forms.phonetic) &&
      forms.category !== null &&
      Number(forms.abv) >= 0 &&
      Number(forms.abv) <= 100 &&
      Number(forms.purchaseVolume) >= 0 &&
      Number(forms.purchaseVolume) <= 10000 &&
      Number(forms.price) >= 0 &&
      Number(forms.price) <= 1000000
    );
  };

  if (isLoading) {
    return <>読み込み中</>;
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box component="span" sx={{ fontWeight: "bold" }}>
            {mode === "edit" ? "酒の詳細を編集" : "新しい酒を追加"}
          </Box>
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
        {/* 名前 */}
        <Box sx={{ mb: 2 }}>
          <TextField
            label="名前"
            value={forms.name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setForms({ ...forms, name: e.target.value })
            }
            fullWidth
            required
            error={!isValidInput(forms.name)}
            inputProps={{ maxLength: 100 }}
            helperText={
              isValidInput(forms.name)
                ? `${forms.name.length}/100`
                : "不正な文字列の入力です"
            }
          />
        </Box>

        {/* ふりがな */}
        <Box sx={{ mb: 2 }}>
          <TextField
            label="ふりがな"
            value={forms.phonetic}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setForms({ ...forms, phonetic: e.target.value })
            }
            fullWidth
            inputProps={{ maxLength: 100 }}
            helperText={
              isValidInput(forms.phonetic)
                ? `${forms.phonetic.length}/100`
                : "不正な文字列の入力です"
            }
            error={!isValidInput(forms.phonetic)}
          />
        </Box>

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
        <Menu anchorEl={anchorEl} open={menuOpen} onClose={handleMenuClose}>
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

        {/* 大分類 */}
        <Box sx={{ mb: 2 }}>
          <FormControl fullWidth required>
            <InputLabel>大分類</InputLabel>
            <Select
              value={forms.category ?? ""}
              label="大分類"
              onChange={(e) =>
                setForms({ ...forms, category: e.target.value as CategoryEnum })
              }
            >
              {Object.entries(CATEGORY_LABEL).map(([key, label]) => (
                <MenuItem key={key} value={key}>
                  {label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* 小分類 */}
        <Box sx={{ mb: 2 }}>
          <TextField
            label="小分類"
            value={forms.kind}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setForms({ ...forms, kind: e.target.value })
            }
            fullWidth
            inputProps={{ maxLength: 100 }}
            helperText={`${forms.kind.length}/100`}
          />
        </Box>

        {/* 産地 */}
        <Box sx={{ mb: 2 }}>
          <TextField
            label="産地"
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
            inputProps={{ min: 0, max: 100 }}
          />
        </Box>

        {/* 購入時容量 */}
        <Box sx={{ mb: 2 }}>
          <TextField
            label="購入時容量 (mL)"
            type="number"
            value={forms.purchaseVolume}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setForms({ ...forms, purchaseVolume: e.target.value })
            }
            fullWidth
            inputProps={{ min: 0, max: 10000 }}
          />
        </Box>

        {/* 残容量 */}
        <Box sx={{ mb: 2 }}>
          <FormControl fullWidth>
            <InputLabel>残容量 (%)</InputLabel>
            <Select
              value={forms.remainingVolume}
              label="残容量 (%)"
              onChange={(e) =>
                setForms({ ...forms, remainingVolume: e.target.value })
              }
            >
              {REMAINING_VOLUME_OPTIONS.map((volume) => (
                <MenuItem key={volume} value={volume.toString()}>
                  {volume}%
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* 購入時価格 */}
        <Box sx={{ mb: 2 }}>
          <TextField
            label="購入時価格 (円)"
            type="number"
            value={forms.price}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setForms({ ...forms, price: e.target.value })
            }
            fullWidth
            inputProps={{ min: 0, max: 1000000 }}
          />
        </Box>

        {/* 自由記述 */}
        <Box sx={{ mb: 2 }}>
          <TextField
            label="自由記述"
            value={forms.memo ?? ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setForms({ ...forms, memo: e.target.value })
            }
            fullWidth
            multiline
            minRows={3}
            inputProps={{ maxLength: 500 }}
            helperText={`${(forms.memo ?? "").length}/500`}
          />
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* ボタン */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
          <Button onClick={onClose} startIcon={<CloseIcon />} color="inherit">
            キャンセル
          </Button>

          <Button
            onClick={handleSave}
            startIcon={<SaveIcon />}
            variant="contained"
            color="primary"
            disabled={!isFormValid()}
          >
            {mode === "edit" ? "更新" : "保存"}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
