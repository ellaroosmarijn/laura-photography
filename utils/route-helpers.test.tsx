import { describe, it, expect } from "vitest"
import { createErrorResponse, validateId } from "./route-helpers"

describe("createErrorResponse", () => {
  it("should return a Response object with the correct status and error message", () => {
    const message = "Something went wrong"
    const status = 500
    const response = createErrorResponse(message, status)

    expect(response).toBeInstanceOf(Response)
    expect(response.status).toBe(status)
    expect(response.headers.get("Content-Type")).toBe("application/json")

    response.json().then((data) => {
      expect(data).toEqual({ error: message })
    })
  })
})

describe("validateId", () => {
  it("should return an error response if the id is not a valid positive integer", () => {
    const { error } = validateId("abc")
    expect(error).toBeInstanceOf(Response)
    error.json().then((data) => {
      expect(data).toEqual({
        error: "Invalid input: ID must be a positive integer",
      })
    })

    const { error: error2 } = validateId("-10")
    expect(error2).toBeInstanceOf(Response)
    error2.json().then((data) => {
      expect(data).toEqual({
        error: "Invalid input: ID must be a positive integer",
      })
    })
  })

  it("should return an object with a valid id if the id is a positive integer", () => {
    const { id } = validateId("123")
    expect(id).toBe(123)
  })
})
