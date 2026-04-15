import {
  Box,
  Chip,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import HourglassEmptyRoundedIcon from "@mui/icons-material/HourglassEmptyRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";

// ── Decorative SVG background ──────────────────────────────────────────────
function BgDecor({ accentColor }) {
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
        viewBox="0 0 680 220"
        preserveAspectRatio="xMaxYMid slice"
        xmlns="http://www.w3.org/2000/svg"
        style={{ position: "absolute", inset: 0 }}
      >
        {/* Large faint invoice icon — top right */}
        <g opacity="0.055" transform="translate(530, -28) rotate(15)">
          <rect x="0" y="0" width="110" height="140" rx="12" fill={accentColor} />
          <rect x="14" y="30" width="82" height="8" rx="4" fill="white" />
          <rect x="14" y="48" width="60" height="6" rx="3" fill="white" />
          <rect x="14" y="62" width="70" height="6" rx="3" fill="white" />
          <rect x="14" y="76" width="50" height="6" rx="3" fill="white" />
          <rect x="14" y="98" width="82" height="1.5" rx="1" fill="white" opacity="0.5" />
          <rect x="14" y="110" width="40" height="7" rx="3" fill="white" />
          <rect x="68" y="108" width="28" height="9" rx="4" fill="white" />
        </g>

        {/* Medium faint chart icon — bottom left */}
        <g opacity="0.05" transform="translate(-18, 90)">
          <rect x="0" y="0" width="120" height="100" rx="14" fill={accentColor} />
          <rect x="12" y="60" width="14" height="26" rx="4" fill="white" />
          <rect x="32" y="42" width="14" height="44" rx="4" fill="white" />
          <rect x="52" y="28" width="14" height="58" rx="4" fill="white" />
          <rect x="72" y="48" width="14" height="38" rx="4" fill="white" />
          <rect x="92" y="36" width="14" height="50" rx="4" fill="white" />
        </g>

        {/* Small faint checkmark circle — mid right */}
        <g opacity="0.06" transform="translate(610, 110)">
          <circle cx="30" cy="30" r="30" fill={accentColor} />
          <polyline
            points="14,30 24,42 46,18"
            stroke="white"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </g>

        {/* Tiny faint PDF icon — top left corner */}
        <g opacity="0.045" transform="translate(8, 8) rotate(-8)">
          <rect x="0" y="0" width="52" height="64" rx="8" fill={accentColor} />
          <polygon points="34,0 52,18 34,18" fill="white" opacity="0.5" />
          <rect x="8" y="26" width="36" height="5" rx="2.5" fill="white" />
          <rect x="8" y="36" width="28" height="5" rx="2.5" fill="white" />
          <rect x="8" y="46" width="20" height="5" rx="2.5" fill="white" />
        </g>

        {/* Dotted circle decoration — center right */}
        <circle
          cx="580"
          cy="50"
          r="44"
          fill="none"
          stroke={accentColor}
          strokeWidth="1.2"
          strokeDasharray="4 6"
          opacity="0.12"
        />
        <circle
          cx="580"
          cy="50"
          r="28"
          fill="none"
          stroke={accentColor}
          strokeWidth="0.8"
          strokeDasharray="3 5"
          opacity="0.08"
        />

        {/* Subtle horizontal lines decoration */}
        <line x1="160" y1="185" x2="340" y2="185" stroke={accentColor} strokeWidth="0.8" opacity="0.1" />
        <line x1="170" y1="193" x2="300" y2="193" stroke={accentColor} strokeWidth="0.8" opacity="0.07" />
      </svg>

      {/* Soft gradient washes */}
      <Box
        sx={{
          position: "absolute",
          top: -60,
          right: -60,
          width: 260,
          height: 260,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${accentColor}18 0%, transparent 70%)`,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: -40,
          left: -40,
          width: 200,
          height: 200,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(14,165,233,0.08) 0%, transparent 70%)",
        }}
      />
    </Box>
  );
}

// ── Main component ─────────────────────────────────────────────────────────
export default function ProcessStatus({
  isProcessing = false,
  progress = 0,
  statusText = "",
  selectedFile = null,
  jobStatus = "idle",
  currentInvoice = "",
  current = 0,
  total = 0,
  error = "",
}) {
  const normalizedProgress = Math.max(0, Math.min(100, Number(progress) || 0));
  const isQueued = jobStatus === "queued";
  const isFailed = jobStatus === "failed";
  const isCompleted = jobStatus === "completed";
  const isRunning = isProcessing || isQueued || jobStatus === "processing";
  const isDone = isCompleted || (!isRunning && normalizedProgress === 100);

  const chipLabel = isFailed
    ? "Gagal"
    : isDone
    ? "Selesai"
    : isRunning
    ? "Sedang Diproses"
    : "Menunggu Proses";

  const detailText = isFailed
    ? error || statusText || "Terjadi kesalahan saat proses generate invoice"
    : statusText || "Pilih file Excel untuk memulai proses";

  const stepProgressValue = isFailed ? 0 : normalizedProgress;

  // ── color tokens ──
  const accentColor = isFailed ? "#EF4444" : isDone ? "#10B981" : "#6366F1";
  const accentLight = isFailed
    ? "rgba(239,68,68,0.10)"
    : isDone
    ? "rgba(16,185,129,0.10)"
    : "rgba(99,102,241,0.10)";
  const accentBorder = isFailed
    ? "rgba(239,68,68,0.22)"
    : isDone
    ? "rgba(16,185,129,0.22)"
    : "rgba(99,102,241,0.22)";
  const accentGrad = isFailed
    ? "linear-gradient(135deg, #EF4444, #F87171)"
    : isDone
    ? "linear-gradient(135deg, #10B981, #34D399)"
    : "linear-gradient(135deg, #6366F1, #818CF8)";
  const barGrad = isFailed
    ? "linear-gradient(90deg, #EF4444, #F87171)"
    : isDone
    ? "linear-gradient(90deg, #10B981, #34D399)"
    : "linear-gradient(90deg, #6366F1, #818CF8, #38BDF8)";

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: "24px",
        overflow: "hidden",
        position: "relative",
        background: "linear-gradient(145deg, #ffffff 0%, #F8FAFF 55%, #F0F7FF 100%)",
        boxShadow: `
          0 0 0 1px ${accentBorder},
          0 4px 6px -1px rgba(0,0,0,0.04),
          0 20px 48px -8px rgba(99,102,241,0.12)
        `,
        transition: "box-shadow 0.5s ease",

        "@keyframes spin": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        "@keyframes fade-up": {
          from: { opacity: 0, transform: "translateY(10px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
        "@keyframes progress-pulse": {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.45 },
        },
        "@keyframes shimmer": {
          "0%": { left: "-65%" },
          "100%": { left: "130%" },
        },
        "@keyframes orb-drift": {
          "0%, 100%": { transform: "translate(0,0)" },
          "50%": { transform: "translate(-10px, -14px)" },
        },
      }}
    >
      {/* Decorative background */}
      <BgDecor accentColor={accentColor} />

      {/* Top accent stripe */}
      <Box
        sx={{
          height: "3px",
          background: accentGrad,
          position: "relative",
          zIndex: 1,
          transition: "background 0.5s ease",
        }}
      />

      <Stack
        spacing={2.5}
        sx={{
          p: { xs: "20px 20px", md: "26px 32px" },
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* ── Header row ── */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={1.5}
          sx={{ animation: "fade-up 0.45s ease both" }}
        >
          <Box>
            <Typography
              sx={{
                fontFamily: "'Sora', sans-serif",
                fontWeight: 800,
                fontSize: "1.08rem",
                color: "#0F172A",
                letterSpacing: "-0.02em",
              }}
            >
              Status Proses
            </Typography>
            <Typography
              sx={{
                mt: 0.35,
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.81rem",
                color: "#64748B",
              }}
            >
              Pantau status upload dan generate invoice secara realtime.
            </Typography>
          </Box>

          <Chip
            icon={
              isFailed ? (
                <ErrorOutlineRoundedIcon
                  sx={{ fontSize: "15px !important", color: `${accentColor} !important` }}
                />
              ) : isDone ? (
                <CheckCircleRoundedIcon
                  sx={{ fontSize: "15px !important", color: `${accentColor} !important` }}
                />
              ) : isRunning ? (
                <AutorenewRoundedIcon
                  sx={{
                    fontSize: "15px !important",
                    color: `${accentColor} !important`,
                    animation: "spin 1.3s linear infinite",
                  }}
                />
              ) : (
                <HourglassEmptyRoundedIcon
                  sx={{ fontSize: "15px !important", color: "#94A3B8 !important" }}
                />
              )
            }
            label={chipLabel}
            sx={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 700,
              fontSize: "0.72rem",
              letterSpacing: "0.03em",
              height: 30,
              borderRadius: "9px",
              background: accentLight,
              border: `1px solid ${accentBorder}`,
              color: accentColor,
              transition: "all 0.4s ease",
            }}
          />
        </Stack>

        {/* ── File card ── */}
        <Box
          sx={{
            borderRadius: "16px",
            p: "13px 17px",
            animation: "fade-up 0.45s ease 0.07s both",
            background: "rgba(255,255,255,0.72)",
            backdropFilter: "blur(12px)",
            border: isRunning
              ? `1px solid ${accentBorder}`
              : isFailed
              ? "1px solid rgba(239,68,68,0.2)"
              : "1px solid rgba(226,232,240,0.9)",
            boxShadow: isRunning
              ? `0 0 0 3px ${accentLight}`
              : "0 1px 4px rgba(0,0,0,0.05)",
            transition: "border-color 0.3s, box-shadow 0.3s",
          }}
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                background: selectedFile ? accentGrad : "linear-gradient(135deg,#E2E8F0,#CBD5E1)",
                boxShadow: selectedFile ? `0 6px 16px ${accentLight}` : "none",
                transition: "all 0.4s ease",
              }}
            >
              <DescriptionRoundedIcon sx={{ fontSize: 20, color: "#fff" }} />
            </Box>

            <Box flex={1} minWidth={0}>
              <Typography
                sx={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 700,
                  fontSize: "0.87rem",
                  color: "#0F172A",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {selectedFile ? selectedFile.name : "Belum ada file dipilih"}
              </Typography>
              <Typography
                sx={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.76rem",
                  color: isFailed ? "#EF4444" : "#64748B",
                  mt: 0.3,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  transition: "color 0.3s",
                }}
              >
                {detailText}
              </Typography>
            </Box>

            {selectedFile && (
              <Box
                sx={{
                  px: 1.3,
                  py: 0.45,
                  borderRadius: "7px",
                  background: accentLight,
                  border: `1px solid ${accentBorder}`,
                  flexShrink: 0,
                }}
              >
                <Typography
                  sx={{
                    fontSize: "0.6rem",
                    fontWeight: 800,
                    color: accentColor,
                    fontFamily: "'DM Sans', sans-serif",
                    letterSpacing: "0.1em",
                  }}
                >
                  XLSX
                </Typography>
              </Box>
            )}
          </Stack>
        </Box>

        {/* ── Info proses realtime ── */}
        {(isRunning || isDone || isFailed) && (
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={1.25}
            sx={{ animation: "fade-up 0.45s ease 0.12s both" }}
          >
            {/* Invoice saat ini */}
            <Box
              sx={{
                flex: 1,
                borderRadius: "14px",
                p: "13px 15px",
                background: "rgba(255,255,255,0.68)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(226,232,240,0.85)",
                boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                position: "relative",
                overflow: "hidden",
                "&::after": isRunning && !isFailed ? {
                  content: '""',
                  position: "absolute",
                  bottom: 0, left: 0, right: 0,
                  height: "2px",
                  background: barGrad,
                  animation: "shimmer 2.2s ease-in-out infinite",
                } : {},
              }}
            >
              <Typography
                sx={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.67rem",
                  fontWeight: 600,
                  color: "#94A3B8",
                  letterSpacing: "0.09em",
                  textTransform: "uppercase",
                  mb: 0.5,
                }}
              >
                Invoice Saat Ini
              </Typography>
              <Typography
                sx={{
                  fontFamily: "'Sora', sans-serif",
                  fontWeight: 700,
                  fontSize: "0.88rem",
                  color: accentColor,
                  wordBreak: "break-word",
                  transition: "color 0.3s",
                }}
              >
                {currentInvoice || (isDone ? "Semua invoice selesai ✓" : "—")}
              </Typography>
            </Box>

            {/* Counter */}
            <Box
              sx={{
                minWidth: { xs: "100%", md: 165 },
                borderRadius: "14px",
                p: "13px 15px",
                background: "rgba(255,255,255,0.68)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(226,232,240,0.85)",
                boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
              }}
            >
              <Typography
                sx={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.67rem",
                  fontWeight: 600,
                  color: "#94A3B8",
                  letterSpacing: "0.09em",
                  textTransform: "uppercase",
                  mb: 0.5,
                }}
              >
                Jumlah Diproses
              </Typography>
              <Stack direction="row" alignItems="baseline" spacing={0.4}>
                <Typography
                  sx={{
                    fontFamily: "'Sora', sans-serif",
                    fontWeight: 800,
                    fontSize: "1.5rem",
                    lineHeight: 1,
                    color: accentColor,
                    transition: "color 0.3s",
                  }}
                >
                  {total > 0 ? current : "—"}
                </Typography>
                {total > 0 && (
                  <Typography
                    sx={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "0.82rem",
                      color: "#94A3B8",
                      fontWeight: 500,
                    }}
                  >
                    / {total}
                  </Typography>
                )}
              </Stack>
            </Box>
          </Stack>
        )}

        {/* ── Progress section ── */}
        <Box sx={{ animation: "fade-up 0.45s ease 0.17s both" }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 1.2 }}
          >
            <Stack direction="row" spacing={0.75} alignItems="center">
              <Typography
                sx={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 700,
                  fontSize: "0.8rem",
                  color: "#334155",
                  letterSpacing: "0.02em",
                }}
              >
                Progress
              </Typography>
              {isRunning && !isFailed && (
                <Box
                  sx={{
                    width: 5,
                    height: 5,
                    borderRadius: "50%",
                    bgcolor: accentColor,
                    animation: "progress-pulse 1.1s ease-in-out infinite",
                    boxShadow: `0 0 7px ${accentColor}`,
                  }}
                />
              )}
            </Stack>
            <Stack direction="row" spacing={0.3} alignItems="baseline">
              <Typography
                sx={{
                  fontFamily: "'Sora', sans-serif",
                  fontWeight: 800,
                  fontSize: "1.35rem",
                  lineHeight: 1,
                  color: accentColor,
                  transition: "color 0.4s",
                }}
              >
                {normalizedProgress}
              </Typography>
              <Typography
                sx={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 600,
                  fontSize: "0.76rem",
                  color: "#94A3B8",
                  mb: "2px",
                }}
              >
                %
              </Typography>
            </Stack>
          </Stack>

          {/* Progress bar */}
          <Box
            sx={{
              position: "relative",
              height: 9,
              borderRadius: 999,
              background: "rgba(14,60,110,0.07)",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: 0, left: 0,
                height: "100%",
                width: `${normalizedProgress}%`,
                borderRadius: 999,
                background: barGrad,
                transition: "width 0.5s cubic-bezier(0.4,0,0.2,1), background 0.5s ease",
                "&::after": isRunning && !isFailed ? {
                  content: '""',
                  position: "absolute",
                  top: 0, left: "-65%",
                  width: "55%",
                  height: "100%",
                  background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent)",
                  animation: "shimmer 1.8s ease-in-out infinite",
                } : {},
              }}
            />
          </Box>

          {/* Step indicators */}
          <Stack direction="row" justifyContent="space-between" sx={{ mt: 1.2 }}>
            {["Upload", "Validasi", "Generate", "Selesai"].map((step, i) => {
              const stepThreshold = (i + 1) * 25;
              const active = stepProgressValue >= stepThreshold;
              const isCurrent =
                stepProgressValue >= i * 25 && stepProgressValue < stepThreshold;

              return (
                <Stack key={step} alignItems="center" spacing={0.4}>
                  <Box
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      bgcolor: active ? accentColor : "rgba(14,60,110,0.13)",
                      transition: "all 0.35s ease",
                      transform: isCurrent && isRunning ? "scale(1.5)" : "scale(1)",
                      boxShadow: active
                        ? isRunning
                          ? `0 0 8px ${accentColor}`
                          : `0 0 5px ${accentColor}80`
                        : "none",
                    }}
                  />
                  <Typography
                    sx={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "0.61rem",
                      fontWeight: active ? 700 : 400,
                      color: active ? accentColor : "#94A3B8",
                      transition: "all 0.35s ease",
                    }}
                  >
                    {step}
                  </Typography>
                </Stack>
              );
            })}
          </Stack>
        </Box>

        {/* ── Error box ── */}
        {isFailed && (
          <Box
            sx={{
              borderRadius: "13px",
              p: "13px 17px",
              background: "rgba(239,68,68,0.06)",
              border: "1px solid rgba(239,68,68,0.2)",
              animation: "fade-up 0.4s ease 0.2s both",
            }}
          >
            <Stack direction="row" spacing={1.5} alignItems="flex-start">
              <ErrorOutlineRoundedIcon
                sx={{ fontSize: 17, color: "#EF4444", mt: "2px", flexShrink: 0 }}
              />
              <Typography
                sx={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.82rem",
                  color: "#DC2626",
                  lineHeight: 1.55,
                }}
              >
                {error || "Terjadi kesalahan saat proses generate invoice."}
              </Typography>
            </Stack>
          </Box>
        )}
      </Stack>
    </Paper>
  );
}