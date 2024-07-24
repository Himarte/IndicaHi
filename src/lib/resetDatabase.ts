// src/lib/resetDatabase.ts
import { db } from './server/database/db.server';
import { sql } from 'drizzle-orm';

async function resetDatabase() {
	// Deleta as tabelas se elas existirem
	await db.execute(sql`DROP TABLE IF EXISTS session CASCADE`);
	await db.execute(sql`DROP TABLE IF EXISTS leads CASCADE`);
	await db.execute(sql`DROP TABLE IF EXISTS "user" CASCADE`);
	await db.execute(sql`DROP TYPE IF EXISTS job CASCADE`);
	await db.execute(sql`DROP TYPE IF EXISTS pix_type CASCADE`);
	await db.execute(sql`DROP TYPE IF EXISTS status CASCADE`);
}

resetDatabase()
	.then(() => {
		console.log('Database reset successfully');
		process.exit(0);
	})
	.catch((error) => {
		console.error('Error resetting database:', error);
		process.exit(1);
	});
