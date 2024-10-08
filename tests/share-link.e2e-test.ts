import { test, expect } from "vitest"
import { PrismaClient } from "@prisma/client"
import {
  createEvent,
  createShareLink,
  createExpiredShareLink,
  softDeleteShareLink,
  fetchActiveShareLink,
  restoreShareLink,
  createSoftDeletedShareLink,
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

test("should create and retrieve the shareLink, check it's validity & verify it belongs to the event", async () => {
  const createdEvent = await createEvent()
  const createdShareLink = await createShareLink(createdEvent.id)

  const fetchedShareLink = await prisma.shareLink.findFirst({
    where: {
      id: createdShareLink.id,
    },
  })

  expect(fetchedShareLink).not.toBeNull()
  expect(fetchedShareLink?.createdAt).toStrictEqual(createdShareLink.createdAt)
  expect(fetchedShareLink?.expiry).toStrictEqual(createdShareLink.expiry)
  expect(fetchedShareLink?.key).toBe(createdShareLink.key)
  expect(fetchedShareLink?.event_id).toBe(createdEvent.id)
})

test("should update a soft-deleted share link and verify it still belongs to the same event", async () => {
  const createdEvent = await createEvent()
  const softDeletedShareLink = await createSoftDeletedShareLink(createdEvent.id)

  const updatedShareLink = await prisma.shareLink.update({
    where: {
      id: softDeletedShareLink.id,
    },
    data: {
      deleted_at: null,
    },
  })

  expect(updatedShareLink).not.toBeNull()
  expect(updatedShareLink.deleted_at).toBeNull()
  expect(updatedShareLink.event_id).toBe(createdEvent.id)
  expect(updatedShareLink.event_id).toBe(softDeletedShareLink.event_id)
  expect(softDeletedShareLink).not.toBeNull()
  expect(softDeletedShareLink?.id).toBe(updatedShareLink.id)
  expect(softDeletedShareLink?.deleted_at).not.toBe(updatedShareLink.deleted_at)

  const fetchedEventWithShareLinks = await prisma.event.findUnique({
    where: {
      id: createdEvent.id,
    },
    include: {
      share_links: true,
    },
  })

  expect(fetchedEventWithShareLinks).not.toBeNull()
  expect(fetchedEventWithShareLinks?.share_links).toHaveLength(1)
  expect(fetchedEventWithShareLinks?.share_links[0].id).toBe(
    updatedShareLink.id,
  )
})

test("should delete a shareLink and verify it is removed from the event", async () => {
  const createdEvent = await createEvent()
  const createdShareLink = await createShareLink(createdEvent.id)

  await prisma.shareLink.delete({
    where: {
      id: createdShareLink.id,
    },
  })

  const fetchedShareLink = await prisma.shareLink.findUnique({
    where: {
      id: createdShareLink.id,
    },
  })

  expect(fetchedShareLink).toBeNull()

  const fetchedEventWithShareLink = await prisma.event.findUnique({
    where: {
      id: createdEvent.id,
    },
    include: {
      share_links: true,
    },
  })

  expect(fetchedEventWithShareLink).not.toBeNull()
  expect(fetchedEventWithShareLink?.share_links).toHaveLength(0)
})

test("should not include expired shareLink in the list of valid shareLinks", async () => {
  const createdEvent = await createEvent()

  await createExpiredShareLink(createdEvent.id)

  const validShareLink = await createShareLink(createdEvent.id)

  const activeShareLinks = await prisma.shareLink.findMany({
    where: {
      expiry: {
        gt: new Date(),
      },
    },
  })

  expect(activeShareLinks).toHaveLength(1)
  expect(activeShareLinks[0].key).toBe(validShareLink.key)
})

test("should soft delete a shareLink and verify it is excluded from active queries", async () => {
  const createdEvent = await createEvent()
  const createdShareLink = await createShareLink(createdEvent.id)

  await softDeleteShareLink(createdShareLink.key)

  const fetchedShareLink = await fetchActiveShareLink(createdShareLink.key)
  expect(fetchedShareLink).toBeNull()
})

test("should restore a soft-deleted shareLink and verify it is restored correctly", async () => {
  const createdEvent = await createEvent()
  const createdShareLink = await createShareLink(createdEvent.id)

  await softDeleteShareLink(createdShareLink.key)

  await restoreShareLink(createdShareLink.key)

  const fetchedShareLink = await fetchActiveShareLink(createdShareLink.key)
  expect(fetchedShareLink).not.toBeNull()
})
