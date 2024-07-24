export type userDataFromLayout = {
	id: string;
	name: string;
	avatarUrl: string;
	email: string;
	job: string;
	cpf: string;
	telefone: string;
	promoCode: string;
	pixType: string;
	pixCode: string;
	cep: string;
	rua: string;
	numeroCasa: number;
	complemento: string;
	bairro: string;
	cidade: string;
	estado: string;
	status: boolean;
};

export type LeadsPendenteFinanceiro = {
	id: string;
	fullName: string;
	cpfCnpj: string;
	telefone: string;
	email: string;
	pixType: string;
	pixKey: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	dataAtendido: any;
	dataCriado: string;
	status: 'Pendente' | 'Sendo Atendido' | 'Finalizado' | 'Pago' | 'Sem Sucesso';
};

export type LeadsPendentesVendedorInterno = {
	id: string;
	status: 'Pendente' | 'Sendo Atendido' | 'Finalizado' | 'Pago' | 'Sem Sucesso';
	fullName: string;
	cpfCnpj: string;
	telefone: string;
	email: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	dataAtendido: any;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	dataCriado: any;
};
