import { useEffect, useState } from "react"
import { Box, CircularProgress, Typography } from "@mui/material"
import { useAuth } from "./AuthContext"
import { autoInjectMockAuth, isMockAuthEnabled } from "../utils/mockAuth"
import { BackgroundMain } from "../templateComponents"

const PILARGROUP_URL = import.meta.env.VITE_PILARGROUP_URL || "https://pilargroup.id"
const APP_KEY = "billforge"

const SKIP_AUTH = import.meta.env.DEV && import.meta.env.VITE_SKIP_AUTH === "true"

export default function ProtectedRoute({ children }) {
  const { user, loading, redirectToLogin } = useAuth()
  const [mockLoading, setMockLoading] = useState(false)

  useEffect(() => {
    if (SKIP_AUTH) return
    if (loading) return

    if (!user) {
      if (isMockAuthEnabled()) {
        setMockLoading(true)
        autoInjectMockAuth().then((success) => {
          if (success) {
            window.location.reload()
          } else {
            console.error('[ProtectedRoute BF] Mock auth gagal')
            setMockLoading(false)
          }
        })
        return
      }

      redirectToLogin()
      return
    }

    if (!user.apps?.includes(APP_KEY)) {
      window.location.href = `${PILARGROUP_URL}/dashboard`
    }
  }, [loading, user, redirectToLogin])

  if (SKIP_AUTH) return children

  if (loading || mockLoading || !user || !user.apps?.includes(APP_KEY)) {
    return (
      <Box sx={{ position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2 }}>
        <BackgroundMain position="fixed" zIndex={-1} />
        <CircularProgress size={36} sx={{ color: "#1f4e8c" }} />
        <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontSize: "0.875rem", color: "#6b7b93" }}>
          {loading || mockLoading ? "Memverifikasi sesi..." : "Mengarahkan..."}
        </Typography>
      </Box>
    )
  }

  return children
}