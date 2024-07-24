export function maskCPF(value: string): string {
	return value
		.replace(/\D/g, '')
		.replace(/(\d{3})(\d)/, '$1.$2')
		.replace(/(\d{3})(\d)/, '$1.$2')
		.replace(/(\d{3})(\d{1,2})$/, '$1-$2')
		.slice(0, 14);
}

export function maskCellPhone(value: string): string {
	return value
		.replace(/\D/g, '')
		.replace(/(\d{2})(\d)/, '($1) $2')
		.replace(/(\d{5})(\d)/, '$1-$2')
		.slice(0, 15);
}

export function maskCNPJ(value: string): string {
	return value
		.replace(/\D/g, '')
		.replace(/(\d{2})(\d)/, '$1.$2')
		.replace(/(\d{3})(\d)/, '$1.$2')
		.replace(/(\d{3})(\d)/, '$1/$2')
		.replace(/(\d{4})(\d{1,2})$/, '$1-$2')
		.slice(0, 18);
}

export function applyMask(value: string, maskType: string): string {
	switch (maskType) {
		case 'cpf':
			return maskCPF(value);
		case 'celular':
			return maskCellPhone(value);
		case 'cnpj':
			return maskCNPJ(value);
		default:
			return value;
	}
}

// Limpar CPF
export function cleanCPF(value: string): string {
	return value.replace(/\D/g, '');
}

// Limpar Celular
export function cleanCellPhone(value: string): string {
	return value.replace(/\D/g, '');
}

// Limpar CNPJ
export function cleanCNPJ(value: string): string {
	return value.replace(/\D/g, '');
}

// Formatar Data DD/MM/YYYY - HH:MM:SS
export function formatarData(dateString: string): string {
	const date = new Date(dateString);
	const day = String(date.getDate()).padStart(2, '0');
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const year = date.getFullYear();
	const hours = String(date.getHours()).padStart(2, '0');
	const minutes = String(date.getMinutes()).padStart(2, '0');
	const seconds = String(date.getSeconds()).padStart(2, '0');
	return `${day}/${month}/${year} - ${hours}:${minutes}:${seconds}`;
}
