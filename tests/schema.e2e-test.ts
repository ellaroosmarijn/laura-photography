import { test, expect } from 'vitest';
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

beforeEach(async () => {
    await prisma.scene.deleteMany();
    await prisma.event.deleteMany();
});

afterEach(async () => {
    await prisma.scene.deleteMany();
    await prisma.event.deleteMany();
});


test("should create and retrieve an event by name", async () => {
    const createdEvent = await prisma.event.create({
        data: {
            name: 'Ellen & Dave, Davenport House',
            expiry: "2100-12-12T00:00:00.000Z"
        },
    })

    const fetchedEvent = await prisma.event.findFirst({
        where: {
            name: 'Ellen & Dave, Davenport House',
        },
    });

    expect(fetchedEvent).not.toBeNull();
    expect(fetchedEvent?.name).toBe(createdEvent.name);
    expect(fetchedEvent?.expiry.toISOString()).toBe(new Date(createdEvent.expiry).toISOString());
})

test("should create and retrieve a scene by name", async () => {
    const createdEvent = await prisma.event.create({
        data: {
            name: 'Ellen & Dave, Davenport House',
            expiry: new Date("2100-12-12T00:00:00.000Z")
        },
    });

    const createdScene = await prisma.scene.create({
        data: {
            name: 'dinner',
            event_id: createdEvent.id,
        },
    });

    const fetchedScene = await prisma.scene.findFirst({
        where: {
            name: 'dinner',
        },
    });

    expect(fetchedScene).not.toBeNull();
    expect(fetchedScene?.name).toBe(createdScene.name);
    expect(fetchedScene?.event_id).toBe(createdScene.event_id);

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
    expect(fetchedEventWithScenes?.scenes[0].name).toBe('dinner');

})