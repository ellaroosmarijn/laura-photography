import { test, expect } from 'vitest';
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()


// TODO, test:
// scene has a media and event has a scene.
//
// when delete an event, scene or media
//
// creating sharelink, checking it is valid, deleteing it, expiring (not in list when get list of all of them)
//
// getting scenes and media if it is pulled
//
// marking and unmarking media as selected
//
// soft deletions (setting date for deleted so it treats it as deleted and action cane be undone)
//
// can you save an event with the same name
//
// conjoin or composite key checks uniqueness of two fields combined e.g. custimer cannot have two events
// with same name, but another customer can have an event with that name

const eventData = {
    name: 'Ellen & Dave, Davenport House',
    expiry: new Date("2100-12-12T00:00:00.000Z")
};

const sceneData = {
    name: 'dinner'
};

const createEvent = async () => {
    return await prisma.event.create({
        data: eventData,
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

beforeEach(async () => {
    await prisma.media.deleteMany();
    await prisma.scene.deleteMany();
    await prisma.event.deleteMany();
});

afterEach(async () => {
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

    const createdMedia = await prisma.media.create({
        data: {
            image_order: 1,
            web_resolution_url: 'http://example.com/web-res.jpg',
            high_resolution_url: 'http://example.com/high-res.jpg',
            scene_id: createdScene.id,
        },
    });

    const fetchedMedia = await prisma.media.findFirst({
        where: {
            web_resolution_url: 'http://example.com/web-res.jpg',
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
    expect(fetchedSceneWithMedia?.media[0].web_resolution_url).toBe('http://example.com/web-res.jpg');
});
