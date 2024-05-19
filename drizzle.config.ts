import 'dotenv/config';
import type { Config } from 'drizzle-kit';

export default {
	schema: './src/lib/server/database/schema.ts',
	dialect: 'postgresql',
	dbCredentials: {
		url: process.env.DB_URL!
	},
	// Print all statements
	verbose: true,
	// Always ask for confirmation
	strict: true
} satisfies Config;
