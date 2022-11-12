import express from 'express';
import iconesRouter from './iconesRouter.js';
import traducoesRouter from './traducoesRouter.js';

const router = express.Router();

router.get("/", async (req, res) => {
    res.render("index");
});

router.use('/icones', iconesRouter);
router.use('/traducoes', traducoesRouter);

export default router