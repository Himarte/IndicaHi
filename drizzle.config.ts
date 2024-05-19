import 'dotenv/config';
import type { Config } from 'drizzle-kit';

export default {
	schema: './src/lib/server/database/schema.ts',
	out: './migration',
	driver: 'pg', // 'pg' | 'mysql2' | 'better-sqlite' | 'libsql' | 'turso'
	dbCredentials: {
		host: process.env.DB_HOST!,
		user: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_NAME!,
		port: 3333
	},
	// Print all statements
	verbose: true,
	// Always ask for confirmation
	strict: true
} satisfies Config;
