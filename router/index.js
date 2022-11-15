import express from 'express';
import iconesRouter from './iconesRouter.js';
import traducoesRouter from './traducoesRouter.js';

const router = express.Router();

router.use('/api/icones', iconesRouter);
router.use('/api/traducoes', traducoesRouter);
router.get("*", async (req, res) => {
    res.sendFile('index.html', { root: './views/' });
});

export default router