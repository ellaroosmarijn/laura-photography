import { test, expect } from 'vitest';
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

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

