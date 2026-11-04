from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

from app.core.startup import application_lifespan as startupp
from app.api.router import api_router
# ---- Startup to ----------------------------------------------
app = FastAPI(title="VR Evaluation Tool",lifespan=startupp)
# ---- Api acess allowance -------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# --- API ------------------------------------------------------
app.include_router(api_router, prefix="/api")
# --- Static frontend ------------------------------------------
app.mount("/", StaticFiles(directory="frontend", html=True), name="frontend")


# useless for now
# --- Landing Page ---------------------------------------------
# @app.get("/")
# def index():
#     return FileResponse("frontend/index.html")
