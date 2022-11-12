import { CAMINHO_ARQUIVO_TRADUCOES } from '../constants.js';
import fs from 'fs';
import path from 'path';

export default {
    getTraducoes: async () => {
        const arquivos = await fs.promises.readFile(CAMINHO_ARQUIVO_TRADUCOES);

        return JSON.parse(arquivos);
    }
}