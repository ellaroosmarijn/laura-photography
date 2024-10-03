// for when you do know the specific id of a scene
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {

  const id = parseInt(params.id)
    const data = await prisma.scene.findFirst({
        where: {
             id,
        },
    });
  return Response.json({data})
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);
  try {
    const deletedScene = await prisma.scene.delete({
      where: {
        id: id,
      },
    });

    return new Response(JSON.stringify({ message: 'Scene deleted successfully', deletedScene }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Scene not found or deletion failed' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
