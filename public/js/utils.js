function parseData (data) {
  try {
    return JSON.parse(data);
  } catch (e) {
    return null
  }
}

function primeiraLetraMaiuscula (string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function primeiraLetraMinuscula (string) {
  return string.charAt(0).toLowerCase() + string.slice(1);
}

function removerAcentos (string) {
  return string.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
}

function clonarObjeto (objeto) {
  return JSON.parse(JSON.stringify(objeto));
}

function verificaTraducaoIncompleta(traducao) {
  if(!traducao.pt.length || !traducao.en.length || !traducao.es.length){
    return true;
  }

  return false;
}

export {
  parseData,
  primeiraLetraMaiuscula,
  primeiraLetraMinuscula,
  removerAcentos,
  clonarObjeto,
  verificaTraducaoIncompleta
}