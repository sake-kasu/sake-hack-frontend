import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import { Favorite, FavoriteBorder } from "@mui/icons-material";
import type { Sake } from "@/types/sake";
import { useSakeLike } from "@/features/sake/hooks/useSakeLike";

type SakeCardProps = {
  sake: Sake;
  onClick: () => void;
};

export const SakeCard = ({ sake, onClick }: SakeCardProps) => {
  const { isLiked, likeCount, toggleLike, isProcessing } = useSakeLike(
    sake.id,
    sake.likeCount
  );

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // カード全体のクリックイベントを防ぐ
    toggleLike();
  };

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

          {/* いいねボタン */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mt: 1,
            }}
          >
            <IconButton
              size="small"
              onClick={handleLikeClick}
              disabled={isProcessing}
              sx={{
                padding: 0.5,
                "&:hover": {
                  backgroundColor: "transparent",
                },
              }}
            >
              {isLiked ? (
                <Favorite sx={{ color: "error.main", fontSize: 20 }} />
              ) : (
                <FavoriteBorder sx={{ color: "grey.500", fontSize: 20 }} />
              )}
            </IconButton>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ ml: 0.5 }}
            >
              {likeCount}
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};
