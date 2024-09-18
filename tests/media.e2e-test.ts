import { test, expect } from 'vitest';
import { PrismaClient } from '@prisma/client';
import {
    createEvent,
    createScene,
    createScene2,
    createMedia,
    createMedia2,
    softDeleteMedia,
    fetchActiveMedia,
    restoreMedia,
    mediaData
} from './utlis/test-helpers'; 

const prisma = new PrismaClient()

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

test("should not retrieve unselected media", async () => {
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

test("should soft delete media and verify it is excluded from active queries", async () => {
    const createdEvent = await createEvent();
    const createdScene = await createScene(createdEvent.id);
    const createdMedia = await createMedia(createdScene.id);

    await softDeleteMedia(createdMedia.id);

    const fetchedMedia = await fetchActiveMedia(createdMedia.id);
    expect(fetchedMedia).toBeNull();
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

test("should not allow duplicate media items within the same scene", async () => {
    const createdEvent = await createEvent();
    const createdScene = await createScene(createdEvent.id);
    
    await createMedia(createdScene.id);
    
    await expect(createMedia(createdScene.id)).rejects.toThrowError();
});

test("should allow duplicate media items across different scenes", async () => {
    const event = await createEvent();
    const scene1 = await createScene(event.id);
    const scene2 = await createScene2(event.id);
    
    await createMedia(scene1.id);
    
    const mediaInScene2 = await createMedia(scene2.id);
    
    expect(mediaInScene2.web_resolution_url).toBe(mediaData.web_resolution_url);
});
