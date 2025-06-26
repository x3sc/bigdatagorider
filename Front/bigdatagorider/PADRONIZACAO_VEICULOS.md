# Padronização de Tipos de Veículos - GoRide

## 📋 Tipos de Veículos Padronizados

Este documento descreve os tipos de veículos padronizados em toda a plataforma GoRide.

### 🚗 Tipos Disponíveis

Os tipos de veículos padronizados são definidos em `src/constants/vehicleTypes.js`:

1. **Carro** - Para transporte de pessoas ou pequenas cargas
2. **Moto** - Para entregas rápidas e pequenas
3. **Van** - Para cargas médias e mudanças pequenas
4. **Van Refrigerada** - Para transporte de produtos perecíveis
5. **Caminhão** - Para cargas pesadas e mudanças grandes
6. **Caminhão Baú** - Para cargas protegidas e mudanças comerciais
7. **Caminhão Graneleiro** - Para transporte de grãos e materiais a granel
8. **Caminhão Frigorífico** - Para cargas refrigeradas em grande volume

### 📁 Arquivos Atualizados

#### Cliente
- ✅ `src/app/Cliente/CriarServico/page.js` - Usa TIPOS_VEICULO
- ✅ `src/app/Cliente/Dashboard/page.js` - Dashboard limpo
- ✅ `src/app/Cliente/Assinatura/page.js` - Página de assinatura padronizada

#### Prestador
- ✅ `src/app/Prestador/CadastrarVeiculos/page.js` - Usa TIPOS_VEICULO
- ✅ `src/app/Prestador/ServicosPublicados/page.js` - Usa TIPOS_VEICULO
- ✅ `src/app/Prestador/Dashboard/page.js` - Dados simulados atualizados
- ✅ `src/app/Prestador/Dashboard/page_fixed.js` - Dados simulados atualizados
- ✅ `src/app/Prestador/DashboardIntegrado/page.js` - Dados simulados atualizados

#### Componentes
- ✅ `src/components/header.js` - Menu simplificado
- ✅ `src/components/SecondaryNavigation.js` - Navegação atualizada

### 🗑️ Páginas Removidas

#### Cliente (Menu Simplificado)
- ❌ `src/app/Cliente/Propostas/` - Removida
- ❌ `src/app/Cliente/Historico/` - Removida  
- ❌ `src/app/Cliente/Avaliacoes/` - Removida
- ❌ `src/app/Cliente/Perfil/` - Removida

### 🎯 Menu Final do Cliente

1. **Início** - Dashboard principal
2. **Criar Novo Serviço** - Criação de solicitações
3. **Meus Serviços** - Visualização de serviços em andamento
4. **Assinatura** - Planos e benefícios
5. **Sobre Nós** - Informações da empresa

### 🔧 Como Usar

```javascript
// Importar os tipos padronizados
import { TIPOS_VEICULO, getTipoVeiculoLabel, getTipoVeiculoKey } from '@/constants/vehicleTypes';

// Usar em selects
{TIPOS_VEICULO.map((tipo) => (
    <SelectItem key={tipo.key} value={tipo.key}>
        {tipo.label}
    </SelectItem>
))}

// Obter label a partir da key
const label = getTipoVeiculoLabel('Carro'); // retorna "Carro"

// Obter key a partir do label
const key = getTipoVeiculoKey('Carro'); // retorna "Carro"
```

### ⚠️ Importante

- **Sempre usar** `TIPOS_VEICULO` ao invés de hardcoded strings
- **Não criar** novos tipos de veículos sem atualizar o arquivo de constantes
- **Verificar** se novos dados simulados usam os tipos padronizados

### 🧪 Testes Realizados

- ✅ Lint sem erros críticos
- ✅ Compilação sem erros
- ✅ Navegação funcionando
- ✅ Selects com opções corretas
- ✅ Visual moderno mantido

### 📈 Próximos Passos

1. Integração real com backend
2. Testes de experiência do usuário
3. Validação de dados em formulários
4. Otimização de performance
