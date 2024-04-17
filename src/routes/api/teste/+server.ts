import { db } from '$lib/server/database/db.server';
import { userTable } from '$lib/server/database/schema';
import type { RequestHandler } from './$types';
import { eq } from 'drizzle-orm';

export const GET: RequestHandler = async ({ url }) => {
	const id = url.searchParams.get('id');
	const users = await db.select().from(userTable).where(eq(id, userTable.id));
	console.log(users);

	return new Response(JSON.stringify(users), {
		headers: {
			'Content-Type': 'application/json'
		}
	});
};
