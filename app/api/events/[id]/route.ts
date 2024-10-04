// for when you do know the specific id of an event

import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

function createErrorResponse(message: string, status: number) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "Content-Type": "application/json" },
  })
}

function validateId(idString: string) {
  const id = parseInt(idString)

  if (isNaN(id) || id <= 0) {
    return {
      error: createErrorResponse(
        "Invalid input: ID must be a positive integer",
        400,
      ),
    }
  }

  return { id }
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  const { id, error } = validateId(params.id)
  if (error) return error

  try {
    const data = await prisma.event.findFirst({
      where: { id },
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
  const { id, error } = validateId(params.id)
  if (error) return error

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
  const { id, error } = validateId(params.id)
  if (error) return error

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
