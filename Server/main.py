# Server/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Importando as rotas (routers) dos outros arquivos
from .auth import router as auth_router
from .cadastro_cliente import router as cadastro_cliente_router
from .cadastro_prestador import router as cadastro_prestador_router
from .clientes import router as clientes_router
from .usuarios import router as usuarios_router
from .servicos import router as servicos_router

# Cria a instância principal da aplicação FastAPI
app = FastAPI()

# Configuração do CORS (Cross-Origin Resource Sharing)
# Isso permite que o seu frontend (rodando em http://localhost:3000)
# se comunique com o backend.
origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Permite todos os métodos (GET, POST, PUT, etc.)
    allow_headers=["*"],  # Permite todos os cabeçalhos
)

# Inclusão dos routers na aplicação principal
# Cada router adiciona os endpoints definidos no seu respectivo arquivo.
app.include_router(auth_router, prefix="/api", tags=["Autenticação"])
app.include_router(cadastro_cliente_router, prefix="/api", tags=["CadastroCliente"])
app.include_router(cadastro_prestador_router, prefix="/api", tags=["CadastroPrestador"])
app.include_router(clientes_router, prefix="/api", tags=["Clientes"])
app.include_router(usuarios_router, prefix="/api", tags=["Usuários"])
app.include_router(servicos_router, prefix="/api", tags=["Serviços"])


@app.get("/")
def read_root():
    """
    Endpoint raiz para verificar se a API está funcionando.
    """
    return {"message": "Bem-vindo à API GoRide"}

