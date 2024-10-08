import { PrismaClient } from "@prisma/client"
import { v4 as uuidv4, v6 as uuidv6 } from "uuid"

const prisma = new PrismaClient()

export const eventData = {
  name: "Ellen & Dave, Davenport House",
  deleted_at: null,
}

export const eventData2 = {
  name: "Haley & Ben, Pynes House",
  deleted_at: null,
}

export const deletedEventData = {
  name: "Ellen & Dave, Davenport House",
  deleted_at: new Date("2023-12-31 23:59:59"),
}

export const sceneData = {
  name: "dinner",
  deleted_at: null,
}

export const sceneData2 = {
  name: "lunch",
  deleted_at: null,
}

export const mediaData = {
  image_order: 1,
  web_resolution_url: "http://example.com/web-res.jpg",
  high_resolution_url: "http://example.com/high-res.jpg",
  deleted_at: null,
}

export const mediaData2 = {
  image_order: 2,
  web_resolution_url: "http://example.com/web-res2.jpg",
  high_resolution_url: "http://example.com/high-res2.jpg",
  deleted_at: null,
}

export const shareLinkData = {
  createdAt: new Date("2023-12-31 23:59:59"),
  expiry: new Date("2100-12-12T00:00:00.000Z"),
  key: uuidv4(),
  deleted_at: null,
}

export const createExpiredShareLink = async (eventId: number) => {
  const expiredShareLinkData = {
    createdAt: new Date("2023-12-31 23:59:59"),
    expiry: new Date("2000-01-01T00:00:00.000Z"),
    key: uuidv6(),
  }

  return await prisma.shareLink.create({
    data: {
      ...expiredShareLinkData,
      event_id: eventId,
    },
  })
}

export const createEvent = async () => {
  return await prisma.event.create({
    data: eventData,
  })
}

export const createEvent2 = async () => {
  return await prisma.event.create({
    data: eventData2,
  })
}

export const createSoftDeletedEvent = async () => {
  return await prisma.event.create({
    data: deletedEventData,
  })
}

export const createScene = async (eventId: number) => {
  return await prisma.scene.create({
    data: {
      ...sceneData,
      event_id: eventId,
    },
  })
}

export const createScene2 = async (eventId: number) => {
  return await prisma.scene.create({
    data: {
      ...sceneData2,
      event_id: eventId,
    },
  })
}

export const createMedia = async (sceneId: number) => {
  return await prisma.media.create({
    data: {
      ...mediaData,
      scene_id: sceneId,
    },
  })
}

export const createMedia2 = async (sceneId: number) => {
  return await prisma.media.create({
    data: {
      ...mediaData2,
      scene_id: sceneId,
    },
  })
}

export const createShareLink = async (eventId: number) => {
  return await prisma.shareLink.create({
    data: {
      ...shareLinkData,
      event_id: eventId,
    },
  })
}

export const softDeleteEvent = async (eventId: number) => {
  await prisma.event.update({
    where: { id: eventId },
    data: { deleted_at: new Date() },
  })

  const scenes = await prisma.scene.findMany({
    where: { event_id: eventId },
  })

  for (const scene of scenes) {
    await softDeleteScene(scene.id)

    const media = await prisma.media.findMany({
      where: { scene_id: scene.id },
    })

    for (const item of media) {
      await softDeleteMedia(item.id)
    }
  }

  const shareLinks = await prisma.shareLink.findMany({
    where: { event_id: eventId },
  })

  for (const link of shareLinks) {
    await softDeleteShareLink(link.key)
  }
}

export const softDeleteScene = async (sceneId: number) => {
  await prisma.scene.update({
    where: { id: sceneId },
    data: { deleted_at: new Date() },
  })

  const mediaItems = await prisma.media.findMany({
    where: { scene_id: sceneId },
  })

  for (const media of mediaItems) {
    await softDeleteMedia(media.id)
  }
}

export const softDeleteMedia = async (mediaId: number) => {
  await prisma.media.update({
    where: { id: mediaId },
    data: { deleted_at: new Date() },
  })
}

export const softDeleteShareLink = async (key: string) => {
  await prisma.shareLink.update({
    where: { key },
    data: { deleted_at: new Date() },
  })
}

export const fetchActiveEvent = async (eventId: number) => {
  return await prisma.event.findFirst({
    where: {
      id: eventId,
      deleted_at: null,
    },
  })
}

export const fetchActiveScene = async (sceneId: number) => {
  return await prisma.scene.findFirst({
    where: {
      id: sceneId,
      deleted_at: null,
    },
  })
}

export const fetchActiveMedia = async (mediaId: number) => {
  return await prisma.media.findFirst({
    where: {
      id: mediaId,
      deleted_at: null,
    },
  })
}

export const fetchActiveShareLink = async (key: string) => {
  return await prisma.shareLink.findFirst({
    where: {
      key: key,
      deleted_at: null,
    },
  })
}

export const restoreMedia = async (mediaId: number) => {
  await prisma.media.update({
    where: { id: mediaId },
    data: { deleted_at: null },
  })
}

export const restoreScene = async (sceneId: number) => {
  await prisma.scene.update({
    where: { id: sceneId },
    data: { deleted_at: null },
  })

  const mediaItems = await prisma.media.findMany({
    where: { scene_id: sceneId },
  })

  for (const media of mediaItems) {
    await restoreMedia(media.id)
  }
}

export const restoreShareLink = async (key: string) => {
  await prisma.shareLink.update({
    where: { key },
    data: { deleted_at: null },
  })
}

export const restoreEvent = async (eventId: number) => {
  await prisma.event.update({
    where: { id: eventId },
    data: { deleted_at: null },
  })

  const scenes = await prisma.scene.findMany({
    where: { event_id: eventId },
  })

  for (const scene of scenes) {
    await restoreScene(scene.id)
  }

  const shareLinks = await prisma.shareLink.findMany({
    where: { event_id: eventId },
  })

  for (const link of shareLinks) {
    await restoreShareLink(link.key)
  }
}
