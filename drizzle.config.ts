import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	schema: './src/lib/server/database/schema.ts',
	dialect: 'postgresql',
	out: './drizzle',
	dbCredentials: {
		url: process.env.DATABASE_URL!
	},
	// Print all statements
	verbose: true,
	// Always ask for confirmation
	strict: true
});
