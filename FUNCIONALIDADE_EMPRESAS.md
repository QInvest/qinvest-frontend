# Funcionalidade de Empresas - QInvest

## Visão Geral

Foi implementado um sistema completo de gerenciamento de empresas que permite aos usuários cadastrar múltiplas empresas e selecioná-las ao fazer solicitações de crédito.

## Componentes Implementados

### 1. CompanyContext (`src/contexts/CompanyContext.tsx`)
- **Propósito**: Contexto React para gerenciar o estado global das empresas
- **Funcionalidades**:
  - Armazenar lista de empresas
  - Adicionar novas empresas
  - Atualizar empresas existentes
  - Deletar empresas
  - Buscar empresa por ID
- **Empresa padrão**: TechSolutions LTDA (para demonstração)

### 2. AddCompanyDialog (`src/components/company/AddCompanyDialog.tsx`)
- **Propósito**: Modal para cadastrar novas empresas
- **Campos obrigatórios**:
  - CNPJ
  - Nome da Empresa
  - Setor de Atuação
  - Faturamento Mensal
  - Endereço
  - Cidade
  - Estado
  - Telefone
  - CEP
  - Data de Fundação
  - Número de Funcionários
- **Campos opcionais**:
  - Ramo de Negócio
- **Funcionalidades**:
  - Validação de campos obrigatórios
  - Feedback visual durante submissão
  - Toast de confirmação
  - Callback para notificar empresa adicionada

### 3. Páginas Atualizadas

#### CreditRequest (`src/pages/CreditRequest.tsx`)
- **Mudanças**:
  - Adicionado seção de seleção de empresa
  - Integração com CompanyContext
  - Botão "Adicionar Empresa" ao lado do seletor
  - Exibição dos dados da empresa selecionada
  - Validação para garantir que uma empresa seja selecionada
  - Formulário de solicitação só aparece após seleção da empresa

#### MinhaEmpresa (`src/pages/MinhaEmpresa.tsx`)
- **Mudanças**:
  - Adicionado botão "Adicionar Empresa" no header
  - Integração com CompanyContext
  - Modal de nova solicitação agora inclui seleção de empresa
  - Botão "Adicionar Empresa" também no modal
  - Exibição dos dados da empresa selecionada no modal

### 4. App.tsx
- **Mudanças**:
  - Adicionado `CompanyProvider` envolvendo toda a aplicação
  - Mantém a estrutura de providers existente

## Fluxo de Uso

### 1. Adicionar Nova Empresa
1. Usuário clica em "Adicionar Empresa" (disponível em várias telas)
2. Modal abre com formulário completo
3. Usuário preenche os dados obrigatórios
4. Ao submeter, empresa é adicionada ao contexto
5. Empresa fica automaticamente selecionada (se aplicável)
6. Toast de confirmação é exibido

### 2. Solicitar Crédito
1. Usuário acessa "Solicitar Crédito" ou "Nova Solicitação"
2. Seleciona empresa existente no dropdown OU adiciona nova empresa
3. Dados da empresa selecionada são exibidos
4. Usuário preenche informações da solicitação (valor, prazo, finalidade)
5. Submete a solicitação

## Estrutura de Dados da Empresa

```typescript
interface Company {
  id: string;
  cnpj: string;
  companyName: string;
  sector: string;
  revenue: string;
  address: string;
  city: string;
  state: string;
  phone: string;
  zipcode: string;
  businessSector?: string;
  riskScore?: number;
  foundedDate: string;
  employeesCount: number;
}
```

## Benefícios da Implementação

1. **Flexibilidade**: Usuários podem ter múltiplas empresas
2. **Reutilização**: Empresas cadastradas podem ser usadas em múltiplas solicitações
3. **UX Melhorada**: Interface intuitiva com seleção e adição de empresas
4. **Validação**: Garantia de que uma empresa seja selecionada antes da solicitação
5. **Feedback**: Toasts e estados visuais para melhor experiência do usuário
6. **Escalabilidade**: Estrutura preparada para integração com backend

## Próximos Passos Sugeridos

1. **Integração com Backend**: Conectar com API para persistir empresas
2. **Validação de CNPJ**: Implementar validação real de CNPJ
3. **Upload de Documentos**: Permitir upload de documentos da empresa
4. **Histórico de Solicitações**: Mostrar histórico por empresa
5. **Edição de Empresas**: Permitir editar empresas existentes
6. **Busca e Filtros**: Implementar busca avançada de empresas

## Arquivos Modificados/Criados

### Novos Arquivos:
- `src/contexts/CompanyContext.tsx`
- `src/components/company/AddCompanyDialog.tsx`
- `FUNCIONALIDADE_EMPRESAS.md`

### Arquivos Modificados:
- `src/App.tsx` - Adicionado CompanyProvider
- `src/pages/CreditRequest.tsx` - Integração com sistema de empresas
- `src/pages/MinhaEmpresa.tsx` - Integração com sistema de empresas

## Como Testar

1. Acesse a página "Solicitar Crédito"
2. Clique em "Adicionar Empresa"
3. Preencha o formulário com dados de uma empresa
4. Submeta o formulário
5. Verifique se a empresa foi selecionada automaticamente
6. Complete a solicitação de crédito
7. Verifique se a empresa aparece nas outras páginas

A funcionalidade está completamente implementada e pronta para uso!
