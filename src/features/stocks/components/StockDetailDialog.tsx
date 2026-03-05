import { yupResolver } from "@hookform/resolvers/yup";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import SaveIcon from "@mui/icons-material/Save";
import {
  Autocomplete,
  Box,
  Button,
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
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import RandomBoozeSpinner from "@/components/ui/RandomBoozeSpinner";
import { getCategoryLabel } from "@/features/stocks/constants";
import { useMasterData } from "@/features/stocks/hooks/useMasterData";
import { useStockDetail } from "@/features/stocks/hooks/useStockDetail";
import { useStockMutation } from "@/features/stocks/hooks/useStockMutation";
import {
  isSakeCategory,
  type StockFormValues,
  stockFormSchema,
} from "@/features/stocks/schemas/stockFormSchema";
import { useNotification } from "@/hooks/useNotification";
import {
  canBrowserDecodeHeic,
  convertHeicToPng,
  isHeicFile,
} from "@/utils/imageConverter";
import type {
  CreateSakeRequest,
  SakeDetail,
  SakeKind,
} from "@/lib/api/generated/models";
import { SakeCategory } from "@/lib/api/generated/models";

// 残容量の選択肢（0から100の間の25の倍数）
const REMAINING_VOLUME_OPTIONS = [0, 25, 50, 75, 100];

const DEFAULT_VALUES: StockFormValues = {
  name: "",
  phonetic: "",
  category: "",
  kindName: "",
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
    originRegion: detail.brewery.originRegion ?? "",
    abv: detail.abv,
    purchaseVolume: detail.purchaseVolume,
    remainingVolume: String(Math.min(100, Math.max(0, pct))),
    memo: detail.memo ?? "",
    price: detail.price,
  };
};

type StockDetailDialogProps = {
  stockId: number | undefined;
  open: boolean;
  mode: "new" | "edit";
  onClose: () => void;
  onSaveSuccess: () => void;
};

export const StockDetailDialog = ({
  stockId,
  open,
  mode,
  onClose,
  onSaveSuccess,
}: StockDetailDialogProps) => {
  const { t } = useTranslation();
  const { notifySuccess, notifyWarning } = useNotification();

  const {
    detail,
    isLoading: isDetailLoading,
    fetchDetail,
    reset: resetDetail,
  } = useStockDetail();

  const { createStock, updateStock, isSaving } =
    useStockMutation(onSaveSuccess);

  const { kinds } = useMasterData();

  const {
    control,
    handleSubmit,
    reset: resetForm,
  } = useForm<StockFormValues>({
    resolver: yupResolver(stockFormSchema),
    defaultValues: DEFAULT_VALUES,
    mode: "onBlur",
  });

  // マスタデータ選択状態（react-hook-form の外で管理）
  const [selectedKind, setSelectedKind] = useState<SakeKind | null>(null);

  // 画像（react-hook-form の外で管理）
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [existingObjectKey, setExistingObjectKey] = useState<
    string | undefined
  >(undefined);
  const [isImageLoading, setIsImageLoading] = useState(false);

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
      setSelectedKind(null);
      setImageFile(null);
      setImagePreviewUrl(null);
      setIsImageLoading(false);
      setExistingObjectKey(undefined);
    } else if (mode === "edit" && stockId !== undefined) {
      fetchDetail(stockId);
    }
  }, [open, mode, stockId, fetchDetail, resetDetail, resetForm]);

  // 編集モード: 詳細データが取得できたらフォームに反映
  useEffect(() => {
    if (detail && mode === "edit") {
      resetForm(detailToFormValues(detail));
      setSelectedKind(detail.kind);
      setImageFile(null);
      setImagePreviewUrl(detail.imageUrl ?? null);
      setIsImageLoading(!!detail.imageUrl);
      setExistingObjectKey(detail.objectKey ?? undefined);
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
    setIsImageLoading(false);
    setExistingObjectKey(undefined);
    handleMenuClose();
  };

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // input の値をリセット（同じファイルを再選択できるようにする）
    event.target.value = "";

    if (!file.type.startsWith("image/") && !isHeicFile(file)) {
      alert(t("stock.image.selectFile"));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert(t("stock.image.fileSizeLimit"));
      return;
    }

    let targetFile = file;

    if (isHeicFile(file)) {
      const supported = await canBrowserDecodeHeic();
      if (!supported) {
        notifyWarning(t("stock.image.heicNotSupported"));
        return;
      }
      try {
        targetFile = await convertHeicToPng(file);
      } catch {
        alert(t("stock.image.heicConversionFailed"));
        return;
      }
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const { result } = e.target ?? {};
      if (typeof result === "string") {
        setImageFile(targetFile);
        setImagePreviewUrl(result);
        setIsImageLoading(true);
      }
    };
    reader.onerror = () => {
      alert(t("stock.image.loadFailed"));
    };
    reader.readAsDataURL(targetFile);
  };

  const buildRequest = (data: StockFormValues): CreateSakeRequest => {
    const { category, abv, purchaseVolume, price } = data;

    if (!isSakeCategory(category)) {
      throw new Error("Validation failed: required fields are missing");
    }

    const request: CreateSakeRequest = {
      category,
      name: {
        name: data.name,
        phonetic: data.phonetic,
      },
      abv: abv ?? 0,
      purchaseVolume: purchaseVolume ?? 0,
      remainingVolume:
        ((purchaseVolume ?? 0) * Number(data.remainingVolume)) / 100,
      memo: data.memo || null,
      price: price ?? 0,
    };

    if (data.kindName) {
      request.kind = {
        id: selectedKind?.id ?? detail?.kind.id ?? 0,
        name: data.kindName,
      };
    }

    return request;
  };

  const onSubmit = async (data: StockFormValues) => {
    const request = buildRequest(data);

    try {
      if (mode === "new") {
        await createStock(request, imageFile);
        notifySuccess(t("stock.message.created"));
      } else if (stockId !== undefined) {
        await updateStock(stockId, request, imageFile, existingObjectKey);
        notifySuccess(t("stock.message.updated"));
      }
    } catch {
      // エラー通知はAxiosインターセプターで自動表示される
    }
  };

  // 編集モードでのローディング
  if (mode === "edit" && isDetailLoading) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogContent>
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <RandomBoozeSpinner />
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
            {mode === "edit"
              ? t("stock.detail.editTitle")
              : t("stock.detail.addTitle")}
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
          <Controller
            name="name"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label={t("stock.detail.name")}
                fullWidth
                required
                error={!!fieldState.error}
                inputProps={{ maxLength: 50 }}
                helperText={
                  fieldState.error?.message ??
                  `${(field.value ?? "").length}/50`
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
                label={t("stock.detail.furigana")}
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
            position: "relative",
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
            <>
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
                src={imagePreviewUrl}
                alt="プレビュー"
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
            </>
          ) : (
            <Box sx={{ textAlign: "center", color: "grey.600" }}>
              <AddPhotoAlternateIcon sx={{ fontSize: 60, mb: 1 }} />
              <Box>{t("stock.image.add")}</Box>
            </Box>
          )}
        </Box>

        {/* 画像選択メニュー */}
        <Menu anchorEl={anchorEl} open={menuOpen} onClose={handleMenuClose}>
          <MenuItem onClick={handleCaptureClick}>
            <CameraAltIcon sx={{ mr: 1 }} />
            {t("stock.image.takePhoto")}
          </MenuItem>
          <MenuItem onClick={handleSelectClick}>
            <PhotoLibraryIcon sx={{ mr: 1 }} />
            {t("stock.image.selectPhoto")}
          </MenuItem>
          {imagePreviewUrl && (
            <MenuItem onClick={handleImageDelete}>
              <DeleteIcon sx={{ mr: 1 }} />
              {t("common.delete")}
            </MenuItem>
          )}
        </Menu>

        {/* 非表示のinput要素（カメラ撮影用） */}
        <input
          ref={captureInputRef}
          type="file"
          accept="image/*,.heic,.heif"
          capture="environment"
          style={{ display: "none" }}
          onChange={handleImageChange}
        />

        {/* 非表示のinput要素（画像選択用） */}
        <input
          ref={selectInputRef}
          type="file"
          accept="image/*,.heic,.heif"
          style={{ display: "none" }}
          onChange={handleImageChange}
        />

        {/* 大分類 */}
        <Box sx={{ mb: 2 }}>
          <Controller
            name="category"
            control={control}
            render={({ field, fieldState }) => (
              <FormControl fullWidth required error={!!fieldState.error} size="small">
                <InputLabel>{t("stock.detail.category")}</InputLabel>
                <Select {...field} label={t("stock.detail.category")}>
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

        {/* 小分類 */}
        <Box sx={{ mb: 2 }}>
          <Controller
            name="kindName"
            control={control}
            render={({ field, fieldState }) => (
              <Autocomplete
                freeSolo
                options={kinds}
                getOptionLabel={(option) =>
                  typeof option === "string" ? option : option.name
                }
                inputValue={field.value ?? ""}
                onInputChange={(_event, newValue) => {
                  field.onChange(newValue);
                }}
                onChange={(_event, newValue) => {
                  if (newValue !== null && typeof newValue !== "string") {
                    setSelectedKind(newValue);
                    field.onChange(newValue.name);
                  } else {
                    setSelectedKind(null);
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={t("stock.detail.subcategory")}
                    error={!!fieldState.error}
                    helperText={
                      fieldState.error?.message ??
                      `${(field.value ?? "").length}/100`
                    }
                  />
                )}
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
              <TextField
                {...field}
                label={t("stock.detail.region")}
                fullWidth
              />
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
                label={t("stock.detail.abv")}
                type="number"
                fullWidth
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
                label={t("stock.detail.volume")}
                type="number"
                fullWidth
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
              <FormControl fullWidth size="small">
                <InputLabel>{t("stock.detail.remainingVolume")}</InputLabel>
                <Select {...field} label={t("stock.detail.remainingVolume")}>
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
                label={t("stock.detail.price")}
                type="number"
                fullWidth
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
                label={t("stock.detail.freeText")}
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
            {t("common.cancel")}
          </Button>

          <Button
            onClick={handleSubmit(onSubmit)}
            startIcon={<SaveIcon />}
            variant="contained"
            color="primary"
            disabled={isSaving}
          >
            {isSaving
              ? t("common.saving")
              : mode === "edit"
                ? t("common.update")
                : t("common.save")}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
