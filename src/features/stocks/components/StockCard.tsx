import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import type { Sake } from "@/lib/api/generated";
import { getCategoryLabel } from "@/features/stocks/constants";

type StockCardProps = {
  stock: Sake;
  onClick: () => void;
};

export const StockCard = ({ stock, onClick }: StockCardProps) => {
  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <CardActionArea
        onClick={onClick}
        sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
      >
        <CardMedia
          component="div"
          sx={{
            width: "100%",
            height: 200,
            backgroundColor: "grey.200",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {stock.imagePreview ? (
            <img
              src={stock.imagePreview}
              alt={stock.name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          ) : (
            <Typography variant="body2" color="text.secondary">
              画像未設定
            </Typography>
          )}
        </CardMedia>
        <CardContent sx={{ flexGrow: 1, width: "100%" }}>
          <Typography gutterBottom variant="h6" component="div" noWrap>
            {stock.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {getCategoryLabel(stock.category)}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};
