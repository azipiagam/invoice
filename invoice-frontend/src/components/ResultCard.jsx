import {
  Box,
  Button,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
} from "@mui/material";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import FolderZipRoundedIcon from "@mui/icons-material/FolderZipRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import PictureAsPdfRoundedIcon from "@mui/icons-material/PictureAsPdfRounded";
import TaskAltRoundedIcon from "@mui/icons-material/TaskAltRounded";
import FolderOpenRoundedIcon from "@mui/icons-material/FolderOpenRounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import InsertDriveFileRoundedIcon from "@mui/icons-material/InsertDriveFileRounded";

// ── Decorative SVG background ──────────────────────────────────────────────
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
        viewBox="0 0 720 260"
        preserveAspectRatio="xMaxYMid slice"
        xmlns="http://www.w3.org/2000/svg"
        style={{ position: "absolute", inset: 0 }}
      >
        <g opacity="0.082" transform="translate(580, -20) rotate(14)">
          <rect x="0" y="0" width="108" height="138" rx="11" fill="#10B981" />
          <polygon points="72,0 108,36 72,36" fill="white" opacity="0.58" />
          <rect x="13" y="48" width="82" height="7" rx="3.5" fill="white" />
          <rect x="13" y="62" width="60" height="5.5" rx="2.5" fill="white" opacity="0.90" />
          <rect x="13" y="74" width="70" height="5.5" rx="2.5" fill="white" opacity="0.84" />
          <rect x="13" y="86" width="50" height="5.5" rx="2.5" fill="white" opacity="0.78" />
          <rect x="13" y="104" width="82" height="1.2" rx="1" fill="white" opacity="0.54" />
          <rect x="13" y="114" width="38" height="7" rx="3" fill="white" />
          <rect x="65" y="112" width="30" height="9" rx="4" fill="white" />
        </g>

        <g opacity="0.076" transform="translate(-16, 145)">
          <rect x="0" y="0" width="118" height="96" rx="13" fill="#10B981" />
          <rect x="12" y="58" width="13" height="24" rx="4" fill="white" opacity="0.86" />
          <rect x="31" y="40" width="13" height="42" rx="4" fill="white" opacity="0.86" />
          <rect x="50" y="26" width="13" height="56" rx="4" fill="white" opacity="0.86" />
          <rect x="69" y="44" width="13" height="38" rx="4" fill="white" opacity="0.86" />
          <rect x="88" y="32" width="13" height="50" rx="4" fill="white" opacity="0.86" />
        </g>

        <g opacity="0.084" transform="translate(648, 95)">
          <circle cx="32" cy="32" r="32" fill="#10B981" />
          <polyline
            points="14,32 25,44 50,18"
            stroke="white"
            strokeWidth="5.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </g>

        <g opacity="0.072" transform="translate(10, 10) rotate(-7)">
          <rect x="0" y="0" width="50" height="62" rx="8" fill="#10B981" />
          <polygon points="32,0 50,18 32,18" fill="white" opacity="0.60" />
          <rect x="7" y="26" width="36" height="4.5" rx="2" fill="white" opacity="0.92" />
          <rect x="7" y="35" width="28" height="4.5" rx="2" fill="white" opacity="0.82" />
          <rect x="7" y="44" width="20" height="4.5" rx="2" fill="white" opacity="0.72" />
        </g>

        <g opacity="0.074" transform="translate(490, 185) rotate(8)">
          <rect x="6" y="6" width="72" height="58" rx="9" fill="#0EA5E9" />
          <rect x="0" y="0" width="72" height="58" rx="9" fill="#10B981" />
          <rect x="10" y="14" width="52" height="5" rx="2.5" fill="white" opacity="0.92" />
          <rect x="10" y="25" width="38" height="5" rx="2.5" fill="white" opacity="0.82" />
          <rect x="10" y="36" width="44" height="5" rx="2.5" fill="white" opacity="0.72" />
        </g>

        <circle
          cx="360"
          cy="-10"
          r="56"
          fill="none"
          stroke="#10B981"
          strokeWidth="1.2"
          strokeDasharray="4 7"
          opacity="0.14"
        />

        <circle
          cx="80"
          cy="130"
          r="38"
          fill="none"
          stroke="#10B981"
          strokeWidth="0.9"
          strokeDasharray="3 6"
          opacity="0.11"
        />

        <line x1="190" y1="228" x2="420" y2="228" stroke="#10B981" strokeWidth="0.8" opacity="0.12" />
        <line x1="200" y1="237" x2="370" y2="237" stroke="#10B981" strokeWidth="0.7" opacity="0.08" />
      </svg>

      <Box
        sx={{
          position: "absolute",
          top: -70,
          right: -70,
          width: 280,
          height: 280,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(16,185,129,0.14) 0%, transparent 70%)",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: -50,
          left: -50,
          width: 220,
          height: 220,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(14,165,233,0.10) 0%, transparent 70%)",
        }}
      />
    </Box>
  );
}

const bgIcons = [
  {
    icon: <PictureAsPdfRoundedIcon sx={{ fontSize: 28, color: "rgba(220,38,38,0.34)" }} />,
    top: 88,
    right: 118,
    size: 52,
    rotate: "-10deg",
    delay: "0s",
    bg: "rgba(255,255,255,0.76)",
    border: "1px solid rgba(248,113,113,0.26)",
  },
  {
    icon: <DownloadRoundedIcon sx={{ fontSize: 26, color: "rgba(16,185,129,0.30)" }} />,
    top: 178,
    right: 36,
    size: 48,
    rotate: "8deg",
    delay: "0.6s",
    bg: "rgba(255,255,255,0.74)",
    border: "1px solid rgba(16,185,129,0.22)",
  },
  {
    icon: <FolderZipRoundedIcon sx={{ fontSize: 26, color: "rgba(14,165,233,0.28)" }} />,
    bottom: 110,
    left: 40,
    size: 50,
    rotate: "-12deg",
    delay: "1.1s",
    bg: "rgba(255,255,255,0.74)",
    border: "1px solid rgba(14,165,233,0.22)",
  },
  {
    icon: <ReceiptLongRoundedIcon sx={{ fontSize: 28, color: "rgba(139,92,246,0.26)" }} />,
    bottom: 44,
    right: 148,
    size: 54,
    rotate: "12deg",
    delay: "0.4s",
    bg: "rgba(255,255,255,0.74)",
    border: "1px solid rgba(139,92,246,0.20)",
  },
  {
    icon: <InsertDriveFileRoundedIcon sx={{ fontSize: 22, color: "rgba(5,150,105,0.24)" }} />,
    top: 50,
    left: 108,
    size: 44,
    rotate: "-8deg",
    delay: "0.9s",
    bg: "rgba(255,255,255,0.74)",
    border: "1px solid rgba(5,150,105,0.18)",
  },
];

const statItems = (result) => [
  {
    icon: <ReceiptLongRoundedIcon sx={{ fontSize: 20, color: "#059669" }} />,
    label: "Total Invoice",
    value: result?.total_invoices ?? 0,
    large: true,
    accent: "rgba(16,185,129,0.10)",
    accentBorder: "rgba(16,185,129,0.18)",
  },
  {
    icon: <FolderOpenRoundedIcon sx={{ fontSize: 20, color: "#0EA5E9" }} />,
    label: "Output File",
    value: result?.output_file || "—",
    large: false,
    accent: "rgba(14,165,233,0.10)",
    accentBorder: "rgba(14,165,233,0.18)",
  },
  {
    icon: <InsertDriveFileRoundedIcon sx={{ fontSize: 20, color: "#8B5CF6" }} />,
    label: "Status",
    value: result?.status || "—",
    large: false,
    accent: "rgba(139,92,246,0.10)",
    accentBorder: "rgba(139,92,246,0.18)",
  },
];

export default function ResultCard({ result }) {
  const safeResult = result || {};
  const previewUrl = safeResult.preview_url || "";
  const downloadUrl = safeResult.download_url || "";
  const outputFile = safeResult.output_file || "";
  const files = outputFile ? [outputFile] : [];
  const totalInvoices = safeResult.total_invoices ?? 0;

  const isCompleted =
    safeResult.status === "completed" || safeResult.success === true;

  const canPreview = isCompleted && !!previewUrl;
  const canDownload = isCompleted && !!downloadUrl;

  const successMessage =
    safeResult.message && safeResult.message.trim()
      ? safeResult.message
      : "Invoice premium berhasil dibuat dan siap diunduh.";

  const handleOpenPdf = () => {
    if (!canPreview) {
      alert("File belum selesai dibuat.");
      return;
    }
    window.open(previewUrl, "_blank", "noopener,noreferrer");
  };

  const handleDownloadPdf = () => {
    if (!canDownload) {
      alert("File belum selesai dibuat.");
      return;
    }

    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = outputFile || "invoice.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!safeResult || Object.keys(safeResult).length === 0) {
    return null;
  }

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: "24px",
        overflow: "hidden",
        position: "relative",
        background: "linear-gradient(150deg, #F0FDF8 0%, #ffffff 50%, #F5FFFE 100%)",
        boxShadow: `
          0 0 0 1px rgba(16,185,129,0.13),
          0 4px 6px -1px rgba(0,0,0,0.03),
          0 20px 48px -8px rgba(16,185,129,0.13)
        `,

        "@keyframes fade-up": {
          from: { opacity: 0, transform: "translateY(12px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
        "@keyframes pop-in": {
          "0%": { transform: "scale(0.82)", opacity: 0 },
          "65%": { transform: "scale(1.07)" },
          "100%": { transform: "scale(1)", opacity: 1 },
        },
        "@keyframes pulse-ring": {
          "0%": { transform: "scale(1)", opacity: 0.55 },
          "70%": { transform: "scale(1.22)", opacity: 0 },
          "100%": { transform: "scale(1.22)", opacity: 0 },
        },
        "@keyframes float-soft": {
          "0%, 100%": { transform: "translateY(0px) rotate(var(--rot))" },
          "50%": { transform: "translateY(-7px) rotate(var(--rot))" },
        },
      }}
    >
      <BgDecor />

      {bgIcons.map((item, i) => (
        <Box
          key={i}
          sx={{
            position: "absolute",
            top: item.top,
            right: item.right,
            bottom: item.bottom,
            left: item.left,
            width: item.size,
            height: item.size,
            borderRadius: "15px",
            background: item.bg,
            border: item.border,
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            "--rot": item.rotate,
            transform: `rotate(${item.rotate})`,
            boxShadow: "0 6px 18px rgba(15,23,42,0.07), 0 1px 4px rgba(15,23,42,0.05)",
            pointerEvents: "none",
            zIndex: 1,
            animation: `float-soft ${4 + i * 0.55}s ease-in-out ${item.delay} infinite`,
          }}
        >
          {item.icon}
        </Box>
      ))}

      <Box
        sx={{
          height: "3px",
          background: "linear-gradient(90deg, #059669, #10B981, #34D399, #6EE7B7)",
          position: "relative",
          zIndex: 2,
        }}
      />

      <Stack
        spacing={3}
        sx={{ p: { xs: "20px 20px", md: "26px 32px" }, position: "relative", zIndex: 2 }}
      >
        <Stack
          direction="row"
          spacing={2}
          alignItems="flex-start"
          sx={{ animation: "fade-up 0.45s ease both" }}
        >
          <Box sx={{ position: "relative", flexShrink: 0, mt: 0.2 }}>
            <Box
              sx={{
                position: "absolute",
                inset: -7,
                borderRadius: "50%",
                border: "2px solid rgba(16,185,129,0.30)",
                animation: "pulse-ring 2.6s ease-out infinite",
              }}
            />
            <Box
              sx={{
                width: 58,
                height: 58,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #059669 0%, #10B981 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 8px 24px rgba(16,185,129,0.32)",
                animation: "pop-in 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.1s both",
              }}
            >
              <CheckCircleRoundedIcon sx={{ color: "#fff", fontSize: 28 }} />
            </Box>
          </Box>

          <Box flex={1} minWidth={0}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1.2}
              alignItems={{ xs: "flex-start", sm: "center" }}
              flexWrap="wrap"
            >
              <Box
                sx={{
                  px: 1.6,
                  py: 0.75,
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, #059669, #10B981)",
                  border: "1px solid rgba(5,150,105,0.40)",
                  boxShadow: "0 4px 14px rgba(16,185,129,0.28)",
                }}
              >
                <Typography
                  sx={{
                    fontFamily: "'Sora', sans-serif",
                    fontWeight: 900,
                    fontSize: "1.08rem",
                    color: "#ffffff",
                    letterSpacing: "-0.02em",
                    lineHeight: 1.2,
                    textShadow: "0 1px 2px rgba(0,0,0,0.18)",
                  }}
                >
                  {isCompleted ? "Generate Berhasil" : "Sedang Diproses"}
                </Typography>
              </Box>

              <Chip
                label={`${totalInvoices} invoice`}
                size="small"
                sx={{
                  background: "rgba(16,185,129,0.12)",
                  border: "1px solid rgba(16,185,129,0.24)",
                  color: "#047857",
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 800,
                  fontSize: "0.71rem",
                  height: 23,
                }}
              />
            </Stack>

            <Typography
              sx={{
                mt: 1,
                color: "#0F172A",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.92rem",
                fontWeight: 700,
                lineHeight: 1.6,
                maxWidth: 760,
              }}
            >
              {successMessage}
            </Typography>
          </Box>
        </Stack>

        <Grid
          container
          spacing={1.5}
          sx={{ animation: "fade-up 0.45s ease 0.08s both" }}
        >
          {statItems(safeResult).map(({ icon, label, value, large, accent, accentBorder }) => (
            <Grid item xs={12} md={4} key={label}>
              <Box
                sx={{
                  borderRadius: "16px",
                  p: "14px 17px",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  gap: 0.8,
                  background: "rgba(255,255,255,0.72)",
                  backdropFilter: "blur(10px)",
                  border: `1px solid ${accentBorder}`,
                  boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                }}
              >
                <Stack direction="row" spacing={1} alignItems="center">
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: "9px",
                      background: accent,
                      border: `1px solid ${accentBorder}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {icon}
                  </Box>
                  <Typography
                    sx={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "0.72rem",
                      fontWeight: 600,
                      color: "#64748B",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {label}
                  </Typography>
                </Stack>

                <Typography
                  sx={{
                    fontFamily: large ? "'Sora', sans-serif" : "'DM Sans', sans-serif",
                    fontWeight: 800,
                    fontSize: large ? "2rem" : "0.93rem",
                    color: "#0F172A",
                    lineHeight: 1.1,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    ...(large && {
                      background: "linear-gradient(135deg, #059669, #10B981)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }),
                  }}
                >
                  {value}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        <Divider
          sx={{
            borderColor: "rgba(16,185,129,0.10)",
            animation: "fade-up 0.45s ease 0.16s both",
          }}
        />

        <Box sx={{ animation: "fade-up 0.45s ease 0.2s both" }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 1.4 }}
          >
            <Typography
              sx={{
                fontFamily: "'Sora', sans-serif",
                fontWeight: 800,
                fontSize: "0.93rem",
                color: "#0F172A",
                letterSpacing: "-0.01em",
              }}
            >
              Preview Hasil File
            </Typography>

            {files.length > 0 && (
              <Chip
                label={`${files.length} PDF`}
                size="small"
                sx={{
                  background: "rgba(239,68,68,0.07)",
                  border: "1px solid rgba(239,68,68,0.16)",
                  color: "#DC2626",
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 700,
                  fontSize: "0.68rem",
                  height: 21,
                }}
              />
            )}
          </Stack>

          <Paper
            elevation={0}
            sx={{
              borderRadius: "16px",
              overflow: "hidden",
              background: "rgba(255,255,255,0.75)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(226,232,240,0.85)",
              boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
            }}
          >
            <List disablePadding>
              {files.length > 0 ? (
                files.map((file, index) => (
                  <ListItem
                    key={`${file}-${index}`}
                    divider={index !== files.length - 1}
                    onClick={canPreview ? handleOpenPdf : undefined}
                    sx={{
                      py: 1.3,
                      px: 2,
                      cursor: canPreview ? "pointer" : "default",
                      transition: "background 0.15s ease",
                      "&:hover": canPreview ? { background: "rgba(16,185,129,0.04)" } : {},
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 38 }}>
                      <Box
                        sx={{
                          width: 30,
                          height: 30,
                          borderRadius: "8px",
                          background: "rgba(220,38,38,0.07)",
                          border: "1px solid rgba(220,38,38,0.14)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <PictureAsPdfRoundedIcon sx={{ color: "#DC2626", fontSize: 16 }} />
                      </Box>
                    </ListItemIcon>

                    <ListItemText
                      primary={
                        <Typography
                          sx={{
                            fontFamily: "'DM Sans', sans-serif",
                            fontWeight: 700,
                            fontSize: "0.85rem",
                            color: "#0F172A",
                          }}
                        >
                          {file}
                        </Typography>
                      }
                      secondary={
                        <Typography
                          sx={{
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize: "0.73rem",
                            color: "#94A3B8",
                          }}
                        >
                          {canPreview ? "Klik untuk membuka file PDF" : "File belum siap dibuka"}
                        </Typography>
                      }
                    />

                    <Box
                      sx={{
                        width: 26,
                        height: 26,
                        borderRadius: "50%",
                        background: "rgba(16,185,129,0.09)",
                        border: "1px solid rgba(16,185,129,0.18)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <TaskAltRoundedIcon sx={{ color: "#059669", fontSize: 15 }} />
                    </Box>
                  </ListItem>
                ))
              ) : (
                <ListItem sx={{ py: 3, px: 2.5 }}>
                  <ListItemText
                    primary={
                      <Typography
                        sx={{
                          fontFamily: "'DM Sans', sans-serif",
                          fontWeight: 600,
                          fontSize: "0.88rem",
                          color: "#64748B",
                        }}
                      >
                        Tidak ada file yang ditampilkan
                      </Typography>
                    }
                    secondary="Backend tidak mengirim daftar file"
                  />
                </ListItem>
              )}
            </List>
          </Paper>
        </Box>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1.5}
          sx={{ animation: "fade-up 0.45s ease 0.26s both" }}
        >
          <Button
            variant="contained"
            size="large"
            startIcon={<DownloadRoundedIcon />}
            onClick={handleDownloadPdf}
            disabled={!canDownload}
            sx={{
              borderRadius: "14px",
              textTransform: "none",
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 700,
              fontSize: "0.91rem",
              px: 3,
              py: 1.25,
              background: "linear-gradient(135deg, #059669 0%, #10B981 100%)",
              boxShadow: "0 6px 20px rgba(16,185,129,0.32)",
              "&:hover": {
                boxShadow: "0 8px 28px rgba(16,185,129,0.42)",
                background: "linear-gradient(135deg, #047857 0%, #059669 100%)",
              },
              "&.Mui-disabled": {
                background: "rgba(14,60,110,0.08)",
                boxShadow: "none",
                color: "#94A3B8",
              },
            }}
          >
            Download PDF
          </Button>

          <Button
            variant="outlined"
            size="large"
            startIcon={<FolderZipRoundedIcon />}
            onClick={handleOpenPdf}
            disabled={!canPreview}
            sx={{
              borderRadius: "14px",
              textTransform: "none",
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 700,
              fontSize: "0.91rem",
              px: 3,
              py: 1.25,
              borderColor: "rgba(16,185,129,0.28)",
              color: "#059669",
              background: "rgba(255,255,255,0.7)",
              backdropFilter: "blur(8px)",
              "&:hover": {
                borderColor: "#10B981",
                background: "rgba(16,185,129,0.05)",
                boxShadow: "0 4px 14px rgba(16,185,129,0.14)",
              },
              "&.Mui-disabled": {
                borderColor: "rgba(0,0,0,0.07)",
                color: "#CBD5E1",
              },
            }}
          >
            Lihat Output
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
}