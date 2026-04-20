import os
import httpx
from functools import wraps
from fastapi import HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

PILARGROUP_API_URL = os.getenv("PILARGROUP_API_URL", "https://pilargroup.id/api")
BILLFORGE_PROJECT_ID = os.getenv("BILLFORGE_PROJECT_ID", "")

security = HTTPBearer()


async def verify_token(
    credentials: HTTPAuthorizationCredentials = Security(security),
):
    """
    Verifikasi JWT token ke pilargroup.id via GET /api/auth/me
    Return user dict kalau valid, raise 401 kalau tidak.
    """
    token = credentials.credentials

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(
                f"{PILARGROUP_API_URL}/auth/me",
                headers={"Authorization": f"Bearer {token}"},
            )
    except httpx.RequestError as e:
        raise HTTPException(
            status_code=503,
            detail=f"Tidak bisa menghubungi auth server: {str(e)}",
        )

    if response.status_code == 401:
        raise HTTPException(status_code=401, detail="Token tidak valid atau sudah expired.")

    if response.status_code != 200:
        raise HTTPException(
            status_code=401,
            detail=f"Auth server menolak token (status {response.status_code}).",
        )

    try:
        user_data = response.json()
    except Exception:
        raise HTTPException(status_code=500, detail="Response auth server tidak valid.")

    # Kalau BILLFORGE_PROJECT_ID diset, cek apakah user punya akses ke project ini
    if BILLFORGE_PROJECT_ID:
        projects = user_data.get("projects", [])
        project_ids = [str(p.get("id") or p.get("project_id", "")) for p in projects]
        if BILLFORGE_PROJECT_ID not in project_ids:
            raise HTTPException(
                status_code=403,
                detail="Akun kamu tidak punya akses ke BillForge.",
            )

    return user_data