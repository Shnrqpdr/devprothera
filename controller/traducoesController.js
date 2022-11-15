import fs from 'fs'; 
import { CAMINHO_ARQUIVO_TRADUCOES } from '../constants.js';

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

      novasTraducoes.forEach(novaTraducao => {
        const { id, chave, pt, es, en, acao } = novaTraducao;
        
        if (acao === 'excluido' || id !== chave) {
          delete traducoes.pt[id];
          delete traducoes.es[id];
          delete traducoes.en[id];
        } 

        traducoes.pt[chave] = pt;
        traducoes.es[chave] = es;
        traducoes.en[chave] = en;
      });

      fs.writeFileSync(CAMINHO_ARQUIVO_TRADUCOES, JSON.stringify(traducoes, null, 4));
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  },
}