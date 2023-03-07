import express, { json } from 'express';
import { HashSumRouter } from '../routes/index.js';

const app = express();

app.use(json());
app.use(HashSumRouter);

export default app;