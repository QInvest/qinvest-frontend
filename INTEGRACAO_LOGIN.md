# Integração de Login - Frontend com Backend

## Configuração do Ambiente

### 1. Variáveis de Ambiente do Frontend

Crie um arquivo `.env.local` na pasta `qinvest-frontend` com o seguinte conteúdo:

```env
# API Configuration
VITE_API_URL=http://localhost:8080

# Environment
VITE_ENVIRONMENT=development
```

### 2. Variáveis de Ambiente do Backend

Certifique-se de que o arquivo `.env` na pasta `qinvest-backend` contém:

```env
# Supabase Configuration
SUPABASE_URI=sua_supabase_url
SUPABASE_KEY=sua_supabase_anon_key
SECRET_KEY=sua_secret_key

# Database
DATABASE_URL=sua_database_url
```

## Funcionalidades Implementadas

### Frontend

1. **Serviço de API** (`src/services/api.ts`)
   - Comunicação com o backend
   - Gerenciamento de tokens
   - Métodos de login, registro e verificação de usuário

2. **Contexto de Autenticação** (`src/contexts/AuthContext.tsx`)
   - Estado global de autenticação
   - Funções de login, logout e registro
   - Verificação automática de autenticação

3. **Proteção de Rotas** (`src/components/auth/ProtectedRoute.tsx`)
   - Componente para proteger rotas que requerem autenticação
   - Redirecionamento automático para login

4. **Componente Login Atualizado** (`src/pages/Login.tsx`)
   - Integração com API real
   - Tratamento de erros
   - Estados de loading
   - Redirecionamento inteligente

### Backend

1. **Correções na API de Autenticação**
   - Endpoint `/api/auth/login` aceita JSON
   - Endpoint `/api/auth/register` para registro
   - Endpoint `/api/auth/me` para verificar usuário atual

## Como Testar

### 1. Iniciar o Backend

```bash
cd qinvest-backend
python -m uvicorn main:app --host 0.0.0.0 --port 8080 --reload
```

### 2. Iniciar o Frontend

```bash
cd qinvest-frontend
npm run dev
```

### 3. Testar o Login

1. Acesse `http://localhost:5173/login`
2. Use credenciais válidas do Supabase
3. Verifique se o redirecionamento funciona
4. Teste acessar rotas protegidas sem login

## Endpoints da API

- `POST /api/auth/login` - Login do usuário
- `POST /api/auth/register` - Registro de novo usuário
- `GET /api/auth/me` - Obter dados do usuário atual

## Próximos Passos

1. Implementar registro de usuário no frontend
2. Adicionar funcionalidade de logout
3. Implementar recuperação de senha
4. Adicionar validação de formulários
5. Implementar refresh de tokens
