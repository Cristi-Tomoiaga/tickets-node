import express from 'express';
import ordersService from "../services/ordersService.js";

const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        const orders = await ordersService.getAllOwnedOrders();

        res.status(200).json(orders);
    } catch(err) {
        next(err);
    }
});

router.post('/', async (req, res) => {

});

router.patch('/:id', async (req, res) => {

});

router.delete('/:id', async (req, res) => {

});

export default router;