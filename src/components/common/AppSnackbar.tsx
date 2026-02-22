import { forwardRef, useCallback } from "react";
import { type CustomContentProps, useSnackbar } from "notistack";
import { alpha, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

type SnackbarVariant = "error" | "success" | "warning";

const variantIcons: Record<SnackbarVariant, React.ReactNode> = {
  error: <ErrorOutlineIcon fontSize="small" />,
  success: <CheckCircleOutlineIcon fontSize="small" />,
  warning: <WarningAmberIcon fontSize="small" />,
};

const isSnackbarVariant = (variant: string): variant is SnackbarVariant => {
  return variant === "error" || variant === "success" || variant === "warning";
};

const AppSnackbar = forwardRef<HTMLDivElement, CustomContentProps>(
  ({ id, message, variant }, ref) => {
    const { closeSnackbar } = useSnackbar();
    const theme = useTheme();

    const handleClose = useCallback(() => {
      closeSnackbar(id);
    }, [id, closeSnackbar]);

    const resolvedVariant = isSnackbarVariant(variant) ? variant : "success";
    const paletteColor = theme.palette[resolvedVariant].main;

    return (
      <Box
        ref={ref}
        role="alert"
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          minWidth: 300,
          maxWidth: 480,
          px: 2,
          py: 1.5,
          borderRadius: 1,
          borderLeft: `4px solid ${paletteColor}`,
          backgroundColor: alpha(paletteColor, 0.08),
          boxShadow: theme.shadows[3],
        }}
      >
        <Box sx={{ color: paletteColor, display: "flex" }}>
          {variantIcons[resolvedVariant]}
        </Box>
        <Typography
          variant="body2"
          sx={{ flex: 1, color: "text.primary", lineHeight: 1.5 }}
        >
          {message}
        </Typography>
        <IconButton
          size="small"
          onClick={handleClose}
          sx={{ color: "text.secondary", ml: 0.5 }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>
    );
  },
);

AppSnackbar.displayName = "AppSnackbar";

export { AppSnackbar };
