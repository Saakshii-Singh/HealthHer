import express from 'express';
import { savePeriod,getPeriod } from '../controllers/periodController.js';

const router = express.Router();

router.post("/", savePeriod);
router.get("/:userId", getPeriod);

export default router;