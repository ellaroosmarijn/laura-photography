import { PrismaClient } from "@prisma/client"
import { expect, test } from "vitest"
import {
  createEvent,
  createEvent2,
  createMedia,
  createScene,
  createShareLink,
  eventData,
  fetchActiveEvent,
  fetchActiveMedia,
  fetchActiveScene,
  fetchActiveShareLink,
  restoreEvent,
  softDeleteEvent,
} from "./utlis/test-helpers"

const prisma = new PrismaClient()

beforeEach(async () => {
  await prisma.shareLink.deleteMany()
  await prisma.media.deleteMany()
  await prisma.scene.deleteMany()
  await prisma.event.deleteMany()
})

afterEach(async () => {
  await prisma.shareLink.deleteMany()
  await prisma.media.deleteMany()
  await prisma.scene.deleteMany()
  await prisma.event.deleteMany()
})


// TODO: Fix all tests that Get, delete, etc an event by name to do it by ID. 
// TODO: Update all other test files as well.
// TODO: add tests for updating/editing the event (e.g. adding scenes, renaming, etc)

test("should create and retrieve an event by name", async () => {
  const createdEvent = await createEvent()

  const fetchedEvent = await prisma.event.findFirst({
    where: {
      name: eventData.name,
    },
  })

  expect(fetchedEvent).not.toBeNull()
  expect(fetchedEvent?.name).toBe(createdEvent.name)
  expect(fetchedEvent?.expiry.toISOString()).toBe(
    eventData.expiry.toISOString(),
  )
})

test("should delete an event and verify related scenes, media and shareLink are also deleted", async () => {
  const createdEvent = await createEvent()
  const createdScene = await createScene(createdEvent.id)
  const createdMedia = await createMedia(createdScene.id)
  const createdShareLink = await createShareLink(createdEvent.id)

  await prisma.event.delete({
    where: {
      id: createdEvent.id,
    },
  })

  const fetchedEvent = await prisma.event.findUnique({
    where: {
      id: createdEvent.id,
    },
  })
  expect(fetchedEvent).toBeNull()

  const fetchedScene = await prisma.scene.findUnique({
    where: {
      id: createdScene.id,
    },
  })
  expect(fetchedScene).toBeNull()

  const fetchedMedia = await prisma.media.findUnique({
    where: {
      id: createdMedia.id,
    },
  })
  expect(fetchedMedia).toBeNull()

  const fetchedShareLink = await prisma.shareLink.findUnique({
    where: { key: createdShareLink.key },
  })
  expect(fetchedShareLink).toBeNull()
})

test("should soft delete an event and verify it and related scenes, media, and shareLink are excluded from active queries", async () => {
  const createdEvent = await createEvent()
  const createdScene = await createScene(createdEvent.id)
  const createdMedia = await createMedia(createdScene.id)
  const createdShareLink = await createShareLink(createdEvent.id)

  await softDeleteEvent(createdEvent.id)

  const fetchedEvent = await fetchActiveEvent(createdEvent.id)
  expect(fetchedEvent).toBeNull()

  const fetchedScene = await fetchActiveScene(createdScene.id)
  expect(fetchedScene).toBeNull()

  const fetchedMedia = await fetchActiveMedia(createdMedia.id)
  expect(fetchedMedia).toBeNull()

  const fetchedShareLink = await fetchActiveShareLink(createdShareLink.key)
  expect(fetchedShareLink).toBeNull()
})

test("should restore a soft-deleted event and verify related scenes, media, and shareLinks are also restored", async () => {
  const createdEvent = await createEvent()
  const createdScene = await createScene(createdEvent.id)
  const createdMedia = await createMedia(createdScene.id)
  const createdShareLink = await createShareLink(createdEvent.id)

  await softDeleteEvent(createdEvent.id)

  await restoreEvent(createdEvent.id)

  const fetchedEvent = await fetchActiveEvent(createdEvent.id)
  expect(fetchedEvent).not.toBeNull()

  const fetchedScene = await fetchActiveScene(createdScene.id)
  expect(fetchedScene).not.toBeNull()

  const fetchedMedia = await fetchActiveMedia(createdMedia.id)
  expect(fetchedMedia).not.toBeNull()

  const fetchedShareLink = await fetchActiveShareLink(createdShareLink.key)
  expect(fetchedShareLink).not.toBeNull()
})

test("should not allow creation of two events with the same name", async () => {
  await createEvent()
  await expect(createEvent()).rejects.toThrowError()
})

test("should allow creation of events with different names", async () => {
  const event1 = await createEvent()
  const event2 = await createEvent2()

  expect(event1.name).not.toBe(event2.name)
})
