import express from 'express';
import eventService from '../services/eventsService.js';

const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        const { eventName, venueLocation, eventType } = req.query;
        const events = await eventService.getAllEvents(eventName, venueLocation, eventType);

        return res.status(200).json(events);
    } catch (err) {
        next(err);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const event = await eventService.getEventById(req.params.id);

        return res.status(200).json(event);
    } catch (err) {
        next(err);
    }
});

export default router;
