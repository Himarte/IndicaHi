// Aqui fica a conexão com o banco de dados, utilizando o Drizzle ORM
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as schema from './schema';
import { DB_HOST, DB_PASSWORD, DB_USER, DB_NAME } from '$env/static/private';

export const client = new pg.Client({
	host: DB_HOST,
	port: 5432,
	user: DB_USER,
	password: DB_PASSWORD,
	database: DB_NAME
});

await client.connect();

export const db = drizzle(client, { schema });
