from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from clientes import router as clientes_router
from login import router as login_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # ou ["*"] para testes
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(clientes_router)
app.include_router(login_router)