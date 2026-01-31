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
    sakeName: {
      name: "",
      phonetic: ""
    },
    category: {
      id: 0
      name: ""
    }


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
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            { sake.sakeName.name}
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
          <Typography variant="body1">{sake.type.name}</Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">
            酒造
          </Typography>
          <Typography variant="body1">{sake.brewery.name}</Typography>
          <Typography variant="body2" color="text.secondary">
            {sake.brewery.originCountry}
            {sake.brewery.originRegion && ` / ${sake.brewery.originRegion}`}
          </Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">
            アルコール度数
          </Typography>
          <Typography variant="body1">{sake.abv}%</Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">
            味の特徴
          </Typography>
          <Typography variant="body1">{sake.tasteNotes}</Typography>
        </Box>

        {sake.drinkStyles.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="subtitle2"
              color="text.secondary"
              sx={{ mb: 1 }}
            >
              おすすめの飲み方
            </Typography>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {sake.drinkStyles.map((style) => (
                <Chip key={style.id} label={style.name} size="small" />
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
};
