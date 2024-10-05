export function createErrorResponse(message: string, status: number) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "Content-Type": "application/json" },
  })
}

export function validateId(idString: string) {
  const id = parseInt(idString)

  if (isNaN(id) || id <= 0) {
    return {
      error: createErrorResponse(
        "Invalid input: ID must be a positive integer",
        400,
      ),
    }
  }

  return { id }
}
