import { Box, Dialog, DialogContent, DialogTitle, Divider, IconButton, TextField, Button } from "@mui/material";
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
      // 新規保存処理
    } else {
      // 編集保存処理
    }
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
        {forms.imageUrl && (
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
              src={forms.imageUrl}
              alt={forms.name}
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