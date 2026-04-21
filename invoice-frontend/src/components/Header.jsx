import { Box, Chip, Paper, Stack, Typography } from "@mui/material";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import CloudUploadRoundedIcon from "@mui/icons-material/CloudUploadRounded";
import PictureAsPdfRoundedIcon from "@mui/icons-material/PictureAsPdfRounded";
import BarChartRoundedIcon from "@mui/icons-material/BarChartRounded";

const featureItems = [
  { icon: <CloudUploadRoundedIcon sx={{ fontSize: 17 }} />, label: "Upload Excel" },
  { icon: <PictureAsPdfRoundedIcon sx={{ fontSize: 17 }} />, label: "Generate PDF" },
  { icon: <BarChartRoundedIcon sx={{ fontSize: 17 }} />, label: "Pantau Proses" },
];

function BgDecor() {
  return (
    <Box
      sx={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        overflow: "hidden",
        borderRadius: "24px",
        zIndex: 0,
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 900 220"
        preserveAspectRatio="xMaxYMid slice"
        xmlns="http://www.w3.org/2000/svg"
        style={{ position: "absolute", inset: 0 }}
      >
        <g opacity="0.11" transform="translate(720, -24) rotate(14)">
          <rect x="0" y="0" width="110" height="140" rx="12" fill="#2E4A87" />
          <rect x="14" y="22" width="82" height="8" rx="4" fill="white" />
          <rect x="14" y="38" width="60" height="6" rx="3" fill="white" opacity="0.88" />
          <rect x="14" y="52" width="70" height="6" rx="3" fill="white" opacity="0.82" />
          <rect x="14" y="66" width="50" height="6" rx="3" fill="white" opacity="0.76" />
          <rect x="14" y="86" width="82" height="1.5" rx="1" fill="white" opacity="0.56" />
          <rect x="14" y="98" width="40" height="7" rx="3" fill="white" />
          <rect x="68" y="96" width="28" height="9" rx="4" fill="white" />
        </g>
        <g opacity="0.10" transform="translate(820, 100)">
          <rect x="0" y="0" width="80" height="96" rx="12" fill="#35559B" />
          <polyline points="40,22 40,62" stroke="white" strokeWidth="6" strokeLinecap="round" fill="none" />
          <polyline points="22,44 40,22 58,44" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <rect x="14" y="72" width="52" height="7" rx="3.5" fill="white" opacity="0.66" />
        </g>
        <g opacity="0.09" transform="translate(-10, 110)">
          <rect x="0" y="0" width="110" height="82" rx="12" fill="#233971" />
          <rect x="10" y="50" width="12" height="22" rx="3" fill="white" opacity="0.84" />
          <rect x="28" y="34" width="12" height="38" rx="3" fill="white" opacity="0.84" />
          <rect x="46" y="22" width="12" height="50" rx="3" fill="white" opacity="0.84" />
          <rect x="64" y="40" width="12" height="32" rx="3" fill="white" opacity="0.84" />
          <rect x="82" y="28" width="12" height="44" rx="3" fill="white" opacity="0.84" />
        </g>
        <g opacity="0.10" transform="translate(10, 6) rotate(-6)">
          <rect x="0" y="0" width="48" height="60" rx="8" fill="#2B4784" />
          <polygon points="32,0 48,16 32,16" fill="white" opacity="0.62" />
          <rect x="8" y="24" width="32" height="5" rx="2.5" fill="white" opacity="0.92" />
          <rect x="8" y="34" width="24" height="5" rx="2.5" fill="white" opacity="0.82" />
          <rect x="8" y="44" width="18" height="5" rx="2.5" fill="white" opacity="0.72" />
        </g>
        <circle cx="680" cy="55" r="50" fill="none" stroke="#4A66A8" strokeWidth="1.2" strokeDasharray="4 7" opacity="0.16" />
        <circle cx="680" cy="55" r="32" fill="none" stroke="#6E88C5" strokeWidth="0.8" strokeDasharray="3 5" opacity="0.11" />
        <circle cx="120" cy="185" r="36" fill="none" stroke="#35559B" strokeWidth="1" strokeDasharray="4 6" opacity="0.13" />
        <line x1="260" y1="200" x2="500" y2="200" stroke="#4A66A8" strokeWidth="0.8" opacity="0.14" />
        <line x1="280" y1="208" x2="440" y2="208" stroke="#6E88C5" strokeWidth="0.8" opacity="0.10" />
      </svg>
      <Box
        sx={{
          position: "absolute",
          right: -80,
          top: -80,
          width: 320,
          height: 320,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(74,102,168,0.18) 0%, transparent 70%)",
          animation: "pulse-glow 10s ease-in-out infinite",
          pointerEvents: "none",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          left: -60,
          bottom: -60,
          width: 240,
          height: 240,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(35,57,113,0.20) 0%, transparent 70%)",
          animation: "pulse-glow 12s ease-in-out infinite 2s",
          pointerEvents: "none",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          right: "35%",
          top: "30%",
          width: 180,
          height: 180,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(110,136,197,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          borderRadius: "inherit",
          pointerEvents: "none",
        }}
      />
    </Box>
  );
}

export default function Header() {
  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: "24px",
        overflow: "hidden",
        position: "relative",
        background: "linear-gradient(145deg, #233971 0%, #233971 55%, #2B4784 100%)",
        boxShadow:
          "0 0 0 1px rgba(74,102,168,0.28), 0 4px 6px -1px rgba(0,0,0,0.2), 0 20px 48px -8px rgba(0,0,0,0.4)",
        "@keyframes pulse-glow": {
          "0%,100%": { opacity: 0.48, transform: "scale(1)" },
          "50%": { opacity: 0.82, transform: "scale(1.03)" },
        },
        "@keyframes float": {
          "0%,100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-4px)" },
        },
        "@keyframes fade-up": {
          from: { opacity: 0, transform: "translateY(14px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
      }}
    >
      <BgDecor />

      <Box
        sx={{
          height: "3px",
          background: "linear-gradient(90deg, #3E5FA8 0%, #5A78BC 35%, #7E97D0 65%, #A6B9E6 100%)",
          position: "relative",
          zIndex: 3,
        }}
      />

      <Box sx={{ p: { xs: "24px 24px", md: "32px 40px" }, position: "relative", zIndex: 2 }}>
        <Stack spacing={2.5}>
          <Box sx={{ animation: "fade-up 0.5s ease both" }}>
            <Chip
              icon={<AutoAwesomeRoundedIcon sx={{ fontSize: "15px !important", color: "#C7D6F7 !important" }} />}
              label="Modern Invoice Generator"
              sx={{
                background: "rgba(255,255,255,0.10)",
                border: "1px solid rgba(255,255,255,0.16)",
                color: "rgba(255,255,255,0.88)",
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 700,
                fontSize: "0.72rem",
                letterSpacing: "0.06em",
                height: 30,
                borderRadius: "9px",
                "& .MuiChip-label": { px: 1.5 },
              }}
            />
          </Box>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={3}
            alignItems={{ xs: "flex-start", sm: "center" }}
            sx={{ animation: "fade-up 0.5s ease 0.08s both" }}
          >
            <Box sx={{ position: "relative", flexShrink: 0, animation: "float 5s ease-in-out infinite" }}>
              <Box
                sx={{
                  position: "absolute",
                  inset: -6,
                  borderRadius: "22px",
                  background: "linear-gradient(135deg, rgba(126,151,208,0.58), rgba(199,214,247,0.34))",
                  filter: "blur(8px)",
                  opacity: 0.95,
                }}
              />
              <Box
                sx={{
                  width: 72,
                  height: 72,
                  borderRadius: "20px",
                  background: "linear-gradient(135deg, #4E6FB8, #2E4A87)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  boxShadow: "0 10px 28px rgba(15,23,42,0.42), 0 0 0 1px rgba(199,214,247,0.18) inset",
                }}
              >
                <ReceiptLongRoundedIcon sx={{ fontSize: 36, color: "#fff" }} />
              </Box>
            </Box>

            <Box>
              <Stack direction="row" alignItems="center" spacing={1.5} mb={0.6}>
                <Typography
                  variant="h4"
                  sx={{
                    fontFamily: "'Sora', sans-serif",
                    fontWeight: 800,
                    fontSize: { xs: "1.7rem", md: "2.3rem" },
                    lineHeight: 1.1,
                    letterSpacing: "-0.025em",
                    background: "linear-gradient(90deg, #fff 30%, rgba(255,255,255,0.72) 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Invoice Generator
                </Typography>
                <Chip
                  icon={<BoltRoundedIcon sx={{ fontSize: "14px !important", color: "#FDE68A !important" }} />}
                  label="Auto"
                  size="small"
                  sx={{
                    background: "rgba(255,255,255,0.10)",
                    border: "1px solid rgba(255,255,255,0.16)",
                    color: "#FFF3C4",
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 700,
                    fontSize: "0.65rem",
                    letterSpacing: "0.05em",
                    height: 24,
                    borderRadius: "7px",
                    mb: "3px",
                  }}
                />
              </Stack>
              <Typography
                sx={{
                  color: "rgba(255,255,255,0.66)",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.93rem",
                  lineHeight: 1.65,
                  maxWidth: 560,
                  textAlign: "left",
                }}
              >
                Upload file Excel, generate invoice PDF otomatis, dan pantau hasil
                proses dengan tampilan yang lebih modern dan mudah digunakan.
              </Typography>
            </Box>
          </Stack>

          {/* Feature items — tanpa "Siap Digunakan" */}
          <Stack
            direction="row"
            flexWrap="wrap"
            sx={{ animation: "fade-up 0.5s ease 0.16s both", gap: "10px" }}
          >
            {featureItems.map(({ icon, label }) => (
              <Box
                key={label}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  px: 1.8,
                  py: 0.9,
                  borderRadius: "10px",
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "rgba(255,255,255,0.74)",
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 600,
                  fontSize: "0.8rem",
                  cursor: "default",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    background: "rgba(255,255,255,0.14)",
                    border: "1px solid rgba(166,185,230,0.35)",
                    color: "#fff",
                    transform: "translateY(-1px)",
                  },
                }}
              >
                <Box sx={{ color: "#D7E3FF", display: "flex" }}>{icon}</Box>
                {label}
              </Box>
            ))}
          </Stack>
        </Stack>
      </Box>
    </Paper>
  );
}