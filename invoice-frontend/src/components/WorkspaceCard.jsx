import { useEffect, useRef, useState } from "react";
import * as XLSX from "xlsx";
import AlertModal from "../piagam/AlertModal";
import {
  BarChartSquare02,
  CheckCircle,
  CloudUpload,
  Download01,
  Eye,
  FileText01,
  FolderOpen,
  PlayArrow,
  RefreshCw05,
} from "../templateComponents/icons.jsx";

const uploadTips = [
  "Each row in the file will be generated as one invoice",
  "Make sure column headers match the invoice template",
];

const statusMeta = {
  idle: { label: "Waiting for File", tone: "neutral" },
  queued: { label: "Queued", tone: "info" },
  processing: { label: "Processing", tone: "info" },
  completed: { label: "Completed", tone: "success" },
  failed: { label: "Failed", tone: "danger" },
};

const progressStages = [
  { label: "Start", at: 0 },
  { label: "Upload", at: 30 },
  { label: "Process", at: 65 },
  { label: "Done", at: 100 },
];

export default function WorkspaceCard({
  selectedFile,
  outputFolder,
  setOutputFolder,
  onFileChange,
  onGenerate,
  isProcessing,
  jobStatus = "idle",
  statusText = "",
  current = 0,
  total = 0,
  currentInvoice = "",
  progress = 0,
  result,
  history = [],
}) {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [alertState, setAlertState] = useState({ open: false, message: "" });
  const [fileInfo, setFileInfo] = useState(null);
  const [fileInfoFailed, setFileInfoFailed] = useState(false);

  useEffect(() => {
    if (!selectedFile) {
      setFileInfo(null);
      setFileInfoFailed(false);
      return;
    }

    let cancelled = false;
    setFileInfo(null);
    setFileInfoFailed(false);

    const reader = new FileReader();
    reader.onload = (event) => {
      if (cancelled) return;
      try {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
          header: 1,
          blankrows: false,
        });
        setFileInfo({
          rows: Math.max(rows.length - 1, 0),
          columns: rows[0]?.length ?? 0,
          sheetName,
        });
      } catch {
        setFileInfoFailed(true);
      }
    };
    reader.onerror = () => setFileInfoFailed(true);
    reader.readAsArrayBuffer(selectedFile);

    return () => {
      cancelled = true;
    };
  }, [selectedFile]);

  const isQueued = jobStatus === "queued";
  const isRunning = isProcessing || isQueued || jobStatus === "processing";
  const isCompleted = jobStatus === "completed";
  const isFailed = jobStatus === "failed";
  const normalizedProgress = Math.max(0, Math.min(100, Number(progress) || 0));

  const currentStatusMeta = statusMeta[jobStatus] ?? statusMeta.idle;

  const handleOpenFile = () => {
    if (isRunning) return;
    fileInputRef.current?.click();
  };

  const validateAndSetFile = (file) => {
    if (!file) return;
    const allowed = [".xlsx", ".xls", ".csv"];
    if (!allowed.some((ext) => file.name.toLowerCase().endsWith(ext))) {
      setAlertState({ open: true, message: "File must be .xlsx, .xls, or .csv" });
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
  const handleDragOver = (e) => {
    e.preventDefault();
    if (!isRunning) setIsDragging(true);
  };
  const handleDragLeave = () => setIsDragging(false);

  const fileSizeKB = selectedFile
    ? selectedFile.size < 1024 * 1024
      ? `${(selectedFile.size / 1024).toFixed(1)} KB`
      : `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB`
    : null;

  const generateButtonText = isRunning ? "Processing..." : isCompleted ? "Generate Again" : "Generate Invoice";

  const dropzoneClassName = [
    "upload-dropzone",
    "upload-dropzone--compact",
    isDragging ? "upload-dropzone--dragging" : "",
    selectedFile ? "upload-dropzone--filled" : "",
    isFailed ? "upload-dropzone--failed" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const safeResult = result || {};
  const hasResult = Object.keys(safeResult).length > 0;
  const previewUrl = safeResult.preview_url || "";
  const downloadUrl = safeResult.download_url || "";
  const outputFile = safeResult.output_file || "";
  const isResultCompleted = safeResult.status === "completed" || safeResult.success === true;
  const canPreview = isResultCompleted && !!previewUrl;
  const canDownload = isResultCompleted && !!downloadUrl;

  const handleOpenPdf = () => {
    if (!canPreview) {
      setAlertState({ open: true, message: "File is not ready yet." });
      return;
    }
    window.open(previewUrl, "_blank", "noopener,noreferrer");
  };

  const handleDownloadPdf = () => {
    if (!canDownload) {
      setAlertState({ open: true, message: "File is not ready yet." });
      return;
    }
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = outputFile || "invoice.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatHistoryDate = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleString(undefined, {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatHistorySize = (bytes) => {
    if (!bytes) return "";
    return bytes < 1024 * 1024
      ? `${(bytes / 1024).toFixed(1)} KB`
      : `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const handleOpenHistoryItem = (item) => {
    window.open(item.preview_url, "_blank", "noopener,noreferrer");
  };

  const handleDownloadHistoryItem = (item) => {
    const link = document.createElement("a");
    link.href = item.download_url;
    link.download = item.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="dashboard-panel workspace-panel">
      <div className="dashboard-panel__header">
        <div>
          <p className="dashboard-panel__eyebrow">Invoice Generator</p>
          <h2 className="dashboard-panel__title">Upload &amp; Generate Invoice</h2>
        </div>
      </div>

      <div className="workspace-grid">
        <div className="workspace-col">
          <div
            className={dropzoneClassName}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={handleOpenFile}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              hidden
              onChange={handleInputChange}
            />
            <div className="upload-dropzone__icon">
              {isRunning ? (
                <RefreshCw05 size={26} className="icon-spin" />
              ) : selectedFile ? (
                <CheckCircle size={26} />
              ) : (
                <CloudUpload size={26} />
              )}
            </div>
            <p className="upload-dropzone__title">
              {isRunning
                ? "File is being processed"
                : isDragging
                ? "Drop the file here"
                : selectedFile
                ? "File selected — click to change"
                : "Drag & Drop your Excel / CSV file here"}
            </p>
            <p className="upload-dropzone__detail">
              {selectedFile ? `${selectedFile.name} · ${fileSizeKB}` : "Format: .xlsx / .xls / .csv"}
            </p>
          </div>

          <div className="workspace-history">
            <span className="dashboard-card__label">Invoice History</span>
            <div className="workspace-history__list">
              {history.length === 0 ? (
                <p className="workspace-history__empty">No invoices generated yet.</p>
              ) : (
                history.map((item) => (
                  <div key={item.filename} className="workspace-history__item">
                    <div className="workspace-history__info">
                      <FileText01 size={15} />
                      <div className="workspace-history__text">
                        <span className="workspace-history__name">{item.filename}</span>
                        <span className="workspace-history__meta">
                          {formatHistoryDate(item.created_at)}
                          {item.size ? ` · ${formatHistorySize(item.size)}` : ""}
                        </span>
                      </div>
                    </div>
                    <div className="workspace-history__actions">
                      <button
                        type="button"
                        className="workspace-history__icon-button"
                        onClick={() => handleOpenHistoryItem(item)}
                        aria-label={`View ${item.filename}`}
                        title="View"
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        type="button"
                        className="workspace-history__icon-button workspace-history__icon-button--download"
                        onClick={() => handleDownloadHistoryItem(item)}
                        aria-label={`Download ${item.filename}`}
                        title="Download"
                      >
                        <Download01 size={14} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="upload-form-row">
            <label className="upload-form-field">
              <span className="dashboard-card__label">Output Folder</span>
              <div className="upload-form-field__input">
                <FolderOpen size={16} />
                <input
                  type="text"
                  value={outputFolder}
                  onChange={(e) => setOutputFolder(e.target.value)}
                  disabled={isRunning}
                />
              </div>
            </label>

            <button
              type="button"
              className="dashboard-card__action"
              onClick={onGenerate}
              disabled={isRunning || !selectedFile}
            >
              {isRunning ? <RefreshCw05 size={16} className="icon-spin" /> : <PlayArrow size={16} />}
              {generateButtonText}
            </button>
          </div>
        </div>

        <div className="workspace-col">
          <div className="status-stat-row status-stat-row--compact">
            <div className="status-stat-box">
              <div className="status-stat-box__icon status-stat-box__icon--neutral">
                <FileText01 size={18} />
              </div>
              <div className="status-stat-box__body">
                <span className="dashboard-card__label">Current Invoice</span>
                <strong>{currentInvoice || (isCompleted ? "All invoices done" : "-")}</strong>
              </div>
            </div>
            <div className="status-stat-box">
              <div className="status-stat-box__icon status-stat-box__icon--neutral">
                <BarChartSquare02 size={18} />
              </div>
              <div className="status-stat-box__body">
                <span className="dashboard-card__label">Total Processed</span>
                <strong>
                  {total > 0 ? current : "-"}
                  {total > 0 ? <span className="status-stat-box__total"> / {total}</span> : null}
                </strong>
              </div>
            </div>
          </div>

          <div className={`status-progress${isRunning ? " status-progress--live" : ""}`}>
            <div className="status-progress__header">
              <span className="dashboard-card__label">
                {isRunning ? <span className="status-progress__live-dot" /> : null}
                {statusText || "Progress"}
              </span>
              <span className="status-progress__header-right">
                <span className={`status-badge status-badge--${currentStatusMeta.tone}`}>
                  {currentStatusMeta.label}
                </span>
                <span className="status-progress__value">{normalizedProgress}%</span>
              </span>
            </div>
            <div className="status-progress__track">
              <div
                className={`status-progress__fill${isRunning ? " status-progress__fill--running" : ""}${isFailed ? " status-progress__fill--danger" : isCompleted ? " status-progress__fill--success" : ""}`}
                style={{ width: `${normalizedProgress}%` }}
              />
              <div className="status-progress__dots">
                {progressStages.map((stage, idx) => {
                  const isLast = idx === progressStages.length - 1;
                  const reached = isLast ? isCompleted : normalizedProgress >= stage.at;
                  return (
                    <span
                      key={stage.label}
                      className={`status-progress__dot${reached ? " status-progress__dot--active" : ""}`}
                      style={{ left: `${stage.at}%` }}
                    />
                  );
                })}
              </div>
              <span
                className={`status-progress__marker${isRunning ? " status-progress__marker--live" : ""}`}
                style={{ left: `${normalizedProgress}%` }}
              />
            </div>
            <div className="status-progress__range">
              {progressStages.map((stage, idx) => {
                const isFirst = idx === 0;
                const isLast = idx === progressStages.length - 1;
                const reached = isLast ? isCompleted : normalizedProgress >= stage.at;
                return (
                  <span
                    key={stage.label}
                    className={`status-progress__range-point${reached ? " status-progress__range-point--active" : ""}`}
                    style={{
                      left: `${stage.at}%`,
                      transform: `translateX(${isFirst ? "0" : isLast ? "-100%" : "-50%"})`,
                    }}
                  >
                    {isFirst ? <PlayArrow size={11} /> : isLast ? <CheckCircle size={11} /> : null}
                    {stage.label}
                  </span>
                );
              })}
            </div>
          </div>

          {selectedFile ? (
            <div className="workspace-hint workspace-hint--data">
              {fileInfoFailed ? (
                <p className="workspace-hint__error">Could not read this file's contents.</p>
              ) : fileInfo ? (
                <>
                  <span className="workspace-hint__count">{fileInfo.rows}</span>
                  <span className="workspace-hint__label">rows of data detected</span>
                  <span className="workspace-hint__sub">
                    {fileInfo.columns} columns · Sheet: {fileInfo.sheetName}
                  </span>
                </>
              ) : (
                <p className="workspace-hint__loading">Reading file...</p>
              )}
            </div>
          ) : (
            <ul className="workspace-hint">
              {uploadTips.map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>
          )}

          <div className="workspace-result">
            <div className="upload-file-chip">
              <div className="upload-file-chip__name">
                <FileText01 size={16} />
                {hasResult ? outputFile || "Invoice result" : "No result yet"}
              </div>
              <div className="upload-file-chip__meta">
                <span className="dashboard-card__label">
                  {hasResult ? `${safeResult.total_invoices ?? 0} invoices` : "Waiting to generate"}
                </span>
              </div>
            </div>
            <div className="upload-form-row">
              <button
                type="button"
                className="dashboard-card__action"
                onClick={handleDownloadPdf}
                disabled={!canDownload}
              >
                <Download01 size={16} />
                Download PDF
              </button>
              <button
                type="button"
                className="dashboard-card__action dashboard-card__action--outline"
                onClick={handleOpenPdf}
                disabled={!canPreview}
              >
                <Eye size={16} />
                View Output
              </button>
            </div>
          </div>
        </div>
      </div>

      <AlertModal
        open={alertState.open}
        severity="warning"
        message={alertState.message}
        onClose={() => setAlertState({ open: false, message: "" })}
      />
    </section>
  );
}
