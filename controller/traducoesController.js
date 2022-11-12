import { CAMINHO_ARQUIVO_TRADUCOES } from '../constants.js';
import fs from 'fs';
import path from 'path';

export default {
    getTraducoes: async () => {
        const arquivos = await fs.promises.readFile(CAMINHO_ARQUIVO_TRADUCOES);
        return JSON.parse(arquivos);
    },
    salvar: async (novasTraducoes) => {
        const arquivos = await fs.promises.readFile(CAMINHO_ARQUIVO_TRADUCOES);
        const traducoes = JSON.parse(arquivos);

        Object.keys(novasTraducoes).forEach((idioma) => {
            Object.keys(novasTraducoes[idioma]).forEach((chave) => {
                traducoes[idioma][chave] = novasTraducoes[idioma][chave];
            });
        });

        fs.writeFileSync(CAMINHO_ARQUIVO_TRADUCOES, JSON.stringify(traducoes, null, 4));
        return true;
    },
    excluir: async () => {
    },
    alterarChaves: async () => {
    }
}