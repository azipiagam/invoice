import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Box, Snackbar, Typography } from "@mui/material";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ErrorRoundedIcon from "@mui/icons-material/ErrorRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import WorkspaceCard from "./components/WorkspaceCard";
import { AuthProvider, useAuth } from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";
import { BackgroundMain, Header, Sidebar } from "./templateComponents";
import "./templateComponents/templateComponents.css";
import { useSessionGuard } from './hooks/useSessionGuard'

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

function InvoiceApp() {
  const { user, logout } = useAuth();

  useSessionGuard(() => {
    logout()
    const returnUrl = encodeURIComponent(window.location.origin)
    window.location.href = `${import.meta.env.VITE_PILARGROUP_URL}?return_url=${returnUrl}`
  })
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarMobileOpen, setSidebarMobileOpen] = useState(false);

  const [selectedFile, setSelectedFile] = useState(null);
  const [outputFolder, setOutputFolder] = useState("invoices_output");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("No process yet.");
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
  const [, setErrorMsg] = useState("");
  const [history, setHistory] = useState([]);
  const pollRef = useRef(null);

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, severity, message });
  };

  const fetchHistory = async () => {
    try {
      const res = await axios.get(`${API_BASE}/history`);
      setHistory(res.data?.items ?? []);
    } catch (err) {
      console.warn("[history fetch error]", err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

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

        if (data.status === "processing") {
          // Backend reports its own 0-100% for this phase; remap it into the
          // "Process" band (65-99%) so the bar keeps moving forward instead
          // of jumping back after the upload phase (which ends around 60%).
          const backendPercent = Math.max(0, Math.min(100, Number(data.percent) || 0));
          setProgress(65 + Math.round((backendPercent / 100) * 34));
        } else if (data.status === "completed") {
          setProgress(100);
        } else {
          setProgress((prev) => Math.max(prev, data.percent ?? 0));
        }

        setStatusText(data.message ?? "");
        setCurrentInvoice(data.current_invoice ?? "");
        setCurrentCount(data.current ?? 0);
        setTotalCount(data.total ?? 0);

        if (data.status === "completed") {
          stopPolling();
          setIsProcessing(false);
          setResult(data);
          showSnackbar(
            data.message || `${data.total_invoices ?? data.total} invoices generated successfully.`,
            "success"
          );
          fetchHistory();
        }

        if (data.status === "failed") {
          stopPolling();
          setIsProcessing(false);
          setErrorMsg(data.error ?? "An error occurred.");
          setStatusText("An error occurred while generating.");
          setProgress(0);
          showSnackbar(data.error || "Failed to process invoices.", "error");
        }
      } catch (err) {
        console.warn("[polling error]", err);
      }
    }, POLL_INTERVAL_MS);
  };

  const handleFileChange = (file) => {
    setSelectedFile(file);
    setResult(null);
    setStatusText("File is ready to process.");
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
    setStatusText("No process yet.");
    setResult(null);
    setJobStatus("idle");
    setCurrentInvoice("");
    setCurrentCount(0);
    setTotalCount(0);
    setErrorMsg("");
    showSnackbar("Form reset successfully.", "info");
  };

  const handleGenerate = async () => {
    if (!selectedFile) {
      showSnackbar("Please select an Excel file first.", "warning");
      return;
    }

    stopPolling();
    setIsProcessing(true);
    setProgress(10);
    setStatusText("Preparing file upload...");
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
      setStatusText("Uploading file to backend...");

      const response = await axios.post(`${API_BASE}/generate-invoices`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          if (!progressEvent.total) return;
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          const mappedProgress = Math.min(20 + Math.round(percent * 0.4), 60);
          setProgress(mappedProgress);
          setStatusText(`Uploading file... ${percent}%`);
        },
      });

      const data = response.data;

      if (!data.job_id) {
        setResult(data);
        setProgress(100);
        setJobStatus("completed");
        setStatusText(data.message || "Invoice generation completed.");
        showSnackbar(data.message || "Invoices generated successfully.", "success");
        setIsProcessing(false);
        fetchHistory();
        return;
      }

      setStatusText("File uploaded successfully, waiting for backend processing...");
      setJobStatus("queued");
      startPolling(data.job_id);
    } catch (error) {
      console.error("Generate invoice error:", error);

      let errorMessage = "Failed to process invoices.";
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
      setStatusText("An error occurred while generating.");
      setProgress(0);
      setResult(null);
      setIsProcessing(false);
      showSnackbar(errorMessage, "error");
    }
  };

  const handleSidebarAction = (action) => {
    if (action === "logout") {
      logout();
    }
  };

  const cfg = snackbarConfig[snackbar.severity] ?? snackbarConfig.info;

  const shellClass = [
    "dashboard-shell",
    sidebarCollapsed ? "dashboard-shell--sidebar-collapsed" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <BackgroundMain />

      <div className={shellClass}>
      <Sidebar
        collapsed={sidebarCollapsed}
        mobileOpen={sidebarMobileOpen}
        activePath="/"
        userName={user?.name ?? "User"}
        userRole={user?.job_position ?? user?.department ?? "Invoice System"}
        onToggleCollapse={() => setSidebarCollapsed((v) => !v)}
        onCloseMobile={() => setSidebarMobileOpen(false)}
        onAction={handleSidebarAction}
      />

      <div className="dashboard-stage">
        <Header
          title="Bill Forge"
          breadcrumb={[{ label: "Invoice Generator", active: true }]}
          showMenuButton
          onMenuToggle={() => setSidebarMobileOpen((v) => !v)}
          onReset={handleReset}
        />

        <main className="dashboard-main dashboard-main--no-scroll">
          <WorkspaceCard
            selectedFile={selectedFile}
            outputFolder={outputFolder}
            setOutputFolder={setOutputFolder}
            onFileChange={handleFileChange}
            onGenerate={handleGenerate}
            isProcessing={isProcessing}
            jobStatus={jobStatus}
            statusText={statusText}
            current={currentCount}
            total={totalCount}
            currentInvoice={currentInvoice}
            progress={progress}
            result={result}
            history={history}
          />
        </main>
      </div>

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
      </div>
    </>
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
