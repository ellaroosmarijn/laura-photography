// for when you do know the specific id of an event

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  const id = parseInt(params.id)
  try {
    const data = await prisma.event.findFirst({
      where: {
        id,
      },
    })
    return Response.json({ data })
  } catch (error) {
    return new Response(JSON.stringify({ error: "Error fetching event" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  const id = parseInt(params.id)

  try {
    const deletedEvent = await prisma.event.update({
      where: {
        id: id,
      },
      data: {
        deleted_at: new Date(),
      },
    })

    return new Response(
      JSON.stringify({ message: "Event deleted successfully", deletedEvent }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    )
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Event not found or deletion failed' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
