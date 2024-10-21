// // Aqui fica a conexão com o banco de dados, utilizando o Drizzle ORM
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import { DB_URL } from '$env/static/private';
const { Pool } = pg;

const pool = new Pool({
	connectionString: DB_URL
});

export const db = drizzle({ client: pool });
