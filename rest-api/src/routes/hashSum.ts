import express from 'express';
import { HashSumController } from '../controller/hashSum.controller.js';

const controller = new HashSumController();

const router = express.Router();

router.post(`/hashSum`, controller.createCrackCommand);

export default router;