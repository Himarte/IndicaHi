interface Vendedor {
	id: string;
	nome: string;
	email: string;
	telefone: string | null;
	pixType: 'cpf' | 'cnpj' | 'email' | 'telefone' | null;
	pixCode: string | null;
}

export interface LeadFinanceiro {
	id: string;
	fullName: string;
	cpf: string | null;
	cnpj: string | null;
	status: 'Aguardando Pagamento' | 'Pago';
	promoCode: string;
	telefone: string;
	planoNome: string;
	planoModelo: 'CPF' | 'CNPJ';
	planoMegas: number;
	aguardandoPagamentoEm: string | null;
	pagoEm: string | null;
	atendidoEm: string | null;
	criadoEm: string | null;
	vendedor: Vendedor | null;
}
