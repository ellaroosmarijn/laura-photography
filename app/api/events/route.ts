// For getting all event, creating an event when you doen't know the id
// don't forget about soft deleted events

import { PrismaClient } from "@prisma/client"
import { createErrorResponse } from "tests/utlis/route-helpers"

const prisma = new PrismaClient()

export async function GET() {
  try {
    const fetchedEvents = await prisma.event.findMany({
      where: { deleted_at: null },
    })

    return new Response(JSON.stringify({ fetchedEvents }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: "Error fetching events" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}

export async function POST(req: Request) {
  try {
    const { name } = await req.json()

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return createErrorResponse("Invalid input: name cannot be empty", 400)
    }

    const createdEvent = await prisma.event.create({
      data: {
        name,
      },
    })

    return new Response(JSON.stringify({ createdEvent }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    return createErrorResponse("Creating event failed", 500)
  }
}
