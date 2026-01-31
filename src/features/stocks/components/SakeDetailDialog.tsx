import React from 'react';
import {
  Box,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Typography,
  TextField,
} from "@mui/material";
import type { Brewery, DrinkStyle, SakeCategory, SakeDetail, SakeKind, SakeName } from "@/types/sake";
import { Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import { useEffect, useState } from "react";
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
  drinkStyle: string;
  memo: string;
  price: string;
  imageUrl: string | null;
};

type SakeDetailDialogProps = {
  sakeId: number | undefined;
  open: boolean;
  mode: 'new' | 'edit' | null;
  onClose: () => void;
};

export const SakeDetailDialog = ({
  sakeId,
  open,
  mode,
  onClose,
}: SakeDetailDialogProps) => {

  const [isLoading,setIsLoading] = useState(true)
  // 戻り値の初期値用
  const [sake,setSake] = useState()
  // 編集用
  const [forms, setForms] = useState<SakeDetailForm>({
    id: 0,
    name: "",
    phonetic: "",
    category: null,
    kind: "",
    originRegion: "",
    adv: "",
    purchaseVolume: "",
    remainingVolume: "",
    drinkStyle: "",
    price: "",
    imageUrl: null,
    memo: "",
  })
  // sakeIdを使って酒詳細を取得
  useEffect(()=>{
    if(mode=="edit" && sakeId){
      // APIの戻り値を詰める
    } else if(mode=="new") {
      setIsLoading(false)
    } else {
      return 
    }
  },[sakeId])

  const handleSave = () =>{
    // FIXME API実装
    if (mode === "new") {

    } else [

    ]
    onClose()
  }

  if (isLoading){
    return (
      <>
        読み込み中
      </>
    )
  }

  return (
  <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
    <DialogTitle>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <TextField
          label="酒の名前"
          value={sake.sakeName.name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSake({
              ...sake,
              sakeName: { ...sake.sakeName, name: e.target.value }
            })
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

      {/* 種類 */}
      <Box sx={{ mb: 2 }}>
        <TextField
          label="種類"
          value={sake.type.name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSake({
              ...sake,
              type: { ...sake.type, name: e.target.value }
            })
          }
          fullWidth
        />
      </Box>

      {/* 酒造 */}
      <Box sx={{ mb: 2 }}>
        <TextField
          label="酒造名"
          value={sake.brewery.name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSake({
              ...sake,
              brewery: { ...sake.brewery, name: e.target.value }
            })
          }
          fullWidth
        />

        <TextField
          label="国"
          value={sake.brewery.originCountry}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSake({
              ...sake,
              brewery: { ...sake.brewery, originCountry: e.target.value }
            })
          }
          fullWidth
          sx={{ mt: 1 }}
        />

        <TextField
          label="地域"
          value={sake.brewery.originRegion ?? ""}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSake({
              ...sake,
              brewery: { ...sake.brewery, originRegion: e.target.value }
            })
          }
          fullWidth
          sx={{ mt: 1 }}
        />
      </Box>

      {/* アルコール度数 */}
      <Box sx={{ mb: 2 }}>
        <TextField
          label="アルコール度数 (%)"
          type="number"
          value={sake.abv}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSake({
              ...sake,
              abv: Number(e.target.value)
            })
          }
          fullWidth
        />
      </Box>

      {/* 味の特徴 */}
      <Box sx={{ mb: 2 }}>
        <TextField
          label="味の特徴"
          value={sake.tasteNotes}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSake({
              ...sake,
              tasteNotes: e.target.value
            })
          }
          fullWidth
          multiline
          minRows={2}
        />
      </Box>

      {/* メモ */}
      <Box sx={{ mb: 2 }}>
        <TextField
          label="メモ"
          value={sake.memo ?? ""}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSake({
              ...sake,
              memo: e.target.value
            })
          }
          fullWidth
          multiline
          minRows={3}
        />
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* 日付表示はそのまま */}
      <Box>
        <Typography variant="caption" color="text.secondary">
          作成日: {sake.createdAt.toLocaleDateString("ja-JP")}
        </Typography>
        <br />
        <Typography variant="caption" color="text.secondary">
          更新日: {sake.updatedAt.toLocaleDateString("ja-JP")}
        </Typography>
      </Box>

      <Button
        onClick={onClose}
        startIcon={<CloseIcon />}
        color="inherit"
      >
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