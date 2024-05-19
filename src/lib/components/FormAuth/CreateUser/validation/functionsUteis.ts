export const focarConfirmPasswordErrada = () => {
	const passwordElement = document.getElementById('confirmPassword');
	if (passwordElement) {
		passwordElement.focus();
	}
};

// Valida CPF para paenas numeros e coloca a Mascara
export function validationCpf(v: string): string {
	v = v.replace(/\D/g, ''); //Remove tudo o que não é dígito
	v = v.replace(/(\d{3})(\d)/, '$1.$2'); //Coloca um ponto entre o terceiro e o quarto dígitos
	v = v.replace(/(\d{3})(\d)/, '$1.$2'); //Coloca um ponto entre o terceiro e o quarto dígitos
	//de novo (para o segundo bloco de números)
	v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2'); //Coloca um hífen entre o terceiro e o quarto dígitos
	return v;
}
//  Valida Celular para paenas numeros e coloca a Mascara
export function validationCelular(v: string): string {
	v = v.replace(/\D/g, ''); //Remove tudo o que não é dígito
	v = v.replace(/^(\d{2})(\d)/g, '($1) $2'); //Coloca parênteses em volta dos dois primeiros dígitos
	v = v.replace(/(\d)(\d{4})$/, '$1-$2'); //Coloca hífen antes dos últimos 4 dígitos
	return v;
}
