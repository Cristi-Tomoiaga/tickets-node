import prisma from '../prisma/client.js';
import {mapEvent, mapEvents} from "../prisma/utils.js";
import {EntityNotFoundError} from "./applicationErrors.js";

const getAllEvents = async (venueLocation, eventType) => {
    const events = await prisma.event.findMany({
        where: {
            availableSeats: {
                gt: 0,
            },
        },
        include: {
            ticketCategories: true,
            eventType: true,
            venue: true,
        },
    });

    return mapEvents(events);
};

const getEventById = async (id) => {
    const eventId = Number.parseInt(id);
    if (isNaN(eventId)) {
        throw new EntityNotFoundError(id, 'Event');
    }

    const event = await prisma.event.findUnique({
        where: {
            id: eventId,
        },
        include: {
            ticketCategories: true,
            eventType: true,
            venue: true,
        },
    });

    if (event === null) {
        throw new EntityNotFoundError(id, 'Event');
    }

    return mapEvent(event);
};

export default {
    getAllEvents,
    getEventById,
};