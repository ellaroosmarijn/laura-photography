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
      where: { id, deleted_at: null },
    })

    if (!data) {
      return createErrorResponse("Event not found or has been deleted", 404)
    }

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
      where: { id },
      data: { deleted_at: new Date() },
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
    const { name, deleted_at } = await req.json()

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return createErrorResponse("Invalid input: Name cannot be empty", 400)
    }

    const existingEvent = await prisma.event.findUnique({
      where: { id },
    })

    if (!existingEvent) {
      return createErrorResponse("Event not found", 404)
    }

    if (existingEvent.deleted_at) {
      return createErrorResponse(
        "Event has been deleted and cannot be updated",
        400,
      )
    }
    if (name !== undefined) {
      const eventWithSameName = await prisma.event.findUnique({
        where: { name },
      })

      if (eventWithSameName && eventWithSameName.id !== id) {
        return createErrorResponse("Event with this name already exists", 400)
      }
    }

    const updateData: { name?: string; deleted_at?: Date | null } = {}

    if (name) {
      updateData.name = name
    }

    if (deleted_at === null) {
      updateData.deleted_at = null
    }

    const updatedEvent = await prisma.event.update({
      where: { id },
      data: updateData,
    })

    return Response.json({ updatedEvent })
  } catch (error) {
    return createErrorResponse("Event update failed", 404)
  }
}
