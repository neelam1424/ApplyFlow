from fastapi import FastAPI

from app.api.routes.auth import router as auth_router
from app.api.routes.applications import router as applications_router

app = FastAPI()

app.include_router(auth_router)
app.include_router(applications_router)

@app.get("/health")
def health_check():
    return {"status" : "ok"}