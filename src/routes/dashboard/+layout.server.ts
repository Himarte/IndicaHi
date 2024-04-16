export const load = async ({ locals }) => {
	const { user } = locals;
    
if (user) {
        return {
            user: {
                id: user.id,
                name: user.name,    
                lastName: user.lastName,
                email: user.email,
                role: user.job
            }
        }
    }
};
