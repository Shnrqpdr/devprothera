export default () => {
    if(!/traducoes/gi.test(window.location.href)) return;

    function parseData(data){
        try {
            return JSON.parse(data);
        } catch (e) {
            return null
        }
    }

    const traducoes = parseData($("#traducoes").text());

    const tabela = $("#tabela").DataTable({
        language: {
            url: '/js/plugins/datatables_pt-BR.json'
        },
        columns: [
            { title: 'Chave', data: 'chave' },
            { title: 'PT', data: 'pt' },
            { title: 'EN', data: 'en' },
            { title: 'ES', data: 'es'}
        ]
    })

    const idiomas = ['pt', 'en', 'es'];
    const chavesMensagens = Object.keys(traducoes[idiomas[0]]);
    
    $(chavesMensagens).each((indice, chave) => {
        tabela.row.add({ 
            chave, 
            pt: traducoes.pt[chave] || '',
            es: traducoes.es[chave] || '',
            en: traducoes.en[chave] || '',
        }).draw(false);
    })
}