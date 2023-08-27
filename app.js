import 'dotenv/config';
import express from 'express';
import cors from 'cors';

const app = express();
const port = process.env.EXPRESS_PORT || 3000;

app.use(cors());
app.use(express.json());

app.listen(port, () => {
    console.log(`Tickets Management Express Server has started on port ${port}`);
});
