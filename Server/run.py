# Server/run.py
import uvicorn
import traceback

if __name__ == "__main__":
    """
    Este script é uma forma alternativa de iniciar o servidor Uvicorn.
    Ele pode ajudar a capturar erros de inicialização que não aparecem
    quando se usa o comando direto no terminal.
    """
    print("Tentando iniciar o servidor Uvicorn a partir do script 'run.py'...")
    try:
        # Tenta executar o servidor.
        # host="127.0.0.1" é o mesmo que localhost.
        # log_level="info" nos dará mais detalhes no console.
        uvicorn.run(
            "main:app",
            host="127.0.0.1",
            port=8000,
            reload=True,
            log_level="info"
        )
    except Exception as e:
        # Se qualquer erro acontecer durante a inicialização do uvicorn,
        # ele deverá ser capturado e exibido aqui.
        print("\n" + "="*50)
        print("--- ERRO CRÍTICO CAPTURADO PELO 'run.py' ---")
        print(f"Ocorreu um erro ao tentar carregar a aplicação FastAPI:")
        # Imprime o traceback completo do erro para análise
        traceback.print_exc()
        print("="*50 + "\n")

