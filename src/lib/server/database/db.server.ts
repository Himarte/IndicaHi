// // Aqui fica a conexão com o banco de dados, utilizando o Drizzle ORM
import { drizzle } from 'drizzle-orm/vercel-postgres';
import pg from 'pg';
import { sql } from '@vercel/postgres';
import { DB_URL } from '$env/static/private';
const { Pool } = pg;

const client = new Pool({
	connectionString: DB_URL
});

await client.connect();
export const db = drizzle(sql);
