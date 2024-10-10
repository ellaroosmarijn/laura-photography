// get all scenes (all scenes or all scenes within an event?)

import { PrismaClient } from "@prisma/client"
import { createErrorResponse } from "utils/route-helpers"

const prisma = new PrismaClient()

export function GET() {
  try {
    const fetchedScenes = prisma.scene.findMany({ where: { deleted_at: null } })

    return new Response(JSON.stringify({ fetchedScenes }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    return createErrorResponse("Error fetching scenes", 500)
  }
}

export async function POST(req: Request) {
  const { name, eventId } = await req.json()
  try {
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return createErrorResponse("Invalid input: name cannot be empty", 400)
    }

    if (!eventId) {
      return createErrorResponse(
        "Invalid input: scene must be linked to an event",
        400,
      )
    }

    const createdScene = await prisma.scene.create({
      data: { name, event_id: eventId },
    })

    return new Response(JSON.stringify({ createdScene }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    return createErrorResponse("Creating scene failed", 500)
  }
}
