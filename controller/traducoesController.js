import { CAMINHO_ARQUIVO_TRADUCOES } from '../constants.js';
import fs from 'fs';
import { objetoVazio } from '../public/js/utils.js';

export default {
  getTraducoes: async function () {
    try {
      const arquivos = await fs.promises.readFile(CAMINHO_ARQUIVO_TRADUCOES);
      return JSON.parse(arquivos);
    } catch (e) {
      console.error(e);
      return null
    }
  },
  salvar: async function (novasTraducoes) {
    try {
      const traducoes = await this.getTraducoes();

      Object.keys(novasTraducoes).forEach((idioma) => {
        Object.keys(novasTraducoes[idioma]).forEach((chave) => {
          traducoes[idioma] = objetoVazio(traducoes[idioma]);
          traducoes[idioma][chave] = novasTraducoes[idioma][chave];
        });
      });

      fs.writeFileSync(CAMINHO_ARQUIVO_TRADUCOES, JSON.stringify(traducoes, null, 4));
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  },
  alterar: async function (chavesModificadas) {
    try {
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
    } catch (e) {
      console.error(e);
      return false;
    }
  }
}