import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Chip,
  Typography,
} from "@mui/material";
import LocalBarIcon from "@mui/icons-material/LocalBar";
import type { Sake } from "@/lib/api/generated/models";
import {
  getCategoryLabel,
  getCategoryColor,
} from "@/features/stocks/constants";
import { LikeButton } from "@/features/sake/components/LikeButton";

type SakeCardProps = {
  sake: Sake;
  onClick: () => void;
  onLikeToggle: () => void;
};

export const SakeCard = ({ sake, onClick, onLikeToggle }: SakeCardProps) => {
  const categoryColor = getCategoryColor(sake.category);

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.06)",
        },
      }}
    >
      <Box
        sx={{
          height: 3,
          backgroundColor: categoryColor,
          borderRadius: "12px 12px 0 0",
        }}
      />
      <CardActionArea
        onClick={onClick}
        sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
      >
        <CardMedia
          component="div"
          sx={{
            width: "100%",
            height: 160,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            ...(sake.imagePreview
              ? {}
              : {
                  background: `linear-gradient(135deg, ${categoryColor}18 0%, ${categoryColor}08 100%)`,
                }),
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
            <LocalBarIcon
              sx={{
                fontSize: 40,
                color: categoryColor,
                opacity: 0.3,
              }}
            />
          )}
        </CardMedia>
        <CardContent sx={{ flexGrow: 1, width: "100%" }}>
          <Typography
            gutterBottom
            variant="h6"
            component="div"
            noWrap
            sx={{ lineHeight: 1.4 }}
          >
            {sake.name}
          </Typography>
          <Chip
            label={getCategoryLabel(sake.category)}
            size="small"
            sx={{
              height: 22,
              fontSize: "0.6875rem",
              backgroundColor: `${categoryColor}12`,
              color: categoryColor,
              border: `1px solid ${categoryColor}30`,
              fontWeight: 500,
            }}
          />
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
