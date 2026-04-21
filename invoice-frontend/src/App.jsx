import { useRef, useState } from "react";
import axios from "axios";
import { Box, Container, Snackbar, Stack, Typography } from "@mui/material";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ErrorRoundedIcon from "@mui/icons-material/ErrorRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import Layout from "./components/Layout";
import Header from "./components/Header";
import ProcessStatus from "./components/ProcessStatus";
import ResultCard from "./components/ResultCard";
import UploadCard from "./components/UploadCard";
import { AuthProvider } from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";

const API_BASE = "";
const POLL_INTERVAL_MS = 1500;

const theme = createTheme({
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        "html, body, #root": {
          margin: 0,
          padding: 0,
          minHeight: "100%",
          width: "100%",
        },
        body: {
          backgroundColor: "#dde5ed",
        },
      },
    },
  },
});

const snackbarConfig = {
  success: {
    icon: <CheckCircleRoundedIcon sx={{ fontSize: 20 }} />,
    bg: "linear-gradient(135deg, #059669, #10B981)",
    shadow: "0 8px 24px rgba(16,185,129,0.35)",
  },
  error: {
    icon: <ErrorRoundedIcon sx={{ fontSize: 20 }} />,
    bg: "linear-gradient(135deg, #DC2626, #EF4444)",
    shadow: "0 8px 24px rgba(220,38,38,0.35)",
  },
  warning: {
    icon: <WarningAmberRoundedIcon sx={{ fontSize: 20 }} />,
    bg: "linear-gradient(135deg, #D97706, #FBBF24)",
    shadow: "0 8px 24px rgba(217,119,6,0.35)",
  },
  info: {
    icon: <InfoRoundedIcon sx={{ fontSize: 20 }} />,
    bg: "linear-gradient(135deg, #233971, #4A7FC1)",
    shadow: "0 8px 24px rgba(35,57,113,0.30)",
  },
};

function DotPattern({
  x,
  y,
  cols = 14,
  rows = 10,
  gap = 24,
  r = 2,
  color = "rgba(120,160,195,0.35)",
}) {
  const dots = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      dots.push(
        <circle
          key={`${row}-${col}`}
          cx={x + col * gap}
          cy={y + row * gap}
          r={r}
          fill={color}
        />
      );
    }
  }
  return <>{dots}</>;
}

function InvoiceApp() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [outputFolder, setOutputFolder] = useState("invoices_output");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("Belum ada proses.");
  const [result, setResult] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success",
    message: "",
  });
  const [jobStatus, setJobStatus] = useState("idle");
  const [currentInvoice, setCurrentInvoice] = useState("");
  const [currentCount, setCurrentCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const pollRef = useRef(null);

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, severity, message });
  };

  const stopPolling = () => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  };

  const startPolling = (jobId) => {
    stopPolling();
    pollRef.current = setInterval(async () => {
      try {
        const res = await axios.get(`${API_BASE}/progress/${jobId}`);
        const data = res.data;
        setJobStatus(data.status);
        setProgress(data.percent ?? 0);
        setStatusText(data.message ?? "");
        setCurrentInvoice(data.current_invoice ?? "");
        setCurrentCount(data.current ?? 0);
        setTotalCount(data.total ?? 0);

        if (data.status === "completed") {
          stopPolling();
          setIsProcessing(false);
          setResult(data);
          showSnackbar(
            data.message || `${data.total_invoices ?? data.total} invoice berhasil dibuat.`,
            "success"
          );
        }

        if (data.status === "failed") {
          stopPolling();
          setIsProcessing(false);
          setErrorMsg(data.error ?? "Terjadi kesalahan.");
          setStatusText("Terjadi kesalahan saat proses generate.");
          setProgress(0);
          showSnackbar(data.error || "Gagal memproses invoice.", "error");
        }
      } catch (err) {
        console.warn("[polling error]", err);
      }
    }, POLL_INTERVAL_MS);
  };

  const handleFileChange = (file) => {
    setSelectedFile(file);
    setResult(null);
    setStatusText("File siap diproses.");
    setProgress(0);
    setJobStatus("idle");
    setCurrentInvoice("");
    setCurrentCount(0);
    setTotalCount(0);
    setErrorMsg("");
  };

  const handleReset = () => {
    stopPolling();
    setSelectedFile(null);
    setOutputFolder("invoices_output");
    setIsProcessing(false);
    setProgress(0);
    setStatusText("Belum ada proses.");
    setResult(null);
    setJobStatus("idle");
    setCurrentInvoice("");
    setCurrentCount(0);
    setTotalCount(0);
    setErrorMsg("");
    showSnackbar("Form berhasil direset.", "info");
  };

  const handleGenerate = async () => {
    if (!selectedFile) {
      showSnackbar("Silakan pilih file Excel terlebih dahulu.", "warning");
      return;
    }

    stopPolling();
    setIsProcessing(true);
    setProgress(10);
    setStatusText("Menyiapkan upload file...");
    setResult(null);
    setJobStatus("queued");
    setCurrentInvoice("");
    setCurrentCount(0);
    setTotalCount(0);
    setErrorMsg("");

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("output_folder", outputFolder);

      setProgress(25);
      setStatusText("Mengunggah file ke backend...");

      const response = await axios.post(`${API_BASE}/generate-invoices`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          if (!progressEvent.total) return;
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          const mappedProgress = Math.min(20 + Math.round(percent * 0.4), 60);
          setProgress(mappedProgress);
          setStatusText(`Upload file... ${percent}%`);
        },
      });

      const data = response.data;

      if (!data.job_id) {
        setResult(data);
        setProgress(100);
        setJobStatus("completed");
        setStatusText(data.message || "Generate invoice selesai.");
        showSnackbar(data.message || "Invoice berhasil dibuat.", "success");
        setIsProcessing(false);
        return;
      }

      setStatusText("File berhasil diupload, menunggu proses backend...");
      setJobStatus("queued");
      startPolling(data.job_id);
    } catch (error) {
      console.error("Generate invoice error:", error);
      console.error("Generate invoice error detail:", error.response?.data);

      let errorMessage = "Gagal memproses invoice.";
      if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      stopPolling();
      setJobStatus("failed");
      setErrorMsg(errorMessage);
      setStatusText("Terjadi kesalahan saat proses generate.");
      setProgress(0);
      setResult(null);
      setIsProcessing(false);
      showSnackbar(errorMessage, "error");
    }
  };

  const cfg = snackbarConfig[snackbar.severity] ?? snackbarConfig.info;

  return (
    <Layout>
      <Box
        sx={{
          minHeight: "100vh",
          width: "100%",
          position: "relative",
          overflow: "hidden",
          backgroundColor: "#dde5ed",
          backgroundImage: [
            "radial-gradient(ellipse 55% 50% at 100% 10%, rgba(160,200,230,0.70) 0%, rgba(140,185,220,0.35) 50%, transparent 75%)",
            "radial-gradient(ellipse 60% 55% at 100% 72%, rgba(155,200,230,0.65) 0%, rgba(130,180,218,0.30) 50%, transparent 75%)",
            "radial-gradient(ellipse 75% 60% at -5% 105%, rgba(240,175,80,0.75) 0%, rgba(235,160,60,0.55) 25%, rgba(228,195,130,0.35) 55%, transparent 78%)",
            "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(220,232,242,0.35) 0%, transparent 70%)",
            "linear-gradient(150deg, #e2eaf2 0%, #d8e2ec 50%, #d4dfe9 100%)",
          ].join(", "),
        }}
      >
        <Box
          component="svg"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 960"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            zIndex: 0,
          }}
        >
          <path
            d="M900 300 Q1050 200 1200 280 Q1350 360 1500 240 L1500 600 Q1350 700 1180 620 Q1020 540 900 620 Z"
            fill="rgba(175,215,240,0.40)"
          />
          <path
            d="M700 560 Q920 460 1140 540 Q1320 608 1500 500 L1500 960 L700 960 Z"
            fill="rgba(175,215,240,0.25)"
          />

          <path
            d="M-200 700 Q0 580 200 680 Q340 750 480 860 Q300 960 -200 960 Z"
            fill="rgba(240,185,90,0.30)"
          />
          <path
            d="M-200 780 Q-20 680 160 758 Q300 820 430 920 Q220 960 -200 960 Z"
            fill="rgba(238,170,70,0.48)"
          />
          <path
            d="M-200 870 Q-60 810 100 858 Q220 892 340 960 L-200 960 Z"
            fill="rgba(232,158,55,0.65)"
          />
          <path
            d="M-200 860 Q-40 800 120 845 Q250 878 360 950 Q200 940 -200 940 Z"
            fill="rgba(250,210,120,0.30)"
          />

          <DotPattern
            x={960}
            y={60}
            cols={14}
            rows={9}
            gap={26}
            r={2.2}
            color="rgba(110,155,195,0.32)"
          />
          <DotPattern
            x={1100}
            y={560}
            cols={9}
            rows={7}
            gap={22}
            r={1.8}
            color="rgba(110,155,195,0.22)"
          />
        </Box>

        <Container
          maxWidth="lg"
          sx={{
            py: { xs: 2.25, md: 4.5 },
            px: { xs: 2, sm: 3 },
            position: "relative",
            zIndex: 1,
          }}
        >
          <Stack spacing={3}>
            <Header />

            <UploadCard
              selectedFile={selectedFile}
              outputFolder={outputFolder}
              setOutputFolder={setOutputFolder}
              onFileChange={handleFileChange}
              onGenerate={handleGenerate}
              onReset={handleReset}
              isProcessing={isProcessing}
              jobStatus={jobStatus}
              statusText={statusText}
              current={currentCount}
              total={totalCount}
            />

            <ProcessStatus
              isProcessing={isProcessing}
              progress={progress}
              statusText={statusText}
              selectedFile={selectedFile}
              jobStatus={jobStatus}
              currentInvoice={currentInvoice}
              current={currentCount}
              total={totalCount}
              error={errorMsg}
            />

            {result && <ResultCard result={result} />}
          </Stack>

          <Box sx={{ mt: 5, mb: 1, textAlign: "center" }}>
            <Typography
              sx={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.75rem",
                color: "rgba(35,57,113,0.55)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Invoice Generator | PT Pilar Niaga Makmur
            </Typography>
          </Box>
        </Container>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3500}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            px: 2.5,
            py: 1.5,
            borderRadius: "16px",
            background: cfg.bg,
            boxShadow: cfg.shadow,
            color: "#fff",
            minWidth: 260,
            maxWidth: 400,
            border: "1px solid rgba(255,255,255,0.18)",
            backdropFilter: "blur(8px)",
            "@keyframes slide-up": {
              from: { opacity: 0, transform: "translateY(16px)" },
              to: { opacity: 1, transform: "translateY(0)" },
            },
            animation: "slide-up 0.3s cubic-bezier(0.34,1.56,0.64,1) both",
          }}
        >
          <Box sx={{ flexShrink: 0, display: "flex" }}>{cfg.icon}</Box>
          <Typography
            sx={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 600,
              fontSize: "0.87rem",
              flex: 1,
              lineHeight: 1.4,
            }}
          >
            {snackbar.message}
          </Typography>
          <Box
            onClick={() => setSnackbar((prev) => ({ ...prev, open: false }))}
            sx={{
              cursor: "pointer",
              opacity: 0.7,
              fontSize: "1.1rem",
              lineHeight: 1,
              flexShrink: 0,
              "&:hover": { opacity: 1 },
              userSelect: "none",
            }}
          >
            ×
          </Box>
        </Box>
      </Snackbar>
    </Layout>
  );
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <ProtectedRoute>
          <InvoiceApp />
        </ProtectedRoute>
      </AuthProvider>
    </ThemeProvider>
  );
}