import dotenv from 'dotenv';
dotenv.config();

const DIRETORIO_ICONES = process.env.DIRETORIO_ICONES;
const CAMINHO_ARQUIVO_TRADUCOES = process.env.CAMINHO_ARQUIVO_TRADUCOES;

export { DIRETORIO_ICONES, CAMINHO_ARQUIVO_TRADUCOES }