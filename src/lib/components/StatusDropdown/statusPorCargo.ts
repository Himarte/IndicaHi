import {
	Clock,
	UserCheck,
	CheckCircle,
	CreditCard,
	XCircle,
	DollarSign
} from '@lucide/svelte';

type StatusOption = {
	value: string;
	label: string;
	icon: typeof Clock;
};

export const STATUS_POR_CARGO: Record<string, StatusOption[]> = {
	'Vendedor Interno': [
		{ value: 'Pendente', label: 'Pendente', icon: Clock },
		{ value: 'Sendo Atendido', label: 'Sendo Atendido', icon: UserCheck },
		{ value: 'Finalizado', label: 'Finalizado', icon: CheckCircle },
		{ value: 'Aguardando Pagamento', label: 'Aguardando Pagamento', icon: CreditCard },
		{ value: 'Cancelado', label: 'Cancelado', icon: XCircle }
	],
	Financeiro: [
		{ value: 'Aguardando Pagamento', label: 'Aguardando Pagamento', icon: CreditCard },
		{ value: 'Pago', label: 'Pago', icon: DollarSign },
		{ value: 'Cancelado', label: 'Cancelado', icon: XCircle }
	],
	Admin: [
		{ value: 'Pendente', label: 'Pendente', icon: Clock },
		{ value: 'Sendo Atendido', label: 'Sendo Atendido', icon: UserCheck },
		{ value: 'Finalizado', label: 'Finalizado', icon: CheckCircle },
		{ value: 'Aguardando Pagamento', label: 'Aguardando Pagamento', icon: CreditCard },
		{ value: 'Pago', label: 'Pago', icon: DollarSign },
		{ value: 'Cancelado', label: 'Cancelado', icon: XCircle }
	]
};

export const getStatusPorCargo = (cargo: string): StatusOption[] => {
	return STATUS_POR_CARGO[cargo] || [];
};
