// For getting all event, creating an event when you doen't know the id
// don't forget about soft deleted events

import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET() {
  try {
    const fetchedEvents = await prisma.event.findMany()

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
