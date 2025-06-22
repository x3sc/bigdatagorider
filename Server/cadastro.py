# Server/cadastro.py

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr, Field
import pymysql

from .security import hash_password
from .utils import get_db_connection, sanitize_string

router = APIRouter()

class Usuario(BaseModel):
    nome: str
    sobrenome: str
    email: EmailStr
    senha: str
    documento: str = Field(..., max_length=18)
    telefone: str
    data_nascimento: str = None # Opcional, pode ser nulo para prestadores
    tipo: int # 0 para Cliente, 1 para Prestador

@router.post("/cadastro", status_code=status.HTTP_201_CREATED)
def create_or_update_usuario(usuario: Usuario):
    """
    Endpoint unificado para registrar um novo usuário ou atualizar um existente.
    """
    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor(pymysql.cursors.DictCursor)

        # Sanitiza as entradas
        email = sanitize_string(str(usuario.email))
        documento = sanitize_string(usuario.documento)
        
        # 1. Verifica se o usuário já existe pelo email ou documento
        cursor.execute("SELECT * FROM Usuarios WHERE Email = %s OR Documento = %s", (email, documento))
        existing_user = cursor.fetchone()

        if existing_user:
            # Validação de consistência: se o email existe, o documento deve ser o mesmo, e vice-versa.
            if existing_user['Email'] == email and existing_user['Documento'] != documento:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="Este email já está associado a um documento diferente."
                )
            
            if existing_user['Documento'] == documento and existing_user['Email'] != email:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="Este documento já está associado a um email diferente."
                )

            # Se a verificação passar, significa que email e documento correspondem ao mesmo usuário.
            # Agora, atualizamos o tipo se necessário.
            user_id = existing_user['ID_Usuario']
            current_tipo = existing_user['Tipo']
            
            # Se o tipo de cadastro for diferente do atual, e não for 2, atualiza para 2 (ambos)
            if current_tipo != usuario.tipo and current_tipo != 2:
                new_tipo = 2
                cursor.execute("UPDATE Usuarios SET Tipo = %s WHERE ID_Usuario = %s", (new_tipo, user_id))
                conn.commit()
                return {"message": "Perfil de usuário atualizado para cliente e prestador."}
            else:
                # Se não houver mudança no tipo, apenas informa que já está cadastrado
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="Usuário com este email e documento já cadastrado."
                )
        else:
            # 2. Se não existe, cria um novo usuário
            senha_hashed = hash_password(usuario.senha)
            
            query = """
                INSERT INTO Usuarios (Nome, Sobrenome, Email, Senha, Documento, Telefone, DataNascimento, Tipo)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            """
            # Garante que data_nascimento seja None se não for fornecido
            data_nascimento = usuario.data_nascimento if usuario.data_nascimento else None

            cursor.execute(query, (
                sanitize_string(usuario.nome),
                sanitize_string(usuario.sobrenome),
                email,
                senha_hashed,
                documento,
                sanitize_string(usuario.telefone),
                data_nascimento,
                usuario.tipo
            ))
            conn.commit()
            return {"message": "Usuário cadastrado com sucesso!"}

    except pymysql.err.IntegrityError:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email ou Documento já cadastrado."
        )
    except Exception as e:
        print(f"Erro no servidor: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Ocorreu um erro ao tentar cadastrar o usuário."
        )
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()
