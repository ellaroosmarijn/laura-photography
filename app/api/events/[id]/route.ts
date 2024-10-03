// for when you do know the specific id of an event

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {

  const id = parseInt(params.id)
    const data = await prisma.event.findFirst({
        where: {
             id,
        },
    });
  return Response.json({data})
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {

  const id = parseInt(params.id);
  
  try {
    const deletedEvent = await prisma.event.delete({
      where: {
        id: id,
      },
    });

    return new Response(JSON.stringify({ message: 'Event deleted successfully', deletedEvent }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Event not found or deletion failed' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
