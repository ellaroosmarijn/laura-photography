// TODO: clarify - get all media (all media and/or all media within a scene???)

import { PrismaClient } from "@prisma/client"
import { createErrorResponse } from "utils/route-helpers"

const prisma = new PrismaClient()

export function GET() {
  try {
    const fetchedMedia = prisma.media.findMany({ where: { deleted_at: null } })

    return new Response(JSON.stringify({ fetchedMedia }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    return createErrorResponse("Error fetching media", 500)
  }
}
