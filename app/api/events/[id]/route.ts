// for when you do know the specific id of an event

import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

function createErrorResponse(message: string, status: number) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "Content-Type": "application/json" },
  })
}

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
    return createErrorResponse("Error fetching event", 500)
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

    return Response.json({ deletedEvent })
  } catch (error) {
    return createErrorResponse("Event not found or deletion failed", 404)
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  const id = parseInt(params.id)

  try {
    const { name } = await req.json()

    const updatedEvent = await prisma.event.update({
      where: { id },
      data: { name },
    })

    return Response.json({ updatedEvent })
  } catch (error) {
    return createErrorResponse("Event update failed", 404)
  }
}
