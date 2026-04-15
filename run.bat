@echo off
cd /d C:\INVOICE\backend_invoice
C:\laragon\bin\python\python-3.10\python.exe -m uvicorn main:app --host 0.0.0.0 --port 8006
pause