import 'dotenv/config';
import type { Config } from 'drizzle-kit';

export default {
	schema: './src/lib/server/database/schema.ts',
	out: './migration',
	driver: 'pg', // 'pg' | 'mysql2' | 'better-sqlite' | 'libsql' | 'turso'
	dbCredentials: {
		connectionString: process.env.DB_URL!
	},
	// Print all statements
	verbose: true,
	// Always ask for confirmation
	strict: true
} satisfies Config;
