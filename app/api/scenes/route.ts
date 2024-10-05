// get all scenes (all scenes or all scenes within an event?)

import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export function GET() {
  try {
    const fetchedScenes = prisma.scene.findMany({ where: { deleted_at: null } })

    return new Response(JSON.stringify({ fetchedScenes }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: "Error fetching scenes" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
