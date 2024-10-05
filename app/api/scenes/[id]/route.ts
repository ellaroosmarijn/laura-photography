// for when you do know the specific id of a scene
import { PrismaClient } from "@prisma/client"
import { createErrorResponse, validateId } from "utils/route-helpers"

const prisma = new PrismaClient()

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  const { id, error } = validateId(params.id)
  if (error) return error

  try {
    const fetchedScene = await prisma.scene.findFirst({
      where: {
        id,
        deleted_at: null,
      },
    })

    if (!fetchedScene) {
      return createErrorResponse("Scene not found or has been deleted", 404)
    }

    return new Response(JSON.stringify({ fetchedScene }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    return createErrorResponse("Error fetching scene", 500)
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  const { id, error } = validateId(params.id)
  if (error) return error

  try {
    const deletedScene = await prisma.scene.update({
      where: {
        id: id,
      },
      data: {
        deleted_at: new Date(),
      },
    })

    return new Response(JSON.stringify({ deletedScene }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    return createErrorResponse("Scene not found or deletion failed", 500)
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string; eventId: string } },
) {
  const { id, error } = validateId(params.id)
  if (error) return error

  const { id: eventId, error: eventError } = validateId(params.eventId)
  if (eventError) return eventError

  try {
    const { name, deleted_at } = await req.json()

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return createErrorResponse("Invalid input: Name cannot be empty", 400)
    }

    const existingScene = await prisma.scene.findUnique({
      where: { id },
    })

    if (!existingScene) {
      return createErrorResponse("Scene not found", 404)
    }

    if (existingScene.deleted_at) {
      return createErrorResponse(
        "Scene has been deleted and cannot be updated",
        400,
      )
    }
    if (name !== undefined) {
      const sceneWithSameName = await prisma.scene.findUnique({
        where: { id },
      })

      if (sceneWithSameName && sceneWithSameName.id !== id) {
        return createErrorResponse("Scene with this name already exists", 400)
      }
    }

    if (name) {
      const scenesWithSameName = await prisma.scene.findMany({
        where: {
          name,
          event_id: eventId,
          deleted_at: null,
        },
      })

      if (scenesWithSameName.some((scene) => scene.id !== id)) {
        return createErrorResponse(
          "Scene with this name already exists in the event",
          400,
        )
      }
    }

    const updateScene: { name?: string; deleted_at?: Date | null } = {}

    if (name) {
      updateScene.name = name
    }

    if (deleted_at === null) {
      updateScene.deleted_at = null
    }

    const updatedScene = await prisma.scene.update({
      where: { id },
      data: updateScene,
    })

    return new Response(JSON.stringify({ updatedScene }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    return createErrorResponse("Scene update failed", 500)
  }
}
