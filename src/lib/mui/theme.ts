import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  spacing: 7,
  palette: {
    mode: "light",
    primary: {
      main: "#2C2C2C",
      light: "#4A4A4A",
      dark: "#1A1A1A",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#B8860B",
      light: "#D4A017",
      dark: "#8B6914",
      contrastText: "#FFFFFF",
    },
    background: {
      default: "#FAFAF8",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#1A1A1A",
      secondary: "#6B6B6B",
    },
    error: {
      main: "#C75C2E",
    },
  },
  typography: {
    fontFamily: [
      '"Noto Sans JP"',
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
    ].join(","),
    h4: {
      fontSize: "1.5rem",
      fontWeight: 700,
    },
    h6: {
      fontSize: "1rem",
      fontWeight: 500,
    },
    body1: {
      fontSize: "0.875rem",
    },
    body2: {
      fontSize: "0.8125rem",
    },
    subtitle2: {
      fontSize: "0.75rem",
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  shadows: [
    "none",
    "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)",
    "0 2px 4px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.06)",
    "0 4px 6px rgba(0,0,0,0.04), 0 2px 4px rgba(0,0,0,0.06)",
    "0 6px 10px rgba(0,0,0,0.04), 0 3px 6px rgba(0,0,0,0.06)",
    "0 8px 14px rgba(0,0,0,0.04), 0 4px 8px rgba(0,0,0,0.06)",
    "0 10px 18px rgba(0,0,0,0.04), 0 5px 10px rgba(0,0,0,0.06)",
    "0 12px 22px rgba(0,0,0,0.04), 0 6px 12px rgba(0,0,0,0.06)",
    "0 14px 26px rgba(0,0,0,0.04), 0 7px 14px rgba(0,0,0,0.06)",
    "0 16px 30px rgba(0,0,0,0.04), 0 8px 16px rgba(0,0,0,0.06)",
    "0 18px 34px rgba(0,0,0,0.04), 0 9px 18px rgba(0,0,0,0.06)",
    "0 20px 38px rgba(0,0,0,0.04), 0 10px 20px rgba(0,0,0,0.06)",
    "0 22px 42px rgba(0,0,0,0.04), 0 11px 22px rgba(0,0,0,0.06)",
    "0 24px 46px rgba(0,0,0,0.04), 0 12px 24px rgba(0,0,0,0.06)",
    "0 26px 50px rgba(0,0,0,0.04), 0 13px 26px rgba(0,0,0,0.06)",
    "0 28px 54px rgba(0,0,0,0.04), 0 14px 28px rgba(0,0,0,0.06)",
    "0 30px 58px rgba(0,0,0,0.04), 0 15px 30px rgba(0,0,0,0.06)",
    "0 32px 62px rgba(0,0,0,0.04), 0 16px 32px rgba(0,0,0,0.06)",
    "0 34px 66px rgba(0,0,0,0.04), 0 17px 34px rgba(0,0,0,0.06)",
    "0 36px 70px rgba(0,0,0,0.04), 0 18px 36px rgba(0,0,0,0.06)",
    "0 38px 74px rgba(0,0,0,0.04), 0 19px 38px rgba(0,0,0,0.06)",
    "0 40px 78px rgba(0,0,0,0.04), 0 20px 40px rgba(0,0,0,0.06)",
    "0 42px 82px rgba(0,0,0,0.04), 0 21px 42px rgba(0,0,0,0.06)",
    "0 44px 86px rgba(0,0,0,0.04), 0 22px 44px rgba(0,0,0,0.06)",
    "0 46px 90px rgba(0,0,0,0.04), 0 23px 46px rgba(0,0,0,0.06)",
  ],
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: "1px solid rgba(0,0,0,0.06)",
          boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)",
        },
      },
    },
    MuiButton: {
      defaultProps: {
        size: "small",
      },
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none" as const,
          fontWeight: 500,
        },
      },
    },
    MuiIconButton: {
      defaultProps: {
        size: "small",
      },
    },
    MuiTextField: {
      defaultProps: {
        size: "small",
      },
    },
    MuiChip: {
      defaultProps: {
        size: "small",
      },
    },
    MuiFab: {
      defaultProps: {
        size: "small",
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#FFFFFF",
          color: "#1A1A1A",
          boxShadow: "none",
          borderBottom: "1px solid rgba(0,0,0,0.08)",
        },
      },
    },
    MuiToolbar: {
      defaultProps: {
        variant: "dense",
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)",
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: 12,
          "&:last-child": {
            paddingBottom: 12,
          },
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          padding: "12px 16px",
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: "12px 16px",
        },
      },
    },
  },
});
