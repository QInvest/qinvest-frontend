# Qinvest - Plataforma de Investimentos P2P

Uma plataforma moderna de investimentos peer-to-peer que conecta empresas que precisam de crédito com investidores que buscam rentabilidade.

Deploy frontend:
https://qinvest-frontend.vercel.app/

## 🚀 Tecnologias

- **React** - Biblioteca para interfaces de usuário
- **TypeScript** - Superset tipado do JavaScript
- **Tailwind CSS** - Framework CSS utilitário
- **shadcn/ui** - Componentes de interface modernos
- **React Router** - Roteamento declarativo
- **Lucide React** - Ícones SVG otimizados

## 🛠️ Desenvolvimento

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn

### Instalação
```bash
npm install
```

### Executar em desenvolvimento
```bash
npm run dev
```

### Build para produção
```bash
npm run build
```

### Lint e formatação
```bash
npm run lint
npm run format
```

## 📁 Estrutura do Projeto

```
📁 qinvest-frontend/
├── 📁 src/
│   ├── 📁 components/         # Componentes reutilizáveis
│   │   ├── 📁 auth/          # 🔐 Autenticação e login
│   │   ├── 📁 company/       # 🏢 Gestão de empresas
│   │   ├── 📁 investment/    # 📈 Investimentos e oportunidades
│   │   ├── 📁 layout/        # 🎨 Layout e navegação
│   │   └── 📁 ui/            # 🧩 Componentes base (shadcn/ui)
│   ├── 📁 contexts/          # 🔄 Context API (Auth, Company)
│   ├── 📁 data/              # 📊 Dados mockados e constantes
│   ├── 📁 hooks/             # 🪝 Custom hooks React
│   ├── 📁 lib/               # 🛠️ Utilitários e configurações
│   ├── 📁 pages/             # 📄 Páginas da aplicação
│   │   ├── 📁 auth/          # 🔑 Login, registro, etc.
│   │   └── 📁 ...            # Dashboard, oportunidades, etc.
│   └── 📁 services/          # 🌐 Cliente API e integrações
├── 📄 package.json           # 📦 Dependências
├── 📄 vite.config.ts         # ⚙️ Configuração Vite
└── 📄 tailwind.config.ts     # 🎨 Configuração Tailwind
```

## 🎯 Funcionalidades

- **Dashboard** - Visão geral dos investimentos
- **Oportunidades** - Catálogo de investimentos disponíveis
- **Meus Investimentos** - Acompanhamento de investimentos ativos
- **Carteira Virtual** - Gestão de saldo e transações
- **Minha Empresa** - Solicitações de crédito
- **Configurações** - Preferências do usuário

## 🎨 Design System

O projeto utiliza um design system consistente baseado em:
- **Cores**: Paleta personalizada com suporte a tema claro/escuro
- **Tipografia**: Inter como fonte principal
- **Componentes**: Biblioteca shadcn/ui customizada
- **Layout**: Grid responsivo com breakpoints otimizados

## 📱 Responsividade

A aplicação é totalmente responsiva, funcionando perfeitamente em:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (até 767px)

## 🔧 Configuração

### Variáveis de Ambiente
Crie um arquivo `.env.local` na raiz do projeto:
```env
VITE_API_URL=http://localhost:3000
```

### Personalização
- **Cores**: Edite `tailwind.config.ts`
- **Componentes**: Modifique em `src/components/ui/`
- **Dados**: Atualize em `src/data/mockData.ts`

## 📄 Licença

Este projeto é propriedade da Qinvest. Todos os direitos reservados.