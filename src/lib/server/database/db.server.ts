// Aqui fica a conexão com o banco de dados, utilizando o Drizzle ORM
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as schema from './schema';
import { DB_URL } from '$env/static/private';

export const client = new pg.Client({
	connectionString: DB_URL
});

await client.connect();

export const db = drizzle(client, { schema });
