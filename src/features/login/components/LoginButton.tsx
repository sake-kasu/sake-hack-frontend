import { useState } from "react";
import { Button, CircularProgress } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/features/login/contexts/AuthContext";

export const LoginButton = () => {
  const { t } = useTranslation();
  const { signInWithGoogle } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleLogin = async () => {
    setIsSigningIn(true);
    try {
      await signInWithGoogle();
    } catch {
      // ログインキャンセルやエラー時は何もしない
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <Button
      variant="contained"
      color="inherit"
      startIcon={
        isSigningIn ? (
          <CircularProgress size={20} color="inherit" />
        ) : (
          <GoogleIcon />
        )
      }
      onClick={handleLogin}
      disabled={isSigningIn}
      sx={{
        backgroundColor: "white",
        color: "text.primary",
        "&:hover": {
          backgroundColor: "grey.100",
        },
      }}
    >
      {t("auth.loginWithGoogle")}
    </Button>
  );
};
