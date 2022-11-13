import { CAMINHO_ARQUIVO_TRADUCOES } from '../constants.js';
import fs from 'fs';
import { objetoVazio } from '../public/js/utils.js';

export default {
    getTraducoes: async function () {
        const arquivos = await fs.promises.readFile(CAMINHO_ARQUIVO_TRADUCOES);
        return JSON.parse(arquivos);
    },
    salvar: async function (novasTraducoes) {
        const traducoes = await this.getTraducoes();

        Object.keys(novasTraducoes).forEach((idioma) => {
            Object.keys(novasTraducoes[idioma]).forEach((chave) => {
                traducoes[idioma] = objetoVazio(traducoes[idioma]);
                traducoes[idioma][chave] = novasTraducoes[idioma][chave];
            });
        });

        fs.writeFileSync(CAMINHO_ARQUIVO_TRADUCOES, JSON.stringify(traducoes, null, 4));
        return true;
    },
    alterar: async function (chavesModificadas) {
        const traducoes = await this.getTraducoes();

        Object.keys(chavesModificadas).forEach((chave) => {
            const { novaChave, acao } = chavesModificadas[chave];
            Object.keys(traducoes).forEach((idioma) => {
                if (acao === 'alterar' && novaChave) {
                    traducoes[idioma] = objetoVazio(traducoes[idioma]);
                    traducoes[idioma][novaChave] = traducoes[idioma][chave];
                }

                delete traducoes[idioma][chave];
            })
        })

        fs.writeFileSync(CAMINHO_ARQUIVO_TRADUCOES, JSON.stringify(traducoes, null, 4));
        return true;
    }
}