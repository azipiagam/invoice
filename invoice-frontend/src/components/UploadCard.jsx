import { useRef, useState } from "react";
import {
  Box,
  Button,
  Divider,
  Paper,
  Stack,
  TextField,
  Typography,
  Chip,
  InputAdornment,
} from "@mui/material";
import FolderOpenRoundedIcon from "@mui/icons-material/FolderOpenRounded";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";
import CloudUploadRoundedIcon from "@mui/icons-material/CloudUploadRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import InsertDriveFileRoundedIcon from "@mui/icons-material/InsertDriveFileRounded";
import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";

// ── Decorative SVG background (matching ProcessStatus) ─────────────────────
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
        viewBox="0 0 680 380"
        preserveAspectRatio="xMaxYMid slice"
        xmlns="http://www.w3.org/2000/svg"
        style={{ position: "absolute", inset: 0 }}
      >
        {/* Large faint upload icon — top right */}
        <g opacity="0.055" transform="translate(545, -20) rotate(12)">
          <rect x="0" y="0" width="100" height="120" rx="14" fill={accentColor} />
          <polyline
            points="50,30 50,80"
            stroke="white"
            strokeWidth="7"
            strokeLinecap="round"
            fill="none"
          />
          <polyline
            points="28,52 50,30 72,52"
            stroke="white"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <rect x="18" y="90" width="64" height="8" rx="4" fill="white" opacity="0.55" />
        </g>

        {/* Medium faint table icon — bottom left */}
        <g opacity="0.05" transform="translate(-14, 230)">
          <rect x="0" y="0" width="130" height="100" rx="14" fill={accentColor} />
          <rect x="10" y="10" width="110" height="18" rx="5" fill="white" />
          <rect x="10" y="36" width="50" height="14" rx="4" fill="white" opacity="0.6" />
          <rect x="70" y="36" width="50" height="14" rx="4" fill="white" opacity="0.6" />
          <rect x="10" y="58" width="50" height="14" rx="4" fill="white" opacity="0.4" />
          <rect x="70" y="58" width="50" height="14" rx="4" fill="white" opacity="0.4" />
          <rect x="10" y="78" width="50" height="14" rx="4" fill="white" opacity="0.25" />
          <rect x="70" y="78" width="50" height="14" rx="4" fill="white" opacity="0.25" />
        </g>

        {/* Small faint file icon — mid right */}
        <g opacity="0.05" transform="translate(615, 160)">
          <rect x="0" y="0" width="52" height="64" rx="8" fill={accentColor} />
          <polygon points="34,0 52,18 34,18" fill="white" opacity="0.5" />
          <rect x="8" y="26" width="36" height="5" rx="2.5" fill="white" />
          <rect x="8" y="36" width="28" height="5" rx="2.5" fill="white" />
          <rect x="8" y="46" width="20" height="5" rx="2.5" fill="white" />
        </g>

        {/* Tiny faint chart — bottom right */}
        <g opacity="0.045" transform="translate(570, 280)">
          <rect x="0" y="0" width="90" height="72" rx="10" fill={accentColor} />
          <rect x="10" y="44" width="10" height="18" rx="3" fill="white" />
          <rect x="26" y="30" width="10" height="32" rx="3" fill="white" />
          <rect x="42" y="18" width="10" height="44" rx="3" fill="white" />
          <rect x="58" y="34" width="10" height="28" rx="3" fill="white" />
          <rect x="74" y="24" width="10" height="38" rx="3" fill="white" />
        </g>

        {/* Dotted circle — top left area */}
        <circle
          cx="100"
          cy="80"
          r="55"
          fill="none"
          stroke={accentColor}
          strokeWidth="1.2"
          strokeDasharray="4 7"
          opacity="0.1"
        />
        <circle
          cx="100"
          cy="80"
          r="34"
          fill="none"
          stroke={accentColor}
          strokeWidth="0.8"
          strokeDasharray="3 5"
          opacity="0.07"
        />

        {/* Dotted circle — bottom right */}
        <circle
          cx="580"
          cy="300"
          r="44"
          fill="none"
          stroke={accentColor}
          strokeWidth="1.2"
          strokeDasharray="4 6"
          opacity="0.1"
        />

        {/* Subtle horizontal decorative lines */}
        <line x1="200" y1="355" x2="420" y2="355" stroke={accentColor} strokeWidth="0.8" opacity="0.1" />
        <line x1="220" y1="363" x2="370" y2="363" stroke={accentColor} strokeWidth="0.8" opacity="0.06" />
      </svg>

      {/* Soft gradient washes */}
      <Box
        sx={{
          position: "absolute",
          top: -60,
          right: -60,
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${accentColor}15 0%, transparent 70%)`,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: -50,
          left: -50,
          width: 240,
          height: 240,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(14,165,233,0.07) 0%, transparent 70%)",
        }}
      />
    </Box>
  );
}

// ── Main component ─────────────────────────────────────────────────────────
export default function UploadCard({
  selectedFile,
  outputFolder,
  setOutputFolder,
  onFileChange,
  onGenerate,
  onReset,
  isProcessing,
  jobStatus = "idle",
  statusText = "",
  current = 0,
  total = 0,
}) {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const isQueued   = jobStatus === "queued";
  const isRunning  = isProcessing || isQueued || jobStatus === "processing";
  const isCompleted = jobStatus === "completed";
  const isFailed   = jobStatus === "failed";

  // ── color tokens (mirrors ProcessStatus) ──
  const accentColor  = isFailed ? "#EF4444" : isCompleted ? "#10B981" : "#6366F1";
  const accentLight  = isFailed ? "rgba(239,68,68,0.10)" : isCompleted ? "rgba(16,185,129,0.10)" : "rgba(99,102,241,0.10)";
  const accentBorder = isFailed ? "rgba(239,68,68,0.22)" : isCompleted ? "rgba(16,185,129,0.22)" : "rgba(99,102,241,0.22)";
  const accentGrad   = isFailed
    ? "linear-gradient(135deg, #EF4444, #F87171)"
    : isCompleted
    ? "linear-gradient(135deg, #10B981, #34D399)"
    : "linear-gradient(135deg, #6366F1, #818CF8)";

  // ── helpers ──
  const handleOpenFile = () => { if (isRunning) return; fileInputRef.current?.click(); };

  const validateAndSetFile = (file) => {
    if (!file) return;
    const allowed = [".xlsx", ".xls", ".csv"];
    if (!allowed.some((ext) => file.name.toLowerCase().endsWith(ext))) {
      alert("File harus berupa .xlsx, .xls, atau .csv");
      return;
    }
    onFileChange(file);
  };

  const handleInputChange = (e) => validateAndSetFile(e.target.files?.[0]);
  const handleDrop = (e) => {
    e.preventDefault();
    if (isRunning) return;
    setIsDragging(false);
    validateAndSetFile(e.dataTransfer.files?.[0]);
  };
  const handleDragOver = (e) => { e.preventDefault(); if (!isRunning) setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);

  const fileSizeKB = selectedFile
    ? selectedFile.size < 1024 * 1024
      ? `${(selectedFile.size / 1024).toFixed(1)} KB`
      : `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB`
    : null;

  const generateButtonText = isRunning ? "Memproses..." : isCompleted ? "Generate Lagi" : "Generate Invoice";

  const helperStatusText = isRunning
    ? total > 0
      ? `${statusText || "Sedang memproses invoice"} (${current}/${total})`
      : statusText || "Sedang memproses invoice..."
    : isCompleted
    ? statusText || "Proses selesai, file PDF siap digunakan"
    : isFailed
    ? statusText || "Proses gagal, silakan cek data lalu coba lagi"
    : "Pilih file Excel atau CSV untuk diproses menjadi invoice PDF secara otomatis.";

  // Drop zone border
  const dropBorderColor = isFailed
    ? "rgba(239,68,68,0.28)"
    : isDragging
    ? accentColor
    : selectedFile
    ? accentBorder
    : "rgba(14,60,110,0.18)";

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

        "@keyframes spin":          { from: { transform: "rotate(0deg)" }, to: { transform: "rotate(360deg)" } },
        "@keyframes fade-up":       { from: { opacity: 0, transform: "translateY(10px)" }, to: { opacity: 1, transform: "translateY(0)" } },
        "@keyframes pop-in":        { "0%": { transform: "scale(0.88)", opacity: 0 }, "60%": { transform: "scale(1.04)" }, "100%": { transform: "scale(1)", opacity: 1 } },
        "@keyframes shimmer":       { "0%": { left: "-65%" }, "100%": { left: "130%" } },
        "@keyframes pulse-ring":    { "0%": { transform: "scale(1)", opacity: 0.4 }, "100%": { transform: "scale(1.55)", opacity: 0 } },
        "@keyframes float":         { "0%,100%": { transform: "translateY(0px)" }, "50%": { transform: "translateY(-5px)" } },
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
        sx={{ p: { xs: "20px 20px", md: "26px 32px" }, position: "relative", zIndex: 2 }}
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
              Upload File Excel / CSV
            </Typography>
            <Typography
              sx={{
                mt: 0.35,
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.81rem",
                color: isFailed ? "#DC2626" : "#64748B",
                transition: "color 0.3s",
              }}
            >
              {helperStatusText}
            </Typography>
          </Box>

          {/* Status chip — mirrors ProcessStatus */}
          <Chip
            icon={
              isFailed ? (
                <ErrorOutlineRoundedIcon sx={{ fontSize: "15px !important", color: `${accentColor} !important` }} />
              ) : isCompleted ? (
                <CheckCircleRoundedIcon sx={{ fontSize: "15px !important", color: `${accentColor} !important` }} />
              ) : isRunning ? (
                <AutorenewRoundedIcon sx={{ fontSize: "15px !important", color: `${accentColor} !important`, animation: "spin 1.3s linear infinite" }} />
              ) : (
                <CloudUploadRoundedIcon sx={{ fontSize: "15px !important", color: "#94A3B8 !important" }} />
              )
            }
            label={
              isFailed ? "Gagal" :
              isCompleted ? "Selesai" :
              isRunning ? "Memproses" :
              "Siap Upload"
            }
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

        {/* ── Drop zone ── */}
        <Box
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={handleOpenFile}
          sx={{
            border: "2px dashed",
            borderColor: dropBorderColor,
            borderRadius: "20px",
            p: { xs: "28px 20px", md: "44px 32px" },
            textAlign: "center",
            cursor: isRunning ? "not-allowed" : "pointer",
            position: "relative",
            overflow: "hidden",
            background: isFailed
              ? "rgba(239,68,68,0.03)"
              : isDragging
              ? accentLight
              : selectedFile
              ? "rgba(99,102,241,0.03)"
              : "linear-gradient(180deg, rgba(241,245,255,0.7) 0%, rgba(255,255,255,0.9) 100%)",
            transition: "all 0.25s ease",
            animation: "fade-up 0.45s ease 0.07s both",
            "&:hover": isRunning ? {} : {
              borderColor: accentColor,
              background: accentLight,
              "& .upload-icon-box": {
                transform: "translateY(-4px)",
                boxShadow: `0 16px 36px ${accentLight}`,
              },
            },
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            hidden
            onChange={handleInputChange}
          />

          {/* Shimmer on drag */}
          {isDragging && !isRunning && (
            <Box
              sx={{
                position: "absolute",
                top: 0, left: "-65%",
                width: "55%", height: "100%",
                background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.08), transparent)",
                animation: "shimmer 1.2s ease-in-out infinite",
                pointerEvents: "none",
              }}
            />
          )}

          <Stack spacing={2} alignItems="center">
            {/* Icon with pulse ring */}
            <Box sx={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {!selectedFile && !isRunning && (
                <Box
                  sx={{
                    position: "absolute",
                    width: 72, height: 72,
                    borderRadius: "22px",
                    background: accentLight,
                    animation: "pulse-ring 2.4s ease-out infinite",
                  }}
                />
              )}
              <Box
                className="upload-icon-box"
                sx={{
                  width: 72, height: 72,
                  borderRadius: "22px",
                  background: isFailed
                    ? "linear-gradient(135deg, #EF4444, #F87171)"
                    : selectedFile
                    ? "linear-gradient(135deg, #10B981, #34D399)"
                    : accentGrad,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: isFailed
                    ? "0 12px 30px rgba(239,68,68,0.22)"
                    : selectedFile
                    ? "0 12px 30px rgba(16,185,129,0.28)"
                    : "0 12px 30px rgba(99,102,241,0.28)",
                  transition: "all 0.3s ease",
                  animation: isRunning ? "none" : "float 4s ease-in-out infinite",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                {isRunning ? (
                  <AutorenewRoundedIcon sx={{ fontSize: 34, color: "#fff", animation: "spin 1.2s linear infinite" }} />
                ) : selectedFile ? (
                  <CheckCircleRoundedIcon sx={{ fontSize: 34, color: "#fff" }} />
                ) : (
                  <CloudUploadRoundedIcon sx={{ fontSize: 34, color: "#fff" }} />
                )}
              </Box>
            </Box>

            <Box>
              <Typography
                sx={{
                  fontFamily: "'Sora', sans-serif",
                  fontWeight: 700,
                  fontSize: "1rem",
                  color: isFailed ? "#DC2626" : isDragging ? accentColor : "#0F172A",
                  transition: "color 0.2s ease",
                }}
              >
                {isRunning
                  ? "File sedang diproses"
                  : isDragging
                  ? "Lepaskan file di sini"
                  : selectedFile
                  ? "File sudah dipilih — klik untuk ganti"
                  : "Drag & Drop file Excel / CSV di sini"}
              </Typography>
              <Typography
                sx={{
                  mt: 0.4,
                  color: "#94A3B8",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.8rem",
                }}
              >
                {isRunning
                  ? "Mohon tunggu sampai proses generate selesai"
                  : selectedFile
                  ? "atau drag & drop file baru untuk mengganti"
                  : "atau klik area ini untuk memilih file dari komputer"}
              </Typography>
            </Box>

            <Chip
              label="Format: .xlsx / .xls / .csv"
              size="small"
              sx={{
                background: accentLight,
                border: `1px solid ${accentBorder}`,
                color: accentColor,
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 700,
                fontSize: "0.72rem",
                letterSpacing: "0.02em",
                height: 26,
              }}
            />
          </Stack>
        </Box>

        {/* ── Selected file card (mirrors ProcessStatus file card) ── */}
        {selectedFile && (
          <Box
            sx={{
              borderRadius: "16px",
              p: "13px 17px",
              animation: "pop-in 0.4s cubic-bezier(0.34,1.56,0.64,1) both",
              background: "rgba(255,255,255,0.72)",
              backdropFilter: "blur(12px)",
              border: isRunning ? `1px solid ${accentBorder}` : "1px solid rgba(226,232,240,0.9)",
              boxShadow: isRunning ? `0 0 0 3px ${accentLight}` : "0 1px 4px rgba(0,0,0,0.05)",
              transition: "border-color 0.3s, box-shadow 0.3s",
            }}
          >
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Box
                sx={{
                  width: 40, height: 40,
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  background: accentGrad,
                  boxShadow: `0 6px 16px ${accentLight}`,
                  transition: "all 0.4s ease",
                }}
              >
                <InsertDriveFileRoundedIcon sx={{ fontSize: 20, color: "#fff" }} />
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
                  {selectedFile.name}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "0.76rem",
                    color: "#64748B",
                    mt: 0.3,
                  }}
                >
                  {fileSizeKB}
                </Typography>
              </Box>

              <Box
                sx={{
                  px: 1.3, py: 0.45,
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
                  {selectedFile.name.split(".").pop().toUpperCase()}
                </Typography>
              </Box>
            </Stack>
          </Box>
        )}

        {/* ── Divider ── */}
        <Divider sx={{ borderColor: "rgba(14,60,110,0.08)", animation: "fade-up 0.45s ease 0.18s both" }} />

        {/* ── Output folder + action buttons ── */}
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          alignItems={{ xs: "stretch", md: "center" }}
          sx={{ animation: "fade-up 0.45s ease 0.22s both" }}
        >
          <TextField
            fullWidth
            label="Output Folder"
            value={outputFolder}
            onChange={(e) => setOutputFolder(e.target.value)}
            disabled={isRunning}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FolderOpenRoundedIcon sx={{ color: "#94A3B8", fontSize: 20 }} />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "14px",
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 500,
                fontSize: "0.9rem",
                background: "rgba(255,255,255,0.8)",
                backdropFilter: "blur(8px)",
                "& fieldset": { borderColor: "rgba(14,60,110,0.14)" },
                "&:hover fieldset": { borderColor: accentBorder },
                "&.Mui-focused fieldset": { borderColor: accentColor },
              },
              "& .MuiInputLabel-root": {
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.88rem",
                "&.Mui-focused": { color: accentColor },
              },
            }}
          />

          <Stack direction="row" spacing={1.5} flexShrink={0}>
            {/* Generate button */}
            <Button
              variant="contained"
              size="large"
              startIcon={
                isRunning
                  ? <AutorenewRoundedIcon sx={{ animation: "spin 1.2s linear infinite" }} />
                  : <PlayArrowRoundedIcon />
              }
              onClick={onGenerate}
              disabled={isRunning || !selectedFile}
              sx={{
                minWidth: 180,
                borderRadius: "14px",
                textTransform: "none",
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 700,
                fontSize: "0.92rem",
                px: 3,
                py: 1.3,
                position: "relative",
                overflow: "hidden",
                background: accentGrad,
                boxShadow: isFailed
                  ? "0 6px 20px rgba(239,68,68,0.24)"
                  : isCompleted
                  ? "0 6px 20px rgba(16,185,129,0.28)"
                  : "0 6px 20px rgba(99,102,241,0.32)",
                transition: "all 0.3s ease",
                "&::after": {
                  content: '""',
                  position: "absolute",
                  top: 0, left: "-65%",
                  width: "55%", height: "100%",
                  background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)",
                  transition: "left 0.4s ease",
                },
                "&:hover:not(.Mui-disabled)": {
                  boxShadow: isFailed
                    ? "0 8px 28px rgba(239,68,68,0.36)"
                    : isCompleted
                    ? "0 8px 28px rgba(16,185,129,0.36)"
                    : "0 8px 28px rgba(99,102,241,0.44)",
                  "&::after": { left: "120%" },
                },
                "&.Mui-disabled": {
                  background: "rgba(14,60,110,0.1)",
                  boxShadow: "none",
                },
              }}
            >
              {generateButtonText}
            </Button>

            {/* Reset button */}
            <Button
              variant="outlined"
              size="large"
              startIcon={<RestartAltRoundedIcon />}
              onClick={onReset}
              disabled={isRunning}
              sx={{
                minWidth: 110,
                borderRadius: "14px",
                textTransform: "none",
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 700,
                fontSize: "0.92rem",
                py: 1.3,
                borderColor: "rgba(14,60,110,0.18)",
                color: "#475569",
                transition: "all 0.25s ease",
                "&:hover": {
                  borderColor: accentColor,
                  color: accentColor,
                  background: accentLight,
                },
                "&.Mui-disabled": {
                  borderColor: "rgba(0,0,0,0.08)",
                  color: "#CBD5E1",
                },
              }}
            >
              Reset
            </Button>
          </Stack>
        </Stack>

        {/* ── Error box (mirrors ProcessStatus) ── */}
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
              <ErrorOutlineRoundedIcon sx={{ fontSize: 17, color: "#EF4444", mt: "2px", flexShrink: 0 }} />
              <Typography
                sx={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.82rem",
                  color: "#DC2626",
                  lineHeight: 1.55,
                }}
              >
                {statusText || "Proses gagal. Periksa kembali format file dan coba lagi."}
              </Typography>
            </Stack>
          </Box>
        )}
      </Stack>
    </Paper>
  );
}