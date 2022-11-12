import express from 'express';
import traducoesController from '../controller/traducoesController.js';

const traducoesRouter = express.Router();

traducoesRouter.get('/', async (req, res) => {
    const traducoes = await traducoesController.getTraducoes();
    res.render('traducoes', {traducoes})
});

traducoesRouter.post('/', async (req, res) => {
    await traducoesController.salvar(req.body);
    res.json({success : "Updated Successfully", status : 200});
});

export default traducoesRouter
