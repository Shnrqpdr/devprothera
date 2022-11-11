import express from 'express';
import iconesRouter from './iconesRouter.js';

const router = express.Router();

router.get("/", async (req, res) => {
    res.render("index");
});

router.use('/icones', iconesRouter);

export default router