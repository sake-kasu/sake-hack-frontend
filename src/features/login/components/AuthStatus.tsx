import { Box, CircularProgress } from "@mui/material";
import { useAuth } from "@/features/login/contexts/AuthContext";
import { LoginButton } from "@/features/login/components/LoginButton";
import { UserMenu } from "@/features/login/components/UserMenu";

export const AuthStatus = () => {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <CircularProgress size={24} color="inherit" />
      </Box>
    );
  }

  if (isAuthenticated) {
    return <UserMenu />;
  }

  return <LoginButton />;
};
