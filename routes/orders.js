import express from 'express';
import ordersService from "../services/ordersService.js";

const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        const orders = await ordersService.getAllOwnedOrders();

        return res.status(200).json(orders);
    } catch(err) {
        next(err);
    }
});

router.post('/', async (req, res, next) => {
    try {
        const { eventId, ticketCategoryId, numberOfTickets } = req.body;
        const order = await ordersService.createOrder(eventId, ticketCategoryId, numberOfTickets);

        return res.status(201).json(order);
    } catch (err) {
        next(err);
    }
});

router.patch('/:id', async (req, res, next) => {
    try {
        const { ticketCategoryId, numberOfTickets } = req.body;
        const order = await ordersService.updateOrder(req.params.id, ticketCategoryId, numberOfTickets);

        return res.status(200).json(order);
    } catch (err) {
        next(err);
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        await ordersService.deleteOrder(req.params.id);

        return res.status(204).end();
    } catch (err) {
        next(err);
    }
});

export default router;