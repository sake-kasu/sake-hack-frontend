import LocalBarIcon from "@mui/icons-material/LocalBar";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Chip,
  Typography,
} from "@mui/material";
import {
  getCategoryColor,
  getCategoryLabel,
} from "@/features/stocks/constants";
import type { Sake } from "@/lib/api/generated/models";

type StockCardProps = {
  stock: Sake;
  onClick: () => void;
};

export const StockCard = ({ stock, onClick }: StockCardProps) => {
  const categoryColor = getCategoryColor(stock.category);

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
            ...(stock.imagePreview
              ? {}
              : {
                  background: `linear-gradient(135deg, ${categoryColor}18 0%, ${categoryColor}08 100%)`,
                }),
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
            {stock.name}
          </Typography>
          <Chip
            label={getCategoryLabel(stock.category)}
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
    </Card>
  );
};
