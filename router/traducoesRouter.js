import express from 'express';
import traducoesController from '../controller/traducoesController.js';

const traducoesRouter = express.Router();

traducoesRouter.get('/', async (req, res) => {
    const traducoes = await traducoesController.getTraducoes();
    res.render('traducoes', {traducoes})
});

export default traducoesRouter
