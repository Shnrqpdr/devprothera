import { DIRETORIO_ICONES } from '../constants.js';
import fs from 'fs';
import path from 'path';

export default {
  getIcones: async () => {
    try {
      const icones = [];

      const arquivos = await fs.promises.readdir(DIRETORIO_ICONES);

      for (const arquivo of arquivos) {
        icones.push({
          nomeArquivo: arquivo.replace('.svg', ''),
          svg: await fs.promises.readFile(path.join(DIRETORIO_ICONES, arquivo), 'utf8')
        })
      }

      return icones;
    } catch (e) {
      console.error(e);
      return [];
    }
  }
}