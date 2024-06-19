import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const formData = await request.formData();
		const cpf = formData.get('cpf');
		const celular = formData.get('celular');
		const pixType = formData.get('pixType');
		const pixKey = formData.get('pixKey');
		const promoCode = formData.get('promoCode');
		console.log('Dados recebidos:', { cpf, celular, pixType, pixKey, promoCode });

		// Validação básica dos dados recebidos
		if (!cpf || !celular || !pixType || !pixKey || !promoCode) {
			return new Response(JSON.stringify({ message: 'Todos os campos são obrigatórios.' }), {
				status: 400
			});
		}

		// Aqui você pode adicionar lógica para salvar os dados no banco de dados
		// Exemplo:
		// const result = await saveUserData({ cpf, celular, pixType, pixKey, promoCode });

		// Supondo que a operação foi bem-sucedida
		return new Response(JSON.stringify({ message: 'Dados cadastrados com sucesso.' }), {
			status: 200
		});

		// Em caso de falha ao salvar os dados
		// return new Response(JSON.stringify({ message: 'Erro ao cadastrar os dados.' }), {
		// 	status: 500
		// });
	} catch (error) {
		console.error('Erro ao processar a requisição:', error);
		return new Response(JSON.stringify({ message: 'Erro ao processar a requisição.' }), {
			status: 500
		});
	}
};
