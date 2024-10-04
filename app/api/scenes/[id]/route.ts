// for when you do know the specific id of a scene
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient();

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  const id = parseInt(params.id)
  const data = await prisma.scene.findFirst({
    where: {
      id,
    },
  })
  return Response.json({ data })
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  const id = parseInt(params.id)
  try {
    const deletedScene = await prisma.scene.update({
      where: {
        id: id,
      },
      data: {
        deleted_at: new Date(),
      },
    })

    return Response.json({ deletedScene })
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Scene not found or deletion failed" }),
      {
        status: 404,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}
