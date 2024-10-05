// for when you do know the specific id of a scene
import { PrismaClient } from "@prisma/client"
import { createErrorResponse, validateId } from "tests/utlis/route-helpers"

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
