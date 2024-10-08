import { test, expect } from "vitest"
import { PrismaClient } from "@prisma/client"
import {
  createEvent,
  createEvent2,
  createScene,
  createMedia,
  softDeleteScene,
  fetchActiveScene,
  fetchActiveMedia,
  restoreScene,
  sceneData,
} from "../utils/test-helpers"

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

test("should create and retrieve a scene by name and verify it belongs to the event", async () => {
  const createdEvent = await createEvent()
  const createdScene = await createScene(createdEvent.id)

  const fetchedScene = await prisma.scene.findFirst({
    where: {
      id: createdScene.id,
    },
  })

  expect(fetchedScene).not.toBeNull()
  expect(fetchedScene?.name).toBe(createdScene.name)
  expect(fetchedScene?.event_id).toBe(createdEvent.id)

  const fetchedEventWithScenes = await prisma.event.findUnique({
    where: {
      id: createdEvent.id,
    },
    include: {
      scenes: true,
    },
  })

  expect(fetchedEventWithScenes).not.toBeNull()
  expect(fetchedEventWithScenes?.scenes).toHaveLength(1)
  expect(fetchedEventWithScenes?.scenes[0].name).toBe(sceneData.name)
})

test("should delete a scene and verify related media are also deleted", async () => {
  const createdEvent = await createEvent()
  const createdScene = await createScene(createdEvent.id)
  const createdMedia = await createMedia(createdScene.id)

  await prisma.scene.delete({
    where: {
      id: createdScene.id,
    },
  })

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

  const fetchedEventWithScenes = await prisma.event.findUnique({
    where: {
      id: createdEvent.id,
    },
    include: {
      scenes: true,
    },
  })

  expect(fetchedEventWithScenes).not.toBeNull()
  expect(fetchedEventWithScenes?.scenes).toHaveLength(0)
})

test("should soft delete a scene and verify it and related media are excluded from active queries", async () => {
  const createdEvent = await createEvent()
  const createdScene = await createScene(createdEvent.id)
  const createdMedia = await createMedia(createdScene.id)

  await softDeleteScene(createdScene.id)

  const fetchedScene = await fetchActiveScene(createdScene.id)
  expect(fetchedScene).toBeNull()

  const fetchedMedia = await fetchActiveMedia(createdMedia.id)
  expect(fetchedMedia).toBeNull()
})

test("should restore a soft-deleted scene and verify related media are also restored", async () => {
  const createdEvent = await createEvent()
  const createdScene = await createScene(createdEvent.id)
  const createdMedia = await createMedia(createdScene.id)

  await softDeleteScene(createdScene.id)

  await restoreScene(createdScene.id)

  const fetchedScene = await fetchActiveScene(createdScene.id)
  expect(fetchedScene).not.toBeNull()

  const fetchedMedia = await fetchActiveMedia(createdMedia.id)
  expect(fetchedMedia).not.toBeNull()
})

test("should not allow duplicate scene names within the same event", async () => {
  const createdEvent = await createEvent()
  await createScene(createdEvent.id)

  await expect(createScene(createdEvent.id)).rejects.toThrowError()
})

test("should allow duplicate scene names across different events", async () => {
  const event1 = await createEvent()
  const event2 = await createEvent2()

  await createScene(event1.id)

  const sceneInEvent2 = await createScene(event2.id)

  expect(sceneInEvent2.name).toBe(sceneData.name)
})
