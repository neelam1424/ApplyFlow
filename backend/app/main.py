from fastapi import FastAPI

from app.api.routes.auth import router as auth_router
from app.api.routes.applications import router as applications_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



app.include_router(auth_router)
app.include_router(applications_router)

@app.get("/health")
def health_check():
    return {"status" : "ok"}