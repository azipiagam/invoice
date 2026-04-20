from dotenv import load_dotenv
load_dotenv()
from pathlib import Path
import shutil
import threading
import time
from datetime import datetime

from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from invoice_generator import convert_excel_to_single_pdf
from auth import verify_token

app = FastAPI(title="Premium Invoice API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = Path(__file__).resolve().parent
UPLOAD_DIR = BASE_DIR / "uploads"
OUTPUT_DIR = BASE_DIR / "outputs"
FRONTEND_DIST = BASE_DIR.parent / "invoice-frontend" / "dist"

UPLOAD_DIR.mkdir(exist_ok=True)
OUTPUT_DIR.mkdir(exist_ok=True)

JOB_PROGRESS = {}
JOB_LOCK = threading.Lock()


def set_job_progress(job_id, **kwargs):
    with JOB_LOCK:
        if job_id not in JOB_PROGRESS:
            JOB_PROGRESS[job_id] = {}
        JOB_PROGRESS[job_id].update(kwargs)
        JOB_PROGRESS[job_id]["updated_at"] = datetime.now().isoformat()


def get_job_progress(job_id):
    with JOB_LOCK:
        return JOB_PROGRESS.get(job_id)


def safe_delete_file(path: Path):
    try:
        if path.exists() and path.is_file():
            path.unlink()
    except Exception:
        pass


def cleanup_old_files(folder_path: Path, max_age_hours=24):
    try:
        if not folder_path.exists() or not folder_path.is_dir():
            return

        now = time.time()
        max_age_seconds = max_age_hours * 3600

        for file_path in folder_path.iterdir():
            if file_path.is_file():
                try:
                    file_age = now - file_path.stat().st_mtime
                    if file_age > max_age_seconds:
                        file_path.unlink()
                        print(f"[CLEANUP] Deleted old file: {file_path.name}")
                except Exception as e:
                    print(f"[CLEANUP] Gagal hapus {file_path.name}: {e}")
    except Exception as e:
        print(f"[CLEANUP] Error saat membersihkan folder: {e}")


def process_invoice_job(job_id, excel_path: Path, pdf_path: Path):
    try:
        set_job_progress(
            job_id,
            status="processing",
            message="Memulai proses generate invoice",
            current=0,
            total=0,
            percent=0,
            current_invoice="",
            output_file=pdf_path.name,
            preview_url=f"/preview/{pdf_path.name}",
            download_url=f"/download/{pdf_path.name}",
            success=False,
            error=None,
        )

        def progress_callback(current, total, invoice_no=None):
            percent = int((current / total) * 100) if total > 0 else 0
            set_job_progress(
                job_id,
                status="processing",
                message=f"Memproses invoice {current} dari {total}",
                current=current,
                total=total,
                percent=percent,
                current_invoice=invoice_no or "",
            )

        result = convert_excel_to_single_pdf(
            str(excel_path),
            str(pdf_path),
            progress_callback=progress_callback,
        )

        set_job_progress(
            job_id,
            status="completed",
            message="Invoice premium berhasil dibuat",
            current=result["total_orders"],
            total=result["total_orders"],
            percent=100,
            current_invoice="",
            output_file=pdf_path.name,
            preview_url=f"/preview/{pdf_path.name}",
            download_url=f"/download/{pdf_path.name}",
            total_invoices=result["total_orders"],
            success=True,
            error=None,
        )

    except Exception as e:
        set_job_progress(
            job_id,
            status="failed",
            message="Proses generate invoice gagal",
            success=False,
            error=str(e),
        )
    finally:
        safe_delete_file(excel_path)


# ── Protected routes (semua butuh JWT) ────────────────────────────────────────

@app.post("/generate-invoices")
async def generate_invoices(
    file: UploadFile = File(...),
    output_folder: str = Form("invoice_premium"),
    current_user: dict = Depends(verify_token),
):
    try:
        if not file.filename:
            raise HTTPException(status_code=400, detail="File tidak ditemukan.")

        cleanup_old_files(OUTPUT_DIR, max_age_hours=24)

        job_id = datetime.now().strftime("%Y%m%d%H%M%S%f")

        original_name = Path(file.filename).name
        safe_filename = original_name.replace("/", "_").replace("\\", "_")
        excel_path = UPLOAD_DIR / f"{job_id}_{safe_filename}"

        with open(excel_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        safe_output_folder = (output_folder or "invoice_premium").strip()
        safe_output_folder = safe_output_folder.replace("/", "_").replace("\\", "_")
        safe_output_folder = safe_output_folder.replace("..", "_")
        if not safe_output_folder:
            safe_output_folder = "invoice_premium"

        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        pdf_name = f"{safe_output_folder}_{timestamp}.pdf"
        pdf_path = OUTPUT_DIR / pdf_name

        set_job_progress(
            job_id,
            status="queued",
            message="File berhasil diupload, menunggu proses",
            current=0,
            total=0,
            percent=0,
            current_invoice="",
            output_file=pdf_name,
            preview_url=f"/preview/{pdf_name}",
            download_url=f"/download/{pdf_name}",
            success=False,
            error=None,
            created_at=datetime.now().isoformat(),
            triggered_by=current_user.get("name", current_user.get("username", "unknown")),
        )

        thread = threading.Thread(
            target=process_invoice_job,
            args=(job_id, excel_path, pdf_path),
            daemon=True,
        )
        thread.start()

        return {
            "success": True,
            "message": "Proses generate invoice dimulai",
            "job_id": job_id,
            "status_url": f"/progress/{job_id}",
            "preview_url": f"/preview/{pdf_name}",
            "download_url": f"/download/{pdf_name}",
            "output_file": pdf_name,
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/progress/{job_id}")
def get_progress(
    job_id: str,
    current_user: dict = Depends(verify_token),
):
    job = get_job_progress(job_id)

    if not job:
        raise HTTPException(status_code=404, detail="Job tidak ditemukan.")

    return dict(job)


@app.get("/preview/{filename}")
def preview_file(
    filename: str,
    current_user: dict = Depends(verify_token),
):
    file_path = OUTPUT_DIR / filename

    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File tidak ditemukan.")

    return FileResponse(
        path=str(file_path),
        media_type="application/pdf",
        headers={
            "Content-Disposition": "inline",
            "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
            "Pragma": "no-cache",
            "Expires": "0",
        },
    )


@app.get("/download/{filename}")
def download_file(
    filename: str,
    current_user: dict = Depends(verify_token),
):
    file_path = OUTPUT_DIR / filename

    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File tidak ditemukan.")

    return FileResponse(
        path=str(file_path),
        filename=filename,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"',
            "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
            "Pragma": "no-cache",
            "Expires": "0",
        },
    )


# ── Frontend (SPA) — tidak butuh auth, browser handle redirect ────────────────

if FRONTEND_DIST.exists():
    app.mount(
        "/assets",
        StaticFiles(directory=FRONTEND_DIST / "assets"),
        name="assets",
    )

    favicon_file = FRONTEND_DIST / "favicon.svg"
    if favicon_file.exists():
        @app.get("/favicon.svg")
        def favicon():
            return FileResponse(favicon_file)

    @app.get("/")
    def serve_frontend():
        return FileResponse(FRONTEND_DIST / "index.html")

    @app.get("/{full_path:path}")
    def serve_spa(full_path: str):
        target = FRONTEND_DIST / full_path
        if target.exists() and target.is_file():
            return FileResponse(target)

        if "." in full_path:
            raise HTTPException(status_code=404, detail="File tidak ditemukan.")

        return FileResponse(FRONTEND_DIST / "index.html")
else:
    @app.get("/")
    def root():
        return {"message": "Premium Invoice API running"}