import prisma from '../prisma/client.js';
import {mapOrders} from "../prisma/utils.js";

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

};

const updateOrder = async (id, ticketCategoryId, numberOfTickets) => {

};


const deleteOrder = async (id) => {

};

export default {
    getAllOwnedOrders,
    createOrder,
    updateOrder,
    deleteOrder,
};
