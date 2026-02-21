import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import type { Sake } from "@/lib/api/generated/models";
import { getCategoryLabel } from "@/features/stocks/constants";
import { LikeButton } from "@/features/sake/components/LikeButton";

type SakeCardProps = {
  sake: Sake;
  onClick: () => void;
  onLikeToggle: () => void;
};

export const SakeCard = ({ sake, onClick, onLikeToggle }: SakeCardProps) => {
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
          {sake.imagePreview ? (
            <img
              src={sake.imagePreview}
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
          <Typography variant="body2" color="text.secondary">
            {getCategoryLabel(sake.category)}
          </Typography>
        </CardContent>
      </CardActionArea>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          px: 1,
          pb: 1,
        }}
      >
        <LikeButton
          isLiked={sake.isLiked}
          likeCount={sake.likeCount}
          onToggle={onLikeToggle}
          size="small"
        />
      </Box>
    </Card>
  );
};
