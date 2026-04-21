import { Box, Chip, Paper, Stack, Typography } from "@mui/material";
import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import HourglassEmptyRoundedIcon from "@mui/icons-material/HourglassEmptyRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";

function BgDecor({ accentColor, isDone, isFailed }) {
  return (
    <Box
      sx={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        overflow: "hidden",
        borderRadius: "26px",
        zIndex: 0,
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 720 240"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
        style={{ position: "absolute", inset: 0 }}
      >
        <defs>
          <linearGradient id="statusWave" x1="0%" x2="100%" y1="0%" y2="0%">
            <stop offset="0%" stopColor={accentColor} stopOpacity="0" />
            <stop offset="45%" stopColor={accentColor} stopOpacity="0.40" />
            <stop offset="100%" stopColor={accentColor} stopOpacity="0" />
          </linearGradient>
        </defs>

        <path
          d="M-20 175C102 112 183 102 286 116C392 129 468 185 570 173C626 166 674 140 742 98"
          stroke="url(#statusWave)"
          strokeWidth="1.4"
          fill="none"
        />
        <path
          d="M-5 210C118 178 199 149 298 154C397 160 489 218 602 206C652 201 701 182 750 160"
          stroke="url(#statusWave)"
          strokeWidth="1"
          fill="none"
          opacity="0.76"
        />

        <circle
          cx="580"
          cy="56"
          r="52"
          fill="none"
          stroke={accentColor}
          strokeWidth="1.1"
          strokeDasharray="4 8"
          opacity="0.16"
        />
        <circle
          cx="580"
          cy="56"
          r="30"
          fill="none"
          stroke={accentColor}
          strokeWidth="0.9"
          strokeDasharray="3 6"
          opacity="0.11"
        />

        <rect x="72" y="34" width="102" height="74" rx="20" fill={accentColor} opacity="0.075" />
        <rect x="98" y="57" width="50" height="8" rx="4" fill="white" opacity="0.76" />
        <rect x="98" y="74" width="34" height="6" rx="3" fill="white" opacity="0.54" />

        <rect x="524" y="142" width="112" height="78" rx="20" fill={accentColor} opacity="0.075" />
        <rect x="547" y="165" width="16" height="32" rx="8" fill="white" opacity="0.54" />
        <rect x="573" y="154" width="16" height="43" rx="8" fill="white" opacity="0.70" />
        <rect x="599" y="146" width="16" height="51" rx="8" fill="white" opacity="0.84" />

        <line x1="186" y1="198" x2="416" y2="198" stroke={accentColor} strokeWidth="0.8" opacity="0.12" />
        <line x1="208" y1="208" x2="372" y2="208" stroke={accentColor} strokeWidth="0.8" opacity="0.08" />
      </svg>

      <Box
        sx={{
          position: "absolute",
          top: -90,
          right: -70,
          width: 280,
          height: 280,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${accentColor}${isFailed ? "18" : "16"} 0%, transparent 72%)`,
          animation: "orb-drift 12s ease-in-out infinite",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          left: -80,
          bottom: -100,
          width: 240,
          height: 240,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${
            isDone ? "#10B98112" : "#23397114"
          } 0%, transparent 72%)`,
          animation: "orb-drift 14s ease-in-out infinite reverse",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(125deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 42%)",
        }}
      />
    </Box>
  );
}

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

  const accentColor = isFailed ? "#EF4444" : isDone ? "#10B981" : "#233971";
  const accentLight = isFailed
    ? "rgba(239,68,68,0.10)"
    : isDone
      ? "rgba(16,185,129,0.10)"
      : "rgba(35,57,113,0.10)";
  const accentBorder = isFailed
    ? "rgba(239,68,68,0.22)"
    : isDone
      ? "rgba(16,185,129,0.22)"
      : "rgba(35,57,113,0.20)";
  const accentGrad = isFailed
    ? "linear-gradient(135deg, #EF4444, #F87171)"
    : isDone
      ? "linear-gradient(135deg, #10B981, #34D399)"
      : "linear-gradient(135deg, #233971, #35529A)";
  const barGrad = isFailed
    ? "linear-gradient(90deg, #EF4444, #F87171)"
    : isDone
      ? "linear-gradient(90deg, #10B981, #34D399)"
      : "linear-gradient(90deg, #233971, #2F4B8F, #4468B3)";

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: "26px",
        overflow: "hidden",
        position: "relative",
        background:
          "linear-gradient(145deg, rgba(246,249,255,0.98) 0%, rgba(236,242,255,0.98) 55%, rgba(223,232,252,0.98) 100%)",
        boxShadow: `
          0 0 0 1px ${accentBorder},
          0 10px 26px rgba(35,57,113,0.10),
          0 24px 54px rgba(35,57,113,0.12)
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
          "50%": { transform: "translate(-12px, -12px)" },
        },
      }}
    >
      <BgDecor accentColor={accentColor} isDone={isDone} isFailed={isFailed} />

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
                color: "#5F6F89",
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
                  sx={{ fontSize: "15px !important", color: "#7D8CA5 !important" }}
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
              borderRadius: "999px",
              background: accentLight,
              border: `1px solid ${accentBorder}`,
              color: accentColor,
            }}
          />
        </Stack>

        <Box
          sx={{
            borderRadius: "18px",
            p: "14px 17px",
            animation: "fade-up 0.45s ease 0.07s both",
            background: "rgba(255,255,255,0.76)",
            backdropFilter: "blur(14px)",
            border: isRunning
              ? `1px solid ${accentBorder}`
              : isFailed
                ? "1px solid rgba(239,68,68,0.2)"
                : "1px solid rgba(188,202,232,0.78)",
            boxShadow: isRunning
              ? `0 0 0 4px ${accentLight}`
              : "0 6px 18px rgba(15,23,42,0.05)",
            transition: "border-color 0.3s, box-shadow 0.3s",
          }}
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: "14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                background: selectedFile ? accentGrad : "linear-gradient(135deg,#E2E8F0,#CBD5E1)",
                boxShadow: selectedFile ? `0 10px 20px ${accentLight}` : "none",
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
                  borderRadius: "999px",
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

        {(isRunning || isDone || isFailed) && (
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={1.25}
            sx={{ animation: "fade-up 0.45s ease 0.12s both" }}
          >
            <Box
              sx={{
                flex: 1,
                borderRadius: "16px",
                p: "14px 15px",
                background: "rgba(255,255,255,0.72)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(188,202,232,0.68)",
                boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                position: "relative",
                overflow: "hidden",
                "&::after": isRunning && !isFailed
                  ? {
                      content: '""',
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: "2px",
                      background: barGrad,
                      animation: "shimmer 2.2s ease-in-out infinite",
                    }
                  : {},
              }}
            >
              <Typography
                sx={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.67rem",
                  fontWeight: 700,
                  color: "#8A99B2",
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
                }}
              >
                {currentInvoice || (isDone ? "Semua invoice selesai" : "-")}
              </Typography>
            </Box>

            <Box
              sx={{
                minWidth: { xs: "100%", md: 165 },
                borderRadius: "16px",
                p: "14px 15px",
                background: "rgba(255,255,255,0.72)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(188,202,232,0.68)",
                boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
              }}
            >
              <Typography
                sx={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.67rem",
                  fontWeight: 700,
                  color: "#8A99B2",
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
                  }}
                >
                  {total > 0 ? current : "-"}
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

        <Box sx={{ animation: "fade-up 0.45s ease 0.17s both" }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.2 }}>
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

          <Box
            sx={{
              position: "relative",
              height: 10,
              borderRadius: 999,
              background: "rgba(35,57,113,0.08)",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                height: "100%",
                width: `${normalizedProgress}%`,
                borderRadius: 999,
                background: barGrad,
                transition: "width 0.5s cubic-bezier(0.4,0,0.2,1), background 0.5s ease",
                "&::after": isRunning && !isFailed
                  ? {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: "-65%",
                      width: "55%",
                      height: "100%",
                      background:
                        "linear-gradient(90deg, transparent, rgba(255,255,255,0.50), transparent)",
                      animation: "shimmer 1.8s ease-in-out infinite",
                    }
                  : {},
              }}
            />
          </Box>

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
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      bgcolor: active ? accentColor : "rgba(35,57,113,0.12)",
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
                      fontWeight: active ? 700 : 500,
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

        {isFailed && (
          <Box
            sx={{
              borderRadius: "14px",
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