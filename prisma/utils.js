import {Prisma} from "@prisma/client";

const mapTicketCategory = (ticketCategory) => {
    return {
        id: ticketCategory.id,
        description: ticketCategory.description,
        price: new Prisma.Decimal(ticketCategory.price).toNumber(),
    };
};

const mapTicketCategories = (ticketCategories) => {
    return ticketCategories.map(mapTicketCategory);
};

export const mapEvent = (event) => {
    return {
        id: event.id,
        description: event.description,
        name: event.name,
        startDate: event.startDate,
        endDate: event.endDate,
        image: event.imageUrl,
        availableSeats: event.availableSeats,
        type: event.eventType.name,
        venue: event.venue,
        ticketCategories: mapTicketCategories(event.ticketCategories),
    };
};

export const mapEvents = (events) => {
  return events.map(mapEvent);
};

export const mapOrder = (order) => {
    return {
        id: order.id,
        timestamp: order.orderedAt,
        ticketCategory: mapTicketCategory(order.ticketCategory),
        numberOfTickets: order.numberOfTickets,
        totalPrice: new Prisma.Decimal(order.totalPrice).toNumber(),
        event: mapEvent(order.ticketCategory.event),
    };
};

export const mapOrders = (orders) => {
    return orders.map(mapOrder);
};
