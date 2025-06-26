from selenium import webdriver
from selenium.webdriver.chrome.service import Service as ChromeService
from webdriver_manager.chrome import ChromeDriverManager

print("Iniciando teste simples do Selenium com webdriver-manager...")

try:
    # Instala e configura o chromedriver automaticamente
    print("Inicializando o WebDriver com webdriver-manager...")
    service = ChromeService(ChromeDriverManager().install())
    options = webdriver.ChromeOptions()
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    options.add_argument('--headless') # Roda sem abrir a janela do navegador

    driver = webdriver.Chrome(service=service, options=options)
    print("WebDriver inicializado com sucesso.")

    # Acessa uma página simples
    print("Acessando o google.com...")
    driver.get("https://www.google.com")
    print(f"Título da página: {driver.title}")
    print("SUCESSO: O teste simples do Selenium foi concluído.")

    driver.quit()

except Exception as e:
    print(f"ERRO: Ocorreu um erro durante o teste simples do Selenium: {e}")
