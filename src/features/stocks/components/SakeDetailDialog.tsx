import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  Menu,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import DeleteIcon from "@mui/icons-material/Delete";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { getCategoryLabel } from "@/features/stocks/constants";
import { SakeCategory } from "@/lib/api/generated";
import type { CreateSakeRequest, SakeDetail } from "@/lib/api/generated";
import { useStockDetail } from "@/features/stocks/hooks/useStockDetail";
import { useStockMutation } from "@/features/stocks/hooks/useStockMutation";
import {
  isSakeCategory,
  stockFormSchema,
  type StockFormValues,
} from "@/features/stocks/schemas/stockFormSchema";

// 残容量の選択肢（0から100の間の25の倍数）
const REMAINING_VOLUME_OPTIONS = [0, 25, 50, 75, 100];

const DEFAULT_VALUES: StockFormValues = {
  name: "",
  phonetic: "",
  category: "",
  kindName: "",
  breweryName: "",
  originCountry: "",
  originRegion: "",
  abv: null,
  purchaseVolume: null,
  remainingVolume: "100",
  memo: "",
  price: null,
};

const detailToFormValues = (detail: SakeDetail): StockFormValues => {
  const purchaseVol = detail.purchaseVolume;
  const remainingVol = detail.remainingVolume;
  const pct =
    purchaseVol > 0
      ? Math.round(((remainingVol / purchaseVol) * 100) / 25) * 25
      : 0;

  return {
    name: detail.name.name,
    phonetic: detail.name.phonetic,
    category: detail.category,
    kindName: detail.kind.name,
    breweryName: detail.brewery.name,
    originCountry: detail.brewery.originCountry,
    originRegion: detail.brewery.originRegion ?? "",
    abv: detail.abv,
    purchaseVolume: detail.purchaseVolume,
    remainingVolume: String(Math.min(100, Math.max(0, pct))),
    memo: detail.memo ?? "",
    price: detail.price,
  };
};

type SakeDetailDialogProps = {
  stockId: number | undefined;
  open: boolean;
  mode: "new" | "edit";
  onClose: () => void;
  onSaveSuccess: () => void;
};

export const SakeDetailDialog = ({
  stockId,
  open,
  mode,
  onClose,
  onSaveSuccess,
}: SakeDetailDialogProps) => {
  const {
    detail,
    isLoading: isDetailLoading,
    error: detailError,
    fetchDetail,
    reset: resetDetail,
  } = useStockDetail();

  const {
    createStock,
    updateStock,
    isSaving,
    error: saveError,
  } = useStockMutation(onSaveSuccess);

  const {
    control,
    handleSubmit,
    reset: resetForm,
  } = useForm<StockFormValues>({
    resolver: yupResolver(stockFormSchema),
    defaultValues: DEFAULT_VALUES,
    mode: "onBlur",
  });

  // 画像（react-hook-form の外で管理）
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  // 画像選択メニュー用
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const menuOpen = Boolean(anchorEl);
  const captureInputRef = useRef<HTMLInputElement>(null);
  const selectInputRef = useRef<HTMLInputElement>(null);

  // ダイアログが開いた時の初期化
  useEffect(() => {
    if (!open) return;
    if (mode === "new") {
      resetDetail();
      resetForm(DEFAULT_VALUES);
      setImageFile(null);
      setImagePreviewUrl(null);
    } else if (mode === "edit" && stockId !== undefined) {
      fetchDetail(stockId);
    }
  }, [open, mode, stockId, fetchDetail, resetDetail, resetForm]);

  // 編集モード: 詳細データが取得できたらフォームに反映
  useEffect(() => {
    if (detail && mode === "edit") {
      resetForm(detailToFormValues(detail));
      setImageFile(null);
      setImagePreviewUrl(detail.imageUrl ?? null);
    }
  }, [detail, mode, resetForm]);

  // 画像メニュー
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
    setImageFile(null);
    setImagePreviewUrl(null);
    handleMenuClose();
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("画像ファイルを選択してください");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("ファイルサイズは5MB以下にしてください");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const { result } = e.target ?? {};
      if (typeof result === "string") {
        setImageFile(file);
        setImagePreviewUrl(result);
      }
    };
    reader.onerror = () => {
      alert("画像の読み込みに失敗しました");
    };
    reader.readAsDataURL(file);

    event.target.value = "";
  };

  const buildRequest = (data: StockFormValues): CreateSakeRequest => {
    const { category, abv, purchaseVolume, price } = data;

    if (
      !isSakeCategory(category) ||
      abv === null ||
      purchaseVolume === null ||
      price === null
    ) {
      throw new Error("Validation failed: required fields are missing");
    }

    return {
      category,
      kind: {
        id: detail?.kind.id ?? 0,
        name: data.kindName,
      },
      brewery: {
        id: detail?.brewery.id ?? 0,
        name: data.breweryName,
        originCountry: data.originCountry,
        originRegion: data.originRegion || null,
      },
      name: {
        name: data.name,
        phonetic: data.phonetic,
      },
      abv,
      purchaseVolume,
      remainingVolume: (purchaseVolume * Number(data.remainingVolume)) / 100,
      memo: data.memo || null,
      drinkStyles: detail?.drinkStyles ?? [],
      price,
    };
  };

  const onSubmit = async (data: StockFormValues) => {
    const request = buildRequest(data);

    try {
      if (mode === "new") {
        await createStock(request, imageFile);
      } else if (stockId !== undefined) {
        await updateStock(stockId, request, imageFile);
      }
    } catch {
      // エラーはuseStockMutationで管理される
    }
  };

  // 編集モードでのローディング
  if (mode === "edit" && isDetailLoading) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogContent>
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        </DialogContent>
      </Dialog>
    );
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
        {(saveError ?? detailError) && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {saveError?.message ?? detailError?.message}
          </Alert>
        )}

        {/* 名前 */}
        <Box sx={{ mb: 2 }}>
          <Controller
            name="name"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="名前"
                fullWidth
                required
                error={!!fieldState.error}
                inputProps={{ maxLength: 100 }}
                helperText={
                  fieldState.error?.message ??
                  `${(field.value ?? "").length}/100`
                }
              />
            )}
          />
        </Box>

        {/* ふりがな */}
        <Box sx={{ mb: 2 }}>
          <Controller
            name="phonetic"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="ふりがな"
                fullWidth
                error={!!fieldState.error}
                inputProps={{ maxLength: 100 }}
                helperText={
                  fieldState.error?.message ??
                  `${(field.value ?? "").length}/100`
                }
              />
            )}
          />
        </Box>

        {/* 画像表示領域 */}
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
          {imagePreviewUrl ? (
            <img
              src={imagePreviewUrl}
              alt="プレビュー"
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
          {imagePreviewUrl && (
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
          <Controller
            name="category"
            control={control}
            render={({ field, fieldState }) => (
              <FormControl fullWidth required error={!!fieldState.error}>
                <InputLabel>大分類</InputLabel>
                <Select {...field} label="大分類">
                  {Object.values(SakeCategory).map((value) => (
                    <MenuItem key={value} value={value}>
                      {getCategoryLabel(value)}
                    </MenuItem>
                  ))}
                </Select>
                {fieldState.error && (
                  <FormHelperText>{fieldState.error.message}</FormHelperText>
                )}
              </FormControl>
            )}
          />
        </Box>

        {/* 小分類（暫定: テキスト入力。マスタデータAPI実装後にSelect/Autocompleteに変更） */}
        <Box sx={{ mb: 2 }}>
          <Controller
            name="kindName"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="小分類"
                fullWidth
                required
                error={!!fieldState.error}
                inputProps={{ maxLength: 100 }}
                helperText={
                  fieldState.error?.message ??
                  `${(field.value ?? "").length}/100`
                }
              />
            )}
          />
        </Box>

        {/* 酒造名（暫定: テキスト入力。マスタデータAPI実装後にAutocompleteに変更） */}
        <Box sx={{ mb: 2 }}>
          <Controller
            name="breweryName"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="酒造名"
                fullWidth
                required
                error={!!fieldState.error}
                inputProps={{ maxLength: 100 }}
                helperText={fieldState.error?.message}
              />
            )}
          />
        </Box>

        {/* 所在国 */}
        <Box sx={{ mb: 2 }}>
          <Controller
            name="originCountry"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="所在国"
                fullWidth
                required
                error={!!fieldState.error}
                placeholder="日本"
                helperText={fieldState.error?.message}
              />
            )}
          />
        </Box>

        {/* 産地 */}
        <Box sx={{ mb: 2 }}>
          <Controller
            name="originRegion"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="産地" fullWidth />
            )}
          />
        </Box>

        {/* アルコール度数 */}
        <Box sx={{ mb: 2 }}>
          <Controller
            name="abv"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                value={field.value ?? ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  field.onChange(
                    e.target.value === "" ? "" : Number(e.target.value),
                  )
                }
                label="アルコール度数 (%)"
                type="number"
                fullWidth
                required
                error={!!fieldState.error}
                inputProps={{ min: 0, max: 100 }}
                helperText={fieldState.error?.message}
              />
            )}
          />
        </Box>

        {/* 購入時容量 */}
        <Box sx={{ mb: 2 }}>
          <Controller
            name="purchaseVolume"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                value={field.value ?? ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  field.onChange(
                    e.target.value === "" ? "" : Number(e.target.value),
                  )
                }
                label="購入時容量 (mL)"
                type="number"
                fullWidth
                required
                error={!!fieldState.error}
                inputProps={{ min: 0, max: 10000 }}
                helperText={fieldState.error?.message}
              />
            )}
          />
        </Box>

        {/* 残容量 */}
        <Box sx={{ mb: 2 }}>
          <Controller
            name="remainingVolume"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel>残容量 (%)</InputLabel>
                <Select {...field} label="残容量 (%)">
                  {REMAINING_VOLUME_OPTIONS.map((volume) => (
                    <MenuItem key={volume} value={volume.toString()}>
                      {volume}%
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
        </Box>

        {/* 購入時価格 */}
        <Box sx={{ mb: 2 }}>
          <Controller
            name="price"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                value={field.value ?? ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  field.onChange(
                    e.target.value === "" ? "" : Number(e.target.value),
                  )
                }
                label="購入時価格 (円)"
                type="number"
                fullWidth
                required
                error={!!fieldState.error}
                inputProps={{ min: 0, max: 1000000 }}
                helperText={fieldState.error?.message}
              />
            )}
          />
        </Box>

        {/* 自由記述 */}
        <Box sx={{ mb: 2 }}>
          <Controller
            name="memo"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="自由記述"
                fullWidth
                multiline
                minRows={3}
                error={!!fieldState.error}
                inputProps={{ maxLength: 500 }}
                helperText={
                  fieldState.error?.message ??
                  `${(field.value ?? "").length}/500`
                }
              />
            )}
          />
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* ボタン */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
          <Button onClick={onClose} startIcon={<CloseIcon />} color="inherit">
            キャンセル
          </Button>

          <Button
            onClick={handleSubmit(onSubmit)}
            startIcon={<SaveIcon />}
            variant="contained"
            color="primary"
            disabled={isSaving}
          >
            {isSaving ? "保存中..." : mode === "edit" ? "更新" : "保存"}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
