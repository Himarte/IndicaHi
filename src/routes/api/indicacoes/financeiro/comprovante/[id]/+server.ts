import { error } from '@sveltejs/kit';
import { db } from '$lib/server/database/db.server';
import { leadsComprovanteTable } from '$lib/server/database/schema';
import { eq } from 'drizzle-orm';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
  try {
    const lead = await db
      .select({
        comprovante: leadsComprovanteTable.comprovante
      })
      .from(leadsComprovanteTable)
      .where(eq(leadsComprovanteTable.leadsId, params.id))
      .limit(1);

    if (!lead || lead.length === 0) {
      throw error(404, 'Comprovante não encontrado');
    }

    return new Response(
      JSON.stringify({
        comprovante: lead[0].comprovante
      }),
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (err) {
    console.error('Erro ao buscar comprovante:', err);
    throw error(500, 'Erro ao buscar comprovante');
  }
};