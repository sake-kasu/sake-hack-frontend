import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import type { Sake } from "@/types/sake";

type SakeCardProps = {
  sake: Sake;
  onClick: () => void;
};

export const SakeCard = ({ sake, onClick }: SakeCardProps) => {
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
          {sake.imageUrl ? (
            <img
              src={sake.imageUrl}
              alt={sake.name}
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
            {sake.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            {sake.type.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            {sake.brewery.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            ABV: {sake.abv}%
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};
