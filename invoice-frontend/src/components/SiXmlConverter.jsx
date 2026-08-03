import { useRef, useState } from "react";
import * as XLSX from "xlsx";
import AlertModal from "../piagam/AlertModal";
import {
  CheckCircle,
  CloudUpload,
  Download01,
  Eye,
  FileText01,
  PlayArrow,
} from "../templateComponents/icons.jsx";
import "./SiXmlConverter.css";

// Urutan kolom HARUS sama persis dengan urutan kolom di template "Data SI"
const COLUMNS = [
  "INVOICENO", "INVOICEDATE", "CUSTOMERID", "TERMSID", "SHIPVIA", "WAREHOUSEID", "SALESMANID",
  "SHIPTO1", "SHIPTO2", "SHIPTO3", "SHIPTO4", "SHIPTO5", "DESCRIPTION", "SHIPDATE", "TAXDATE",
  "PURCHASEORDERNO", "TAX1CODE", "TAX1RATE", "TAX2CODE", "TAX2RATE", "RATE", "INCLUSIVETAX",
  "CUSTOMERISTAXABLE", "CASHDISCOUNT", "CASHDISCPC", "FREIGHT", "FISCALRATE", "ARACCOUNT",
  "CURRENCYNAME", "TAXFORMNUMBER", "TAXFORMCODE", "DELIVERYORDER", "SOID", "DOID", "ITEMNO",
  "ITEMOVDESC", "QUANTITY", "ITEMUNIT", "UNITRATIO", "UNITPRICE", "ITEMDISCPC", "TAXCODES",
  "WAREHOUSEID_ITEM",
];
const SHEET_NAME = "Data SI";
const DATA_START_ROW = 2; // baris 1=header, baris 2=tag XML, baris 3(index2)=data pertama
const DEFAULT_BRANCH_CODE = "1142293583";

const STEPS = [
  { step: 1, label: "Unggah" },
  { step: 2, label: "Periksa" },
  { step: 3, label: "Selesai" },
];

function cellToStr(v) {
  if (v === null || v === undefined) return "";
  if (v instanceof Date) {
    const p = (n) => String(n).padStart(2, "0");
    return v.getFullYear() + "-" + p(v.getMonth() + 1) + "-" + p(v.getDate());
  }
  return String(v).trim();
}

function fmtSize(bytes) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / 1024 / 1024).toFixed(1) + " MB";
}

function num(value, fallback) {
  const n = Number(value);
  return value === "" || isNaN(n) ? fallback : n;
}

function tag(name, value) {
  const v = value === undefined || value === null ? "" : String(value).trim();
  return v === "" ? `<${name}/>` : `<${name}>${escapeXml(v)}</${name}>`;
}

function escapeXml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function processRows(rawRows) {
  const dataRows = rawRows.slice(DATA_START_ROW).filter((r) => r.some((c) => cellToStr(c) !== ""));
  const parsed = dataRows.map((r) => {
    const obj = {};
    COLUMNS.forEach((col, i) => (obj[col] = cellToStr(r[i])));
    return obj;
  });

  const invoices = [];
  const errors = [];
  let current = null;

  parsed.forEach((row, i) => {
    const rowNum = i + DATA_START_ROW + 1;
    if (row.INVOICENO === "") {
      errors.push({ row: rowNum, level: "error", msg: "No. Invoice (kolom A) kosong — baris dilewati." });
      return;
    }
    if (!current || current.INVOICENO !== row.INVOICENO) {
      current = { INVOICENO: row.INVOICENO, header: row, items: [] };
      invoices.push(current);
    }
    if (row.ITEMNO === "") {
      errors.push({ row: rowNum, level: "error", msg: `Invoice ${row.INVOICENO}: Kode Barang (ITEMNO) kosong.` });
    } else {
      if (row.QUANTITY === "" || isNaN(Number(row.QUANTITY))) {
        errors.push({ row: rowNum, level: "error", msg: `Invoice ${row.INVOICENO}, barang ${row.ITEMNO}: Qty tidak valid.` });
      }
      if (row.UNITPRICE === "" || isNaN(Number(row.UNITPRICE))) {
        errors.push({ row: rowNum, level: "error", msg: `Invoice ${row.INVOICENO}, barang ${row.ITEMNO}: Harga Satuan tidak valid.` });
      }
      current.items.push(row);
    }
    if (row.CUSTOMERID === "") {
      errors.push({ row: rowNum, level: "warn", msg: `Invoice ${row.INVOICENO}: Kode Customer kosong.` });
    }
    if (row.INVOICEDATE === "") {
      errors.push({ row: rowNum, level: "warn", msg: `Invoice ${row.INVOICENO}: Tanggal Invoice kosong.` });
    }
  });

  invoices.forEach((inv) => {
    if (inv.items.length === 0) {
      errors.push({ row: "-", level: "error", msg: `Invoice ${inv.INVOICENO} tidak punya baris barang sama sekali.` });
    }
  });

  return { rows: parsed, invoices, errors };
}

function buildXml(invoices, branchCode) {
  const branch = escapeXml(branchCode.trim());
  let out = `<?xml version="1.0"?>\n<NMEXML EximID="1" BranchCode="${branch}" ACCOUNTANTCOPYID=""><TRANSACTIONS OnError="CONTINUE">`;

  invoices.forEach((inv, idx) => {
    const h = inv.header;
    out += `<SALESINVOICE operation="Add" REQUESTID="${idx + 1}">`;

    inv.items.forEach((it, kIdx) => {
      const unitPrice = num(it.UNITPRICE, 0);
      out += `<ITEMLINE operation="Add">`;
      out += tag("KeyID", kIdx + 1);
      out += tag("ITEMNO", it.ITEMNO);
      out += tag("QUANTITY", num(it.QUANTITY, 0));
      out += tag("ITEMUNIT", it.ITEMUNIT);
      out += tag("UNITRATIO", num(it.UNITRATIO, 1));
      for (let r = 1; r <= 10; r++) out += `<ITEMRESERVED${r}/>`;
      out += tag("ITEMOVDESC", it.ITEMOVDESC);
      out += tag("UNITPRICE", unitPrice);
      out += tag("ITEMDISCPC", it.ITEMDISCPC);
      out += tag("TAXCODES", it.TAXCODES);
      out += `<GROUPSEQ/>`;
      out += tag("SOSEQ", 0);
      out += tag("BRUTOUNITPRICE", unitPrice);
      out += tag("WAREHOUSEID", it.WAREHOUSEID_ITEM || h.WAREHOUSEID);
      out += tag("QTYCONTROL", 0);
      if (it.DOID) out += tag("DOSEQ", 1);
      else out += `<DOSEQ/>`;
      out += tag("SOID", it.SOID);
      out += tag("DOID", it.DOID);
      out += `</ITEMLINE>`;
    });

    out += tag("INVOICENO", h.INVOICENO);
    out += tag("INVOICEDATE", h.INVOICEDATE);
    out += tag("TAX1CODE", h.TAX1CODE);
    out += tag("TAX2CODE", h.TAX2CODE);
    out += tag("TAX1RATE", num(h.TAX1RATE, 0));
    out += tag("TAX2RATE", num(h.TAX2RATE, 0));
    out += tag("RATE", num(h.RATE, 1));
    out += tag("INCLUSIVETAX", num(h.INCLUSIVETAX, 0));
    out += tag("CUSTOMERISTAXABLE", num(h.CUSTOMERISTAXABLE, 0));
    out += tag("CASHDISCOUNT", num(h.CASHDISCOUNT, 0));
    out += tag("CASHDISCPC", h.CASHDISCPC);
    out += tag("FREIGHT", num(h.FREIGHT, 0));
    out += tag("TERMSID", h.TERMSID);
    out += tag("SHIPVIA", h.SHIPVIA);
    out += `<FOB/>`;
    out += tag("PURCHASEORDERNO", h.PURCHASEORDERNO);
    out += tag("WAREHOUSEID", h.WAREHOUSEID);
    out += tag("DESCRIPTION", h.DESCRIPTION);
    out += tag("SHIPDATE", h.SHIPDATE || h.INVOICEDATE);
    out += tag("DELIVERYORDER", h.DELIVERYORDER);
    out += tag("FISCALRATE", num(h.FISCALRATE, 1));
    out += tag("TAXDATE", h.TAXDATE || h.INVOICEDATE);
    out += tag("CUSTOMERID", h.CUSTOMERID);
    out += `<SALESMANID><LASTNAME></LASTNAME>` + tag("FIRSTNAME", h.SALESMANID) + `</SALESMANID>`;
    out += tag("PRINTED", 0);
    out += tag("SHIPTO1", h.SHIPTO1);
    out += tag("SHIPTO2", h.SHIPTO2);
    out += tag("SHIPTO3", h.SHIPTO3);
    out += tag("SHIPTO4", h.SHIPTO4);
    out += tag("SHIPTO5", h.SHIPTO5);
    out += tag("ARACCOUNT", h.ARACCOUNT);
    out += tag("TAXFORMNUMBER", h.TAXFORMNUMBER);
    out += tag("TAXFORMCODE", h.TAXFORMCODE);
    out += tag("CURRENCYNAME", h.CURRENCYNAME || "IDR");
    out += `<AUTOMATICINSERTGROUPING/>`;
    out += `</SALESINVOICE>`;
  });

  out += `</TRANSACTIONS></NMEXML>`;
  return out;
}

function highlightXml(xml) {
  const escaped = xml.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  return escaped
    .replace(/(&lt;\/?)([A-Za-z0-9_]+)/g, `$1<span class="sixml-tag">$2</span>`)
    .replace(/([A-Za-z0-9_]+)(=)(&quot;[^&]*&quot;)/g, `<span class="sixml-attr">$1</span>$2<span class="sixml-val">$3</span>`);
}

export default function SiXmlConverter() {
  const [step, setStep] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState(0);
  const [invoices, setInvoices] = useState([]);
  const [errors, setErrors] = useState([]);
  const [branchCode, setBranchCode] = useState(DEFAULT_BRANCH_CODE);
  const [xml, setXml] = useState("");
  const [showPreview, setShowPreview] = useState(true);
  const [alertState, setAlertState] = useState({ open: false, message: "" });
  const fileInputRef = useRef(null);

  const handleFile = (file) => {
    if (!file) return;
    const allowed = [".xlsx", ".xls"];
    if (!allowed.some((ext) => file.name.toLowerCase().endsWith(ext))) {
      setAlertState({ open: true, message: "File harus berformat .xlsx atau .xls" });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const wb = XLSX.read(e.target.result, { type: "array", cellDates: true });
        const sheetName = wb.SheetNames.find((n) => n.trim().toLowerCase() === SHEET_NAME.toLowerCase()) || wb.SheetNames[0];
        const ws = wb.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "", raw: false, dateNF: "yyyy-mm-dd" });
        const { invoices: parsedInvoices, errors: parsedErrors } = processRows(rows);

        setFileName(file.name);
        setFileSize(file.size);
        setInvoices(parsedInvoices);
        setErrors(parsedErrors);
        setStep(2);
      } catch (err) {
        setAlertState({ open: true, message: "Gagal membaca file: " + err.message });
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleInputChange = (e) => handleFile(e.target.files?.[0]);
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files?.[0]);
  };
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => setIsDragging(false);
  const handleOpenFile = () => fileInputRef.current?.click();

  const totalItems = invoices.reduce((s, inv) => s + inv.items.length, 0);
  const errorCount = errors.filter((e) => e.level === "error").length;
  const stepPercent = ((step - 1) / (STEPS.length - 1)) * 100;

  const handleConvert = () => {
    const generatedXml = buildXml(invoices, branchCode);
    setXml(generatedXml);
    setStep(3);
  };

  const handleDownload = () => {
    const blob = new Blob([xml], { type: "application/xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const base = fileName.replace(/\.(xlsx|xls)$/i, "") || "sales_invoice";
    a.href = url;
    a.download = base + ".xml";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setStep(1);
    setFileName("");
    setFileSize(0);
    setInvoices([]);
    setErrors([]);
    setBranchCode(DEFAULT_BRANCH_CODE);
    setXml("");
    setShowPreview(true);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <section className="dashboard-panel workspace-panel sixml-panel">
      <div className="dashboard-panel__header">
        <div>
          <p className="dashboard-panel__eyebrow">Accurate 5 Desktop</p>
          <h2 className="dashboard-panel__title">Excel to XML Converter (SI)</h2>
        </div>
      </div>

      <div className="status-progress sixml-progress">
        <div className="status-progress__header">
          <span className="dashboard-card__label">{STEPS[step - 1]?.label}</span>
          <span className="status-progress__header-right">
            <span className={`status-badge status-badge--${step === STEPS.length ? "success" : "info"}`}>
              Langkah {step}/{STEPS.length}
            </span>
            <span className="status-progress__value">{Math.round(stepPercent)}%</span>
          </span>
        </div>
        <div className="status-progress__track">
          <div
            className={`status-progress__fill${step === STEPS.length ? " status-progress__fill--success" : ""}`}
            style={{ width: `${stepPercent}%` }}
          />
          <div className="status-progress__dots">
            {STEPS.map((s, idx) => {
              const dotPercent = (idx / (STEPS.length - 1)) * 100;
              return (
                <span
                  key={s.step}
                  className={`status-progress__dot${s.step <= step ? " status-progress__dot--active" : ""}`}
                  style={{ left: `${dotPercent}%` }}
                />
              );
            })}
          </div>
          <span className="status-progress__marker" style={{ left: `${stepPercent}%` }} />
        </div>
        <div className="status-progress__range">
          {STEPS.map((s, idx) => {
            const dotPercent = (idx / (STEPS.length - 1)) * 100;
            const isFirst = idx === 0;
            const isLast = idx === STEPS.length - 1;
            return (
              <span
                key={s.step}
                className={`status-progress__range-point${s.step <= step ? " status-progress__range-point--active" : ""}`}
                style={{
                  left: `${dotPercent}%`,
                  transform: `translateX(${isFirst ? "0" : isLast ? "-100%" : "-50%"})`,
                }}
              >
                {isFirst ? <PlayArrow size={11} /> : isLast ? <CheckCircle size={11} /> : null}
                {s.label}
              </span>
            );
          })}
        </div>
      </div>

      {step === 1 ? (
        <div
          className={`upload-dropzone${isDragging ? " upload-dropzone--dragging" : ""}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={handleOpenFile}
        >
          <input ref={fileInputRef} type="file" accept=".xlsx,.xls" hidden onChange={handleInputChange} />
          <div className="upload-dropzone__icon">
            <CloudUpload size={26} />
          </div>
          <p className="upload-dropzone__title">Seret file ke sini, atau klik untuk memilih</p>
          <p className="upload-dropzone__detail">Format .xlsx — gunakan sheet bernama "Data SI"</p>
        </div>
      ) : null}

      {step === 2 ? (
        <div className="workspace-grid sixml-pair-grid">
          <div className="upload-file-chip">
            <div className="upload-file-chip__name">
              <FileText01 size={16} />
              {fileName}
            </div>
            <div className="upload-file-chip__meta">
              <span className="dashboard-card__label">{fmtSize(fileSize)}</span>
              <button type="button" className="sixml-file-chip-remove" onClick={handleReset}>Hapus</button>
            </div>
          </div>

          <div className="status-stat-row sixml-stat-row">
            <div className="status-stat-box">
              <div className="status-stat-box__icon status-stat-box__icon--neutral">
                <FileText01 size={18} />
              </div>
              <div className="status-stat-box__body">
                <span className="dashboard-card__label">Invoice</span>
                <strong>{invoices.length}</strong>
              </div>
            </div>
            <div className="status-stat-box">
              <div className="status-stat-box__icon status-stat-box__icon--neutral">
                <FileText01 size={18} />
              </div>
              <div className="status-stat-box__body">
                <span className="dashboard-card__label">Baris Barang</span>
                <strong>{totalItems}</strong>
              </div>
            </div>
            <div className="status-stat-box">
              <div className={`status-stat-box__icon${errorCount > 0 ? "" : " status-stat-box__icon--neutral"}`}>
                <FileText01 size={18} />
              </div>
              <div className="status-stat-box__body">
                <span className="dashboard-card__label">Bermasalah</span>
                <strong>{errorCount}</strong>
              </div>
            </div>
          </div>

          <div className="upload-form-row sixml-pair-cell">
            <label className="upload-form-field">
              <span className="dashboard-card__label">Branch ID (BranchCode)</span>
              <div className="upload-form-field__input">
                <input
                  type="text"
                  value={branchCode}
                  onChange={(e) => setBranchCode(e.target.value)}
                />
              </div>
            </label>
          </div>

          <div className="sixml-pair-cell">
            {errors.length === 0 ? (
              <div className="sixml-ok-banner">
                <CheckCircle size={16} />
                Semua data terlihat lengkap dan siap dikonversi.
              </div>
            ) : (
              <div className="sixml-issues">
                {errors.map((e, i) => (
                  <div key={i} className={`sixml-issue${e.level === "warn" ? " warn" : ""}`}>
                    <span>{e.level === "warn" ? "⚠" : "✕"}</span>
                    <span><b>Baris {e.row}:</b> {e.msg}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="upload-form-row">
            <button type="button" className="dashboard-card__action" onClick={handleConvert} disabled={errorCount > 0}>
              Konversi ke XML
            </button>
            <button type="button" className="dashboard-card__action dashboard-card__action--outline" onClick={handleReset}>Ganti file</button>
          </div>
        </div>
      ) : null}

      {step === 3 ? (
        <div className="sixml-result">
          <div className="sixml-result-head">
            <div className="status-stat-box__icon"><CheckCircle size={24} /></div>
            <div>
              <div className="sixml-result-title">Konversi berhasil</div>
              <div className="sixml-result-sub">{invoices.length} invoice · {totalItems} baris barang siap diimport ke Accurate 5.</div>
            </div>
          </div>

          <div className="sixml-preview-toggle" onClick={() => setShowPreview((v) => !v)}>
            <Eye size={14} />
            {showPreview ? "Sembunyikan isi XML" : "Lihat isi XML"}
          </div>
          {showPreview ? (
            <pre className="sixml-xml-preview show" dangerouslySetInnerHTML={{ __html: highlightXml(xml) }} />
          ) : null}

          <div className="upload-form-row">
            <button type="button" className="dashboard-card__action" onClick={handleDownload}>
              <Download01 size={16} /> Unduh File XML
            </button>
            <button type="button" className="dashboard-card__action dashboard-card__action--outline" onClick={handleReset}>Konversi file lain</button>
          </div>
        </div>
      ) : null}

      <p className="dashboard-panel__description sixml-footnote">
        File diproses sepenuhnya di browser Anda — tidak diunggah ke server manapun.
      </p>

      <AlertModal
        open={alertState.open}
        severity="warning"
        message={alertState.message}
        onClose={() => setAlertState({ open: false, message: "" })}
      />
    </section>
  );
}
