// Constantes de rotas para facilitar manutenção
export const ROUTES = {
	// Rotas principais
	HOME: '/',
	DASHBOARD: '/dashboard',
	INTERNO: '/interno',
	FINANCEIRO: '/financeiro',
	ADMIN: '/admin',
	CONFIGURACOES: '/configuracoes',
	SUPORTE: '/suporte',
	LOGIN: '/login',
	LOGOUT: '/logout',

	// Subrotas específicas
	DASHBOARD_RECOMPENSA: '/dashboard/recompensa',
	CONFIGURACOES_PRIVACIDADE: '/configuracoes/privacidade',
	FINANCEIRO_PAGAMENTOS: '/financeiro/pagamentos',
	ADMIN_USERS: '/admin/users',
	ADMIN_LEADS: '/admin/leads'
} as const;

// Grupos de rotas para facilitar verificações
export const ROUTE_GROUPS = {
	// Rotas onde elementos do vendedor externo devem aparecer
	DASHBOARD_ROUTES: [
		ROUTES.DASHBOARD,
		ROUTES.INTERNO,
		ROUTES.FINANCEIRO,
		ROUTES.ADMIN,
		ROUTES.SUPORTE
	],

	// Rotas onde o bonus deve aparecer (exclui recompensa)
	BONUS_ROUTES: [ROUTES.DASHBOARD, ROUTES.INTERNO, ROUTES.FINANCEIRO, ROUTES.ADMIN],

	// Rotas de configurações
	CONFIG_ROUTES: [ROUTES.CONFIGURACOES, ROUTES.CONFIGURACOES_PRIVACIDADE]
} as const;

// Tipos para navegação
export interface NavItem {
	href: string;
	icon?: any;
	label: string;
	roles: string[];
	activePatterns: string[];
}

// Configuração de navegação principal
export const NAV_ITEMS: NavItem[] = [
	{
		href: ROUTES.DASHBOARD,
		label: 'Dashboard',
		roles: ['Vendedor Externo'],
		activePatterns: ['/dashboard$']
	},
	{
		href: ROUTES.DASHBOARD_RECOMPENSA,
		label: 'Recompensas',
		roles: ['Vendedor Externo'],
		activePatterns: ['/dashboard/recompensa']
	},
	{
		href: ROUTES.FINANCEIRO,
		label: 'Financeiro',
		roles: ['Financeiro'],
		activePatterns: ['/financeiro$']
	},
	{
		href: ROUTES.FINANCEIRO_PAGAMENTOS,
		label: 'Pagamentos',
		roles: ['Financeiro'],
		activePatterns: ['/financeiro/pagamentos']
	},
	{
		href: ROUTES.INTERNO,
		label: 'Estoque',
		roles: ['Vendedor Interno'],
		activePatterns: ['/interno']
	},
	{
		href: ROUTES.ADMIN_USERS,
		label: 'Lista de Users',
		roles: ['Admin'],
		activePatterns: ['/admin/users']
	},
	{
		href: ROUTES.ADMIN_LEADS,
		label: 'Lista de Leads',
		roles: ['Admin'],
		activePatterns: ['/admin/leads']
	}
];

// Configuração de itens de configuração
export const CONFIG_ITEMS: NavItem[] = [
	{
		href: ROUTES.CONFIGURACOES,
		label: 'Configurações',
		roles: ['Vendedor Externo', 'Vendedor Interno', 'Financeiro', 'Admin'],
		activePatterns: ['/configuracoes', '/configuracoes/privacidade']
	},
	{
		href: ROUTES.SUPORTE,
		label: 'Suporte',
		roles: ['Vendedor Externo', 'Vendedor Interno', 'Financeiro', 'Admin'],
		activePatterns: ['/suporte']
	}
];

// Links para SideBarUser
export const USER_CONFIG_LINKS = [
	{
		name: 'Perfil',
		href: ROUTES.CONFIGURACOES
	},
	{
		name: 'Privacidade',
		href: ROUTES.CONFIGURACOES_PRIVACIDADE
	}
];

// Funções helper para verificação de rotas
export const routeHelpers = {
	/**
	 * Verifica se o caminho atual está em um grupo de rotas
	 */
	isInRouteGroup: (currentPath: string, routeGroup: readonly string[]): boolean => {
		return routeGroup.some((route) => currentPath.startsWith(route));
	},

	/**
	 * Verifica se é uma rota de dashboard
	 */
	isDashboardRoute: (currentPath: string): boolean => {
		return routeHelpers.isInRouteGroup(currentPath, ROUTE_GROUPS.DASHBOARD_ROUTES);
	},

	/**
	 * Verifica se é uma rota onde bonus deve aparecer
	 */
	shouldShowBonus: (currentPath: string): boolean => {
		return routeHelpers.isInRouteGroup(currentPath, ROUTE_GROUPS.BONUS_ROUTES);
	},

	/**
	 * Verifica se é uma rota de configurações
	 */
	isConfigRoute: (currentPath: string): boolean => {
		return routeHelpers.isInRouteGroup(currentPath, ROUTE_GROUPS.CONFIG_ROUTES);
	},

	/**
	 * Verifica se uma rota está ativa baseado nos padrões
	 */
	isActiveRoute: (currentPath: string, href: string, activePatterns: string[]): boolean => {
		return activePatterns.some((pattern) => {
			if (pattern.endsWith('$')) {
				return currentPath === pattern.slice(0, -1);
			}
			return currentPath.startsWith(pattern);
		});
	},

	/**
	 * Filtra itens de navegação por role do usuário
	 */
	filterNavItemsByRole: (items: NavItem[], userRole: string): NavItem[] => {
		return items.filter((item) => item.roles.includes(userRole));
	}
};
