export class ApplicationError extends Error {
    constructor(message, status) {
        super();
        Error.captureStackTrace(this, this.constructor);

        this.name = this.constructor.name;
        this.message = message || 'Internal Server Error.';
        this.status = status || 500;
    }
}

export class EntityNotFoundError extends ApplicationError {
    constructor(entityId, entityName) {
        super(`Entity '${entityName}' with id '${entityId}' was not found.`, 404);
    }
}

export class InvalidIdError extends ApplicationError {
    constructor(entityId, entityName) {
        super(`Invalid id '${entityId}' provided for entity '${entityName}'.`, 400);
    }
}

export class InvalidNumberOfTicketsError extends ApplicationError {
    constructor(numberOfTickets) {
        super(`Invalid number of tickets '${numberOfTickets}' provided.`, 400);
    }
}

export class InvalidTicketCategoryError extends ApplicationError {
    constructor(ticketCategoryId, eventId) {
        super(`The TicketCategory with id '${ticketCategoryId}' is not available for the Event with id '${eventId}'.`, 400);
    }
}

export class UnavailableSeatsError extends ApplicationError {
    constructor(numberOfTickets, availableSeats, eventId) {
        super(`Unavailable number of tickets for Event with the id '${eventId}': requested '${numberOfTickets}' tickets, available '${availableSeats}' seats.`, 400);
    }
}

export class OwnershipError extends ApplicationError {
    constructor(customerId, orderId) {
        super(`The Customer with id '${customerId}' is not the owner of the Order with id '${orderId}'.`);
    }
}
