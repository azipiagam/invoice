import { useEffect } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useAuth } from "./AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading, redirectToLogin } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      redirectToLogin();
    }
  }, [loading, user, redirectToLogin]);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
        }}
      >
        <CircularProgress size={36} sx={{ color: "#4F46E5" }} />
        <Typography
          sx={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.875rem",
            color: "rgba(14,60,110,0.5)",
          }}
        >
          Memverifikasi sesi...
        </Typography>
      </Box>
    );
  }

  if (!user) {
    // Sedang redirect ke pilargroup, tampilkan loading sebentar
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
        }}
      >
        <CircularProgress size={36} sx={{ color: "#4F46E5" }} />
        <Typography
          sx={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.875rem",
            color: "rgba(14,60,110,0.5)",
          }}
        >
          Mengarahkan ke halaman login...
        </Typography>
      </Box>
    );
  }

  return children;
}