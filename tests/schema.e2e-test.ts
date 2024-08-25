import { test, expect } from 'vitest';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4, v6 as uuidv6 } from 'uuid';

const prisma = new PrismaClient()

const eventData = {
    name: 'Ellen & Dave, Davenport House',
    expiry: new Date("2100-12-12T00:00:00.000Z"),
    deleted_at: null
};

const eventData2 = {
    name: 'Haley & Ben, Pynes House',
    expiry: new Date("2300-12-12T00:00:00.000Z"),
    deleted_at: null
};

const sceneData = {
    name: 'dinner',
    deleted_at: null
};

const mediaData = {
    image_order: 1,
    web_resolution_url: 'http://example.com/web-res.jpg',
    high_resolution_url: 'http://example.com/high-res.jpg',
    deleted_at: null
};

const mediaData2 = {
    image_order: 2,
    web_resolution_url: 'http://example.com/web-res2.jpg',
    high_resolution_url: 'http://example.com/high-res2.jpg',
    deleted_at: null
};

const shareLinkData = {
    createdAt: new Date("2023-12-31 23:59:59"),
    expiry: new Date("2100-12-12T00:00:00.000Z"),
    key: uuidv4(),
    deleted_at: null
}

const createEvent = async () => {
    return await prisma.event.create({
        data: eventData,
    });
};

const createEvent2 = async () => {
    return await prisma.event.create({
        data: eventData2,
    });
};

const createScene = async (eventId: number) => {
    return await prisma.scene.create({
        data: {
            ...sceneData,
            event_id: eventId,
        },
    });
};

const createMedia = async (sceneId: number) => {
    return await prisma.media.create({
        data: {
            ...mediaData,
            scene_id: sceneId,
        },
    });
};

const createMedia2 = async (sceneId: number) => {
    return await prisma.media.create({
        data: {
            ...mediaData2,
            scene_id: sceneId,
        },
    });
};

const createShareLink = async (eventId: number) => {
    return await prisma.shareLink.create({
        data: {
            ...shareLinkData,
            event_id: eventId,
        }
    })
}

const softDeleteEvent = async (eventId: number) => {
    await prisma.event.update({
        where: { id: eventId },
        data: { deleted_at: new Date() },
    });

    const scenes = await prisma.scene.findMany({
        where: { event_id: eventId },
    });

    for (const scene of scenes) {
        await softDeleteScene(scene.id);

        const media = await prisma.media.findMany({
            where: { scene_id: scene.id },
        });

        for (const item of media) {
            await softDeleteMedia(item.id);
        }
    }

    const shareLinks = await prisma.shareLink.findMany({
        where: { event_id: eventId },
    });

    for (const link of shareLinks) {
        await softDeleteShareLink(link.key);
    }
};

const softDeleteScene = async (sceneId: number) => {
    await prisma.scene.update({
        where: { id: sceneId },
        data: { deleted_at: new Date() },
    });

    const mediaItems = await prisma.media.findMany({
        where: { scene_id: sceneId },
    });

    for (const media of mediaItems) {
        await softDeleteMedia(media.id);
    }
};

const softDeleteMedia = async (mediaId: number) => {
    await prisma.media.update({
        where: { id: mediaId },
        data: { deleted_at: new Date() },
    });
};

const softDeleteShareLink = async (key: string) => {
    await prisma.shareLink.update({
        where: { key },
        data: { deleted_at: new Date() },
    });
};

const fetchActiveEvent = async (eventId: number) => {
    return await prisma.event.findFirst({
        where: {
            id: eventId,
            deleted_at: null,
        },
    });
};

const fetchActiveScene = async (sceneId: number) => {
    return await prisma.scene.findFirst({
        where: {
            id: sceneId,
            deleted_at: null,
        },
    });
};

const fetchActiveMedia = async (mediaId: number) => {
    return await prisma.media.findFirst({
        where: {
            id: mediaId,
            deleted_at: null,
        },
    });
};

const fetchActiveShareLink = async (key: string) => {
    return await prisma.shareLink.findFirst({
        where: {
            key: key,
            deleted_at: null,
        },
    });
};

const restoreMedia = async (mediaId: number) => {
    await prisma.media.update({
        where: { id: mediaId },
        data: { deleted_at: null },
    });
};

const restoreScene = async (sceneId: number) => {
    await prisma.scene.update({
        where: { id: sceneId },
        data: { deleted_at: null },
    });

    const mediaItems = await prisma.media.findMany({
        where: { scene_id: sceneId },
    });

    for (const media of mediaItems) {
        await restoreMedia(media.id);
    }
};

const restoreShareLink = async (key: string) => {
    await prisma.shareLink.update({
        where: { key },
        data: { deleted_at: null },
    });
};

const restoreEvent = async (eventId: number) => {
    await prisma.event.update({
        where: { id: eventId },
        data: { deleted_at: null },
    });

    const scenes = await prisma.scene.findMany({
        where: { event_id: eventId },
    });

    for (const scene of scenes) {
        await restoreScene(scene.id);
    }

    const shareLinks = await prisma.shareLink.findMany({
        where: { event_id: eventId },
    });

    for (const link of shareLinks) {
        await restoreShareLink(link.key);
    }
};

beforeEach(async () => {
    await prisma.shareLink.deleteMany();
    await prisma.media.deleteMany();
    await prisma.scene.deleteMany();
    await prisma.event.deleteMany();
});

afterEach(async () => {
    await prisma.shareLink.deleteMany();
    await prisma.media.deleteMany();
    await prisma.scene.deleteMany();
    await prisma.event.deleteMany();
});

test("should create and retrieve an event by name", async () => {
    const createdEvent = await createEvent();

    const fetchedEvent = await prisma.event.findFirst({
        where: {
            name: eventData.name,
        },
    });

    expect(fetchedEvent).not.toBeNull();
    expect(fetchedEvent?.name).toBe(createdEvent.name);
    expect(fetchedEvent?.expiry.toISOString()).toBe(eventData.expiry.toISOString());
});

test("should create and retrieve a scene by name and verify it belongs to the event", async () => {
    const createdEvent = await createEvent();
    const createdScene = await createScene(createdEvent.id);

    const fetchedScene = await prisma.scene.findFirst({
        where: {
            name: sceneData.name,
        },
    });

    expect(fetchedScene).not.toBeNull();
    expect(fetchedScene?.name).toBe(createdScene.name);
    expect(fetchedScene?.event_id).toBe(createdEvent.id);

    const fetchedEventWithScenes = await prisma.event.findUnique({
        where: {
            id: createdEvent.id,
        },
        include: {
            scenes: true,
        },
    });

    expect(fetchedEventWithScenes).not.toBeNull();
    expect(fetchedEventWithScenes?.scenes).toHaveLength(1);
    expect(fetchedEventWithScenes?.scenes[0].name).toBe(sceneData.name);
});

test("should create and retrieve media and verify it belongs to the scene", async () => {
    const createdEvent = await createEvent();
    const createdScene = await createScene(createdEvent.id);
    const createdMedia = await createMedia(createdScene.id);

    const fetchedMedia = await prisma.media.findFirst({
        where: {
            web_resolution_url: mediaData.web_resolution_url,
        },
    });

    expect(fetchedMedia).not.toBeNull();
    expect(fetchedMedia?.image_order).toBe(createdMedia.image_order);
    expect(fetchedMedia?.web_resolution_url).toBe(createdMedia.web_resolution_url);
    expect(fetchedMedia?.high_resolution_url).toBe(createdMedia.high_resolution_url);
    expect(fetchedMedia?.scene_id).toBe(createdScene.id);

    const fetchedSceneWithMedia = await prisma.scene.findUnique({
        where: {
            id: createdScene.id,
        },
        include: {
            media: true,
        },
    });

    expect(fetchedSceneWithMedia).not.toBeNull();
    expect(fetchedSceneWithMedia?.media).toHaveLength(1);
    expect(fetchedSceneWithMedia?.media[0].web_resolution_url).toBe(mediaData.web_resolution_url);
});

test("should create and retrieve the shareLink, check it's validity & verify it belongs to the event", async () => {
    const createdEvent = await createEvent();
    const createdShareLink = await createShareLink(createdEvent.id);

    const fetchedShareLink = await prisma.shareLink.findFirst({
        where: {
            key: createdShareLink.key,
        },
    });

    expect(fetchedShareLink).not.toBeNull();
    expect(fetchedShareLink?.createdAt).toStrictEqual(createdShareLink.createdAt);
    expect(fetchedShareLink?.expiry).toStrictEqual(createdShareLink.expiry);
    expect(fetchedShareLink?.key).toBe(createdShareLink.key);
    expect(fetchedShareLink?.event_id).toBe(createdEvent.id);
});

test("should delete an event and verify related scenes, media and shareLink are also deleted", async () => {
    const createdEvent = await createEvent();
    const createdScene = await createScene(createdEvent.id);
    const createdMedia = await createMedia(createdScene.id);
    const createdShareLink = await createShareLink(createdEvent.id)

    await prisma.event.delete({
        where: {
            id: createdEvent.id,
        },
    });

    const fetchedEvent = await prisma.event.findUnique({
        where: {
            id: createdEvent.id,
        },
    });
    expect(fetchedEvent).toBeNull();

    const fetchedScene = await prisma.scene.findUnique({
        where: {
            id: createdScene.id,
        },
    });
    expect(fetchedScene).toBeNull();

    const fetchedMedia = await prisma.media.findUnique({
        where: {
            id: createdMedia.id,
        },
    });
    expect(fetchedMedia).toBeNull();

    const fetchedShareLink = await prisma.shareLink.findUnique({
        where: { key: createdShareLink.key, },
    })
    expect(fetchedShareLink).toBeNull();
});

test("should delete a scene and verify related media are also deleted", async () => {
    const createdEvent = await createEvent();
    const createdScene = await createScene(createdEvent.id);
    const createdMedia = await createMedia(createdScene.id);

    await prisma.scene.delete({
        where: {
            id: createdScene.id,
        },
    });

    const fetchedScene = await prisma.scene.findUnique({
        where: {
            id: createdScene.id,
        },
    });
    expect(fetchedScene).toBeNull();

    const fetchedMedia = await prisma.media.findUnique({
        where: {
            id: createdMedia.id,
        },
    });
    expect(fetchedMedia).toBeNull();

    const fetchedEventWithScenes = await prisma.event.findUnique({
        where: {
            id: createdEvent.id,
        },
        include: {
            scenes: true,
        },
    });

    expect(fetchedEventWithScenes).not.toBeNull();
    expect(fetchedEventWithScenes?.scenes).toHaveLength(0);
});

test("should delete media and verify it is removed from the scene", async () => {
    const createdEvent = await createEvent();
    const createdScene = await createScene(createdEvent.id);
    const createdMedia = await createMedia(createdScene.id);

    await prisma.media.delete({
        where: {
            id: createdMedia.id,
        },
    });

    const fetchedMedia = await prisma.media.findUnique({
        where: {
            id: createdMedia.id,
        },
    });
    expect(fetchedMedia).toBeNull();

    const fetchedSceneWithMedia = await prisma.scene.findUnique({
        where: {
            id: createdScene.id,
        },
        include: {
            media: true,
        },
    });

    expect(fetchedSceneWithMedia).not.toBeNull();
    expect(fetchedSceneWithMedia?.media).toHaveLength(0);
});

test("should delete a shareLink and verify it is removed from the event", async () => {
    const createdEvent = await createEvent();
    const createdShareLink = await createShareLink(createdEvent.id);

    await prisma.shareLink.delete({
        where: {
            key: createdShareLink.key,
        }
    })

    const fetchedShareLink = await prisma.shareLink.findUnique({
        where: {
            key: createdShareLink.key,
        },
    });

    expect(fetchedShareLink).toBeNull();

    const fetchedEventWithShareLink = await prisma.event.findUnique({
        where: {
            id: createdEvent.id,
        },
        include: {
            share_links: true,
        },
    });

    expect(fetchedEventWithShareLink).not.toBeNull();
    expect(fetchedEventWithShareLink?.share_links).toHaveLength(0);
});

test("should not include expired shareLink in the list of valid shareLinks", async () => {
    const createdEvent = await createEvent();

    const expiredShareLinkData = {
        createdAt: new Date("2023-12-31 23:59:59"),
        expiry: new Date("2000-01-01T00:00:00.000Z"),
        key: uuidv6(),
    };

    await prisma.shareLink.create({
        data: {
            ...expiredShareLinkData,
            event_id: createdEvent.id,
        }
    });

    const validShareLink = await createShareLink(createdEvent.id);

    const activeShareLinks = await prisma.shareLink.findMany({
        where: {
            expiry: {
                gt: new Date(),
            },
        },
    });

    expect(activeShareLinks).toHaveLength(1);
    expect(activeShareLinks[0].key).toBe(validShareLink.key);
});

test("should mark media as selected", async () => {
    const createdEvent = await createEvent();
    const createdScene = await createScene(createdEvent.id);
    const createdMedia = await createMedia(createdScene.id);

    await prisma.media.update({
        where: { id: createdMedia.id },
        data: { selected: true },
    });

    const fetchedMedia = await prisma.media.findUnique({
        where: { id: createdMedia.id },
    });

    expect(fetchedMedia).not.toBeNull();
    expect(fetchedMedia?.selected).toBe(true);
});

test("should unmark media as selected", async () => {
    const createdEvent = await createEvent();
    const createdScene = await createScene(createdEvent.id);
    const createdMedia = await createMedia(createdScene.id);

    await prisma.media.update({
        where: { id: createdMedia.id },
        data: { selected: true },
    });

    await prisma.media.update({
        where: { id: createdMedia.id },
        data: { selected: false },
    });

    const fetchedMedia = await prisma.media.findUnique({
        where: { id: createdMedia.id },
    });

    expect(fetchedMedia).not.toBeNull();
    expect(fetchedMedia?.selected).toBe(false);
});

test("should retrieve only selected media", async () => {
    const createdEvent = await createEvent();
    const createdScene = await createScene(createdEvent.id);
    const createdMedia1 = await createMedia(createdScene.id);
    const createdMedia2 = await createMedia2(createdScene.id);

    await prisma.media.update({
        where: { id: createdMedia1.id },
        data: { selected: true },
    });

    const selectedMedia = await prisma.media.findMany({
        where: {
            selected: true,
        },
    });

    expect(selectedMedia).toHaveLength(1);
    expect(selectedMedia[0].id).toBe(createdMedia1.id);
    expect(selectedMedia[0].id).not.toBe(createdMedia2.id);
});

test("should retrieve only unselected media", async () => {
    const createdEvent = await createEvent();
    const createdScene = await createScene(createdEvent.id);
    const createdMedia1 = await createMedia(createdScene.id);
    const createdMedia2 = await createMedia2(createdScene.id);

    await prisma.media.update({
        where: { id: createdMedia1.id },
        data: { selected: true },
    });

    const unselectedMedia = await prisma.media.findMany({
        where: {
            selected: false,
        },
    });

    expect(unselectedMedia).toHaveLength(1);
    expect(unselectedMedia[0].id).toBe(createdMedia2.id);
    expect(unselectedMedia[0].id).not.toBe(createdMedia1.id);
});


test("should soft delete an event and verify it and related scenes, media, and shareLink are excluded from active queries", async () => {
    const createdEvent = await createEvent();
    const createdScene = await createScene(createdEvent.id);
    const createdMedia = await createMedia(createdScene.id);
    const createdShareLink = await createShareLink(createdEvent.id);

    await softDeleteEvent(createdEvent.id);

    const fetchedEvent = await fetchActiveEvent(createdEvent.id);
    expect(fetchedEvent).toBeNull();

    const fetchedScene = await fetchActiveScene(createdScene.id);
    expect(fetchedScene).toBeNull();

    const fetchedMedia = await fetchActiveMedia(createdMedia.id);
    expect(fetchedMedia).toBeNull();

    const fetchedShareLink = await fetchActiveShareLink(createdShareLink.key);
    expect(fetchedShareLink).toBeNull();
});


test("should soft delete a scene and verify it and related media are excluded from active queries", async () => {
    const createdEvent = await createEvent();
    const createdScene = await createScene(createdEvent.id);
    const createdMedia = await createMedia(createdScene.id);

    await softDeleteScene(createdScene.id);

    const fetchedScene = await fetchActiveScene(createdScene.id);
    expect(fetchedScene).toBeNull();

    const fetchedMedia = await fetchActiveMedia(createdMedia.id);
    expect(fetchedMedia).toBeNull();
});


test("should soft delete media and verify it is excluded from active queries", async () => {
    const createdEvent = await createEvent();
    const createdScene = await createScene(createdEvent.id);
    const createdMedia = await createMedia(createdScene.id);

    await softDeleteMedia(createdMedia.id);

    const fetchedMedia = await fetchActiveMedia(createdMedia.id);
    expect(fetchedMedia).toBeNull();
});

test("should soft delete a shareLink and verify it is excluded from active queries", async () => {
    const createdEvent = await createEvent();
    const createdShareLink = await createShareLink(createdEvent.id);

    await softDeleteShareLink(createdShareLink.key);

    const fetchedShareLink = await fetchActiveShareLink(createdShareLink.key);
    expect(fetchedShareLink).toBeNull();
});

test("should restore a soft-deleted event and verify related scenes, media, and shareLinks are also restored", async () => {
    const createdEvent = await createEvent();
    const createdScene = await createScene(createdEvent.id);
    const createdMedia = await createMedia(createdScene.id);
    const createdShareLink = await createShareLink(createdEvent.id);

    await softDeleteEvent(createdEvent.id);

    await restoreEvent(createdEvent.id);

    const fetchedEvent = await fetchActiveEvent(createdEvent.id);
    expect(fetchedEvent).not.toBeNull();

    const fetchedScene = await fetchActiveScene(createdScene.id);
    expect(fetchedScene).not.toBeNull();

    const fetchedMedia = await fetchActiveMedia(createdMedia.id);
    expect(fetchedMedia).not.toBeNull();

    const fetchedShareLink = await fetchActiveShareLink(createdShareLink.key);
    expect(fetchedShareLink).not.toBeNull();
});

test("should restore a soft-deleted scene and verify related media are also restored", async () => {
    const createdEvent = await createEvent();
    const createdScene = await createScene(createdEvent.id);
    const createdMedia = await createMedia(createdScene.id);

    await softDeleteScene(createdScene.id);

    await restoreScene(createdScene.id);

    const fetchedScene = await fetchActiveScene(createdScene.id);
    expect(fetchedScene).not.toBeNull();

    const fetchedMedia = await fetchActiveMedia(createdMedia.id);
    expect(fetchedMedia).not.toBeNull();
});

test("should restore a soft-deleted media and verify it is restored correctly", async () => {
    const createdEvent = await createEvent();
    const createdScene = await createScene(createdEvent.id);
    const createdMedia = await createMedia(createdScene.id);

    await softDeleteMedia(createdMedia.id);

    await restoreMedia(createdMedia.id);

    const fetchedMedia = await fetchActiveMedia(createdMedia.id);
    expect(fetchedMedia).not.toBeNull();
});

test("should restore a soft-deleted shareLink and verify it is restored correctly", async () => {
    const createdEvent = await createEvent();
    const createdShareLink = await createShareLink(createdEvent.id);

    await softDeleteShareLink(createdShareLink.key);

    await restoreShareLink(createdShareLink.key);

    const fetchedShareLink = await fetchActiveShareLink(createdShareLink.key);
    expect(fetchedShareLink).not.toBeNull();
});

test("should not allow duplicate scene names within the same event", async () => {
    const createdEvent = await createEvent();
    await createScene(createdEvent.id);

    await expect(createScene(createdEvent.id)).rejects.toThrowError();
});


test("should allow duplicate scene names across different events", async () => {
    const event1 = await createEvent();
    const event2 = await createEvent2();

    await createScene(event1.id);

    const sceneInEvent2 = await createScene(event2.id);

    expect(sceneInEvent2.name).toBe(sceneData.name);
});
