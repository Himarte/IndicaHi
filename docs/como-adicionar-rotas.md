# Como Adicionar Novas Rotas

## 🎯 Sistema Centralizado de Rotas

Agora todas as rotas estão centralizadas no arquivo `src/lib/uteis/routes.ts`. Isso facilita a manutenção e evita duplicação de código.

## ➕ Adicionando uma Nova Rota

### 1. **Rota Simples (apenas URL)**

```typescript
// src/lib/uteis/routes.ts
export const ROUTES = {
	// ... rotas existentes
	NOVA_FUNCIONALIDADE: '/nova-funcionalidade'
} as const;
```

### 2. **Rota com Navegação (aparecer no SideBar)**

```typescript
// 1. Primeiro adicione a rota
export const ROUTES = {
	// ... rotas existentes
	RELATORIOS: '/relatorios'
} as const;

// 2. Depois adicione ao array de navegação
export const NAV_ITEMS: NavItem[] = [
	// ... itens existentes
	{
		href: ROUTES.RELATORIOS,
		label: 'Relatórios',
		roles: ['Admin', 'Financeiro'], // Quem pode ver
		activePatterns: ['/relatorios'] // Quando destacar como ativo
	}
];
```

### 3. **Adicionando Ícone (SideBar)**

```typescript
// src/lib/components/layouts/SideBar.svelte
import { BarChart } from 'lucide-svelte'; // Import do novo ícone

const iconMap: Record<string, any> = {
	// ... ícones existentes
	'/relatorios': BarChart // ← Adicionar aqui
};
```

## 🚀 Exemplos Práticos

### Exemplo 1: Nova seção para Vendedores Externos

```typescript
// 1. Adicionar rota
export const ROUTES = {
	// ... existentes
	TREINAMENTOS: '/treinamentos'
} as const;

// 2. Adicionar à navegação
export const NAV_ITEMS: NavItem[] = [
	// ... existentes
	{
		href: ROUTES.TREINAMENTOS,
		label: 'Treinamentos',
		roles: ['Vendedor Externo'], // Só vendedores externos veem
		activePatterns: ['/treinamentos']
	}
];

// 3. Se deve aparecer bônus nesta rota
export const ROUTE_GROUPS = {
	BONUS_ROUTES: [
		// ... existentes
		ROUTES.TREINAMENTOS // ← Adicionar aqui
	]
	// ...
};
```

### Exemplo 2: Subseção de Configurações

```typescript
// 1. Adicionar rota
export const ROUTES = {
	// ... existentes
	CONFIGURACOES_NOTIFICACOES: '/configuracoes/notificacoes'
} as const;

// 2. Adicionar aos links do usuário
export const USER_CONFIG_LINKS = [
	// ... existentes
	{
		name: 'Notificações',
		href: ROUTES.CONFIGURACOES_NOTIFICACOES
	}
];
```

## ✅ Vantagens do Sistema Atual

### **Antes (Sistema Antigo)**

```typescript
// ❌ Rotas espalhadas em vários arquivos
// SideBar.svelte
const navItems = [
  { href: '/dashboard', label: 'Dashboard' }, // ← Hardcoded
];

// SideBarUser.svelte
const links = [
  { href: '/configuracoes' }, // ← Hardcoded
];

// CodigoIndicacao.svelte
<a href="/configuracoes"> // ← Hardcoded

// Para adicionar nova rota = editar 3+ arquivos
```

### **Depois (Sistema Atual)**

```typescript
// ✅ Rotas centralizadas em um arquivo
// routes.ts
export const ROUTES = {
	CONFIGURACOES: '/configuracoes' // ← Single source of truth
};

// Todos os componentes importam daqui
import { ROUTES } from '$lib/uteis/routes';

// Para adicionar nova rota = editar 1 arquivo
```

## 🔧 Helpers Disponíveis

### Verificação de Rotas

```typescript
import { routeHelpers } from '$lib/uteis/routes';

// Verificar se é rota de dashboard
const isDash = routeHelpers.isDashboardRoute('/dashboard/recompensa'); // true

// Verificar se deve mostrar bônus
const showBonus = routeHelpers.shouldShowBonus('/financeiro'); // true

// Verificar se rota está ativa
const isActive = routeHelpers.isActiveRoute('/dashboard', '/dashboard', ['/dashboard$']); // true

// Filtrar navegação por role
const userNavs = routeHelpers.filterNavItemsByRole(NAV_ITEMS, 'Admin');
```

### Validação de Usuário

```typescript
import { needsFirstLogin, isExternalSellerWithPromo } from '$lib/uteis/userValidation';

// Verificar se precisa primeiro login
const needsLogin = needsFirstLogin(userData);

// Verificar se é vendedor externo com promo
const showElements = isExternalSellerWithPromo(userData);
```

## 📈 Benefícios

- ✅ **Manutenção**: 1 arquivo para adicionar/alterar rotas
- ✅ **Consistência**: Todas as rotas seguem o mesmo padrão
- ✅ **Autocompletar**: TypeScript oferece sugestões
- ✅ **Refatoração**: Mudar uma rota atualiza todos os lugares
- ✅ **Testabilidade**: Funções puras e isoladas
