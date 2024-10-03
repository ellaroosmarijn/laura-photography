// for when you do know the specific id of an event

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {

  const id = parseInt(params.id)
    const data = await prisma.event.findFirst({
        where: {
             id,
        },
    });
  return Response.json({data})

}