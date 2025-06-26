import pytest
from selenium import webdriver
from selenium.webdriver.chrome.service import Service as ChromeService
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import chromedriver_autoinstaller
import time

# Instala e configura o chromedriver automaticamente
chromedriver_path = chromedriver_autoinstaller.install()

@pytest.fixture(scope="module")
def driver():
    # Configuração do WebDriver usando Service
    service = ChromeService(executable_path=chromedriver_path)
    options = webdriver.ChromeOptions()
    # options.add_argument('--headless')  # Executar em modo headless (sem abrir janela do navegador)
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    options.add_experimental_option("excludeSwitches", ["enable-automation"])
    options.add_experimental_option('useAutomationExtension', False)
    driver = webdriver.Chrome(service=service, options=options)
    driver.implicitly_wait(10)
    yield driver
    # Fechar o driver após os testes
    driver.quit()

def test_login_cliente(driver):
    """Testa o login do cliente e a navegação inicial."""
    driver.get("http://localhost:3001/Cliente/Login")
    
    # Tenta encontrar o campo de e-mail, se falhar, a página pode não ter carregado
    try:
        email_input = WebDriverWait(driver, 20).until(
            EC.presence_of_element_located((By.ID, "email"))
        )
        email_input.send_keys("cliente@teste.com")
    except Exception as e:
        pytest.fail(f"Não foi possível encontrar o campo de email em /Cliente/Login. A página carregou corretamente? Erro: {e}")

    driver.find_element(By.ID, "password").send_keys("senha123")
    driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()
    
    # Aguardar o dashboard do cliente carregar
    try:
        WebDriverWait(driver, 20).until(EC.url_contains("/Cliente/Dashboard"))
    except Exception as e:
        pytest.fail(f"O login do cliente falhou ou o redirecionamento para o dashboard demorou demais. Erro: {e}")

    assert "/Cliente/Dashboard" in driver.current_url
    print("\nSUCESSO: Login do Cliente.")

def test_criar_e_cancelar_servico_cliente(driver):
    """Testa a criação e o cancelamento de um serviço pelo cliente."""
    # Navegar para o dashboard se não estiver lá
    if "/Cliente/Dashboard" not in driver.current_url:
        driver.get("http://localhost:3001/Cliente/Dashboard")
        WebDriverWait(driver, 10).until(EC.url_contains("/Cliente/Dashboard"))

    # 2. Criar Novo Serviço
    try:
        criar_servico_btn = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//button[contains(., 'Criar Novo Serviço')]"))
        )
        criar_servico_btn.click()
    except Exception as e:
        pytest.fail(f"Botão 'Criar Novo Serviço' não encontrado ou não clicável. Erro: {e}")

    servico_nome = f"Teste Automatizado {int(time.time())}"
    WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.ID, "nome"))).send_keys(servico_nome)
    driver.find_element(By.ID, "descricao").send_keys("Descrição detalhada do serviço de teste.")
    driver.find_element(By.ID, "origem").send_keys("Ponto A")
    driver.find_element(By.ID, "destino").send_keys("Ponto B")
    driver.find_element(By.ID, "valor").send_keys("500")
    driver.find_element(By.ID, "tipo_veiculo_requerido").send_keys("Caminhão Baú")
    driver.find_element(By.ID, "data_servico").send_keys("31122025")
    driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()

    # Aguardar o retorno para o dashboard e a confirmação
    WebDriverWait(driver, 10).until(EC.url_contains("/Cliente/Dashboard"))
    print(f"SUCESSO: Serviço '{servico_nome}' criado.")
    time.sleep(3) 

    # 3. Cancelar o Serviço recém-criado
    servicos_abertos = driver.find_elements(By.XPATH, f"//td[contains(., '{servico_nome}')]/parent::tr")
    assert len(servicos_abertos) > 0, f"O serviço '{servico_nome}' não foi encontrado na lista de abertos."
    
    primeiro_servico = servicos_abertos[0]
    cancelar_btn = primeiro_servico.find_element(By.XPATH, ".//button[contains(., 'Cancelar')]")
    driver.execute_script("arguments[0].click();", cancelar_btn) # Usar JS para evitar problemas de clique
    
    try:
        WebDriverWait(driver, 3).until(EC.alert_is_present()).accept()
    except Exception:
        print("Nenhum alerta de confirmação encontrado para cancelar.")

    # Verificar se o serviço foi para a aba de cancelados
    driver.find_element(By.XPATH, "//div[contains(text(), 'Cancelados')]").click()
    time.sleep(2)
    
    servicos_cancelados = driver.find_elements(By.XPATH, f"//td[contains(., '{servico_nome}')]")
    assert len(servicos_cancelados) > 0, "O serviço não apareceu na aba de cancelados."
    print(f"SUCESSO: Serviço '{servico_nome}' cancelado.")

