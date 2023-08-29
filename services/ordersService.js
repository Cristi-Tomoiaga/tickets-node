import prisma from '../prisma/client.js';
import {mapOrder, mapOrders} from "../prisma/utils.js";
import {
    EntityNotFoundError,
    InvalidIdError,
    InvalidNumberOfTicketsError,
    InvalidTicketCategoryError, OwnershipError,
    UnavailableSeatsError
} from "./applicationErrors.js";

const preferredCustomerId = 3;

const getAllOwnedOrders = async () => {
    const orders = await prisma.order.findMany({
        where: {
            customerId: {
                equals: preferredCustomerId,
            },
        },
        include: {
            ticketCategory: {
                include: {
                    event: {
                        include: {
                            ticketCategories: true,
                            eventType: true,
                            venue: true,
                        },
                    },
                },
            }
        },
    });

    return mapOrders(orders);
};

const createOrder = async (eventId, ticketCategoryId, numberOfTickets) => {
    if (numberOfTickets <= 0) {
        throw new InvalidNumberOfTicketsError(numberOfTickets);
    }

    const customer = prisma.customer.findUnique({
        where: {
            id: preferredCustomerId,
        },
    });
    if (customer === null) {
        throw new InvalidIdError(preferredCustomerId, 'Customer');
    }

    const ticketCategory = await prisma.ticketCategory.findUnique({
        where: {
            id: ticketCategoryId,
        },
    });
    if (ticketCategory === null) {
        throw new InvalidIdError(ticketCategoryId, 'TicketCategory');
    }

    const event = await prisma.event.findUnique({
        where: {
            id: eventId,
        },
    });
    if (event === null) {
        throw new InvalidIdError(eventId, 'Event');
    }

    if (ticketCategory.eventId !== event.id) {
        throw new InvalidTicketCategoryError(ticketCategoryId, eventId);
    }

    if (numberOfTickets > event.availableSeats) {
        throw new UnavailableSeatsError(numberOfTickets, event.availableSeats, eventId);
    }

    const order = await prisma.order.create({
        data: {
            ticketCategory: {
                connect: {
                    id: ticketCategoryId,
                },
            },
            customer: {
                connect: {
                    id: preferredCustomerId,
                },
            },
            orderedAt: new Date(),
            numberOfTickets: numberOfTickets,
            totalPrice: ticketCategory.price * numberOfTickets,
        },
        include: {
            ticketCategory: {
                include: {
                    event: {
                        include: {
                            ticketCategories: true,
                            eventType: true,
                            venue: true,
                        },
                    },
                },
            }
        }
    });

    return mapOrder(order);
};

const updateOrder = async (id, ticketCategoryId, numberOfTickets) => {
    const orderId = Number.parseInt(id);
    if (isNaN(orderId)) {
        throw new InvalidIdError(id, 'Order');
    }

    const order = await prisma.order.findUnique({
        where: {
            id: orderId,
        },
        include: {
            ticketCategory: {
                include: {
                    event: true,
                },
            },
        },
    });
    if (order === null) {
        throw new InvalidIdError(orderId, 'Order');
    }

    if (order.customerId !== preferredCustomerId) {
        throw new OwnershipError(preferredCustomerId, orderId);
    }

    if (numberOfTickets <= 0) {
        throw new InvalidNumberOfTicketsError(numberOfTickets);
    }

    const ticketCategory = await prisma.ticketCategory.findUnique({
        where: {
            id: ticketCategoryId,
        },
    });
    if (ticketCategory === null) {
        throw new InvalidIdError(ticketCategoryId, 'TicketCategory');
    }

    const eventId = order.ticketCategory.eventId;
    if (eventId !== ticketCategory.eventId) {
        throw new InvalidTicketCategoryError(ticketCategoryId, eventId);
    }

    const availableSeats = order.ticketCategory.event.availableSeats;
    if (numberOfTickets > availableSeats) {
        throw new UnavailableSeatsError(numberOfTickets, availableSeats, eventId);
    }

    const updatedOrder = await prisma.order.update({
        where: {
            id: orderId,
        },
        data: {
            ticketCategoryId,
            numberOfTickets,
            totalPrice: numberOfTickets * ticketCategory.price,
        },
        include: {
            ticketCategory: {
                include: {
                    event: {
                        include: {
                            ticketCategories: true,
                            eventType: true,
                            venue: true,
                        },
                    },
                },
            }
        },
    });

    return mapOrder(updatedOrder);
};


const deleteOrder = async (id) => {
    const orderId = Number.parseInt(id);
    if (isNaN(orderId)) {
        throw new EntityNotFoundError(id, 'Order');
    }

    const order = await prisma.order.findUnique({
        where: {
            id: orderId,
        },
    });
    if (order === null) {
        throw new EntityNotFoundError(id, 'Order');
    }

    if (order.customerId !== preferredCustomerId) {
        throw new OwnershipError(preferredCustomerId, id);
    }

    await prisma.order.delete({
        where: {
            id: orderId,
        },
    });
};

export default {
    getAllOwnedOrders,
    createOrder,
    updateOrder,
    deleteOrder,
};
