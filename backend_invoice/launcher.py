import threading
import time
import socket
import uvicorn
import webview


def wait_for_server(host="127.0.0.1", port=8000, timeout=20):
    start = time.time()
    while time.time() - start < timeout:
        try:
            with socket.create_connection((host, port), timeout=1):
                return True
        except OSError:
            time.sleep(0.5)
    return False


def run_server():
    uvicorn.run(
        "main:app",
        host="127.0.0.1",
        port=8000,
        reload=False,
        log_level="info",
    )


if __name__ == "__main__":
    threading.Thread(target=run_server, daemon=True).start()

    if not wait_for_server():
        raise RuntimeError("Server FastAPI gagal start di 127.0.0.1:8000")

    webview.create_window(
        "Invoice App",
        "http://127.0.0.1:8000",
        width=1400,
        height=900,
        resizable=True,
    )
    webview.start()