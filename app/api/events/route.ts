
// For getting all event, creating an event when you doen't know the id
// don't forget about soft deleted events

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try{
    const data = await prisma.event.findMany()

    return new Response(JSON.stringify({ data }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error fetching events:', error);
    return new Response(JSON.stringify({ error: 'Error fetching events' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
