export default () => {
    if (!/traducoes/gi.test(window.location.href)) return;

    function parseData(data) {
        try {
            return JSON.parse(data);
        } catch (e) {
            return null
        }
    }

    const traducoes = parseData($("#traducoes").text());
    const chavesMensagensPt = Object.keys(traducoes.pt);
    const chavesMensagensEs = Object.keys(traducoes.es);
    const chavesMensagensEn = Object.keys(traducoes.en);

    const traducoesIncompletas = [];
    const novasTraducoes = {};
    const chavesModificadas = {}

    const verificarTraducao = function (traducao) {
        $(Object.keys(traducao)).each((indice, idioma) => {
            const mensagem = traducao[idioma];
            if (mensagem === '') traducoesIncompletas.push({ chave: traducao.chave, idioma })
        });
    }

    const adicionarNovaTraducao = function (params){
        const {idioma, chave, mensagem} = params;

        if(novasTraducoes[idioma]){
            novasTraducoes[idioma][chave] = mensagem;
        } else {
            novasTraducoes[idioma] = {[chave]: mensagem}
        }

        $("#tabela").trigger("traducao:alterada", params);
    }

    const modificarChaves = function (params) {
        const {idioma, chave, novaChave, acao} = params;
        const dados = { novaChave, acao }

        if(chavesModificadas[idioma]){
            chavesModificadas[idioma][chave] = dados;
        } else {
            chavesModificadas[idioma] = {[chave]: dados}
        }

        $("#tabela").trigger("traducao:alterada", params);
    }

    const salvarTraducoes = function() {
        console.log(novasTraducoes)
        $.ajax({
            url: '/traducoes',
            method: 'POST',
            data: JSON.stringify(novasTraducoes),
            contentType:"application/json; charset=utf-8",
            dataType:"json",
            success: function(){
                location.reload();
            }
        });
    }

    const editarCelula = function({ td, texto, data }) {
        if($(td).find('input').length) return;

        const input = $(`<input class="form-control" type="text" value="${texto}"/>`);
        $(td).html(input);

        $(input).off().focus().focusout(function() {
            const novoValorCelula = $(this).val();
            $(td).html(novoValorCelula);
            
            if(novoValorCelula === texto) return;

            const coluna = $(td).attr("data-coluna");
            const chave = data.chave;

            if(traducoes[coluna][chave] !== novoValorCelula) {
                $(td).addClass('text-success');
            } else {
                $(td).removeClass('text-success');
            }

            if(coluna === 'chave') {
                
            } else {
                adicionarNovaTraducao({idioma: coluna, chave, mensagem: novoValorCelula});
            }
        })
    }

    const verificarLinhasSelecionadas = function() {
        const qtdLinhasSelecionadas = tabela.rows( { selected: true } ).count();
        if(qtdLinhasSelecionadas > 0) {
            $("#btnExcluir, #btnDesmarcar").show();
        }else{
            $("#btnExcluir, #btnDesmarcar").hide();
        }
    }

    const desmarcarTodos = function() {
        tabela.rows.deselect();
    }

    var tabela = $("#tabela").DataTable({
        colReorder: { fixedColumnsLeft: 2 },
        language: { url: '/js/plugins/datatables_pt-BR.json' },
        select: { style: 'multi', selector: 'td:first-child' },
        columns: [
            { title: '', data: null, render() { return '' } },
            { title: 'Chave', data: 'chave' },
            { title: 'PT', data: 'pt', name: 'pt' },
            { title: 'EN', data: 'en', name: 'en' },
            { title: 'ES', data: 'es', name: 'es' }
        ],
        columnDefs: [
            { orderable: false, className: 'select-checkbox', targets: 0 },
            {
                targets: [1,2,3,4],
                createdCell: (td, texto, rowData, row, col) => {
                    const colunas = tabela.settings().init().columns;
                    let coluna = colunas[col].name
                    $(td).attr("data-coluna", coluna)
                    $(td).dblclick(() => {
                        editarCelula({ td, texto: $(td).text(), data: rowData });
                    })
                }  
            }
        ],
        initComplete: () => {
            tabela.on( 'select deselect', function ( e, dt, type, indexes ) {
                verificarLinhasSelecionadas();
            });
        },
        createdRow: (row, data) => {
            $(row).attr("id", data.chave);
        }
    });

    $("#tabela").on("traducao:alterada", function(e, params) {
        $("#btnSalvar").show();
    });

    $(chavesMensagensPt).each((indice, chave) => {
        const linhaTraducao = {
            chave,
            pt: traducoes.pt[chave] || '',
            es: traducoes.es[chave] || '',
            en: traducoes.en[chave] || '',
        }
        verificarTraducao(linhaTraducao);
        tabela.row.add(linhaTraducao).draw(false);
    });

    $("#btnSalvar").click(salvarTraducoes);

    $("#btnDesmarcar").click(desmarcarTodos);

    console.log('traducoesIncompletas', traducoesIncompletas)
}