import { parseData, primeiraLetraMaiuscula, primeiraLetraMinuscula, removerAcentos } from './utils.js';

export default () => {
    if (!/traducoes/gi.test(window.location.href)) return;

    const traducoes = parseData($("#traducoes").text());
    const chavesMensagensPt = Object.keys(traducoes.pt);
    const chavesMensagensEs = Object.keys(traducoes.es);
    const chavesMensagensEn = Object.keys(traducoes.en);

    const traducoesIncompletas = [];
    const novasTraducoes = {};
    const chavesModificadas = {}

    const formularioTraducao = {
        gerarChaveAutomatica(idInputModelo) {
            let mensagem = primeiraLetraMinuscula($(idInputModelo).val()).split(' ');
            for (let i = 1; i < mensagem.length; i++) {
                mensagem[i] = primeiraLetraMaiuscula(mensagem[i]);
            }
            return removerAcentos(mensagem.join(''));
        },
        serialize() {
            const traducao = {}
            $("#formularioNovaTraducao input").each(function () {
                const name = $(this).attr('name');
                const value = $(this).val();
                traducao[name] = value;
            });
            return traducao;
        }
    }

    const verificarTraducao = function (traducao) {
        $(Object.keys(traducao)).each((indice, idioma) => {
            const mensagem = traducao[idioma];
            if (mensagem === '') traducoesIncompletas.push({ chave: traducao.chave, idioma })
        });
    }

    const adicionarNovaTraducao = function (params) {
        const { coluna, chave, mensagem } = params;

        if (novasTraducoes[coluna]) {
            novasTraducoes[coluna][chave] = mensagem;
        } else {
            novasTraducoes[coluna] = { [chave]: mensagem }
        }

        $("#tabela").trigger("traducao:alterada", params);
    }

    const modificarChaves = function (params) {
        const { chave, novaChave, acao } = params;
        chavesModificadas[chave] = { novaChave, acao };
        $("#tabela").trigger("traducao:alterada", params);
    }

    const excluirTraducoes = function (params) {
        tabela.rows({ selected: true }).indexes().each(function (rowIdx) {
            const linha = tabela.row(rowIdx);
            const dados = linha.data();
            $(linha.node()).addClass('text-danger');
            modificarChaves({ chave: dados.chave, acao: 'excluir' });
        });
        desmarcarTodos()
    }

    const inserirNovaTraducao = function () {
        const traducao = formularioTraducao.serialize();

        if (!traducao.chave) return;
        if (existeChaveDuplicada(traducao.chave)) return alert('Chave já existe');

        verificarTraducao(traducao);

        const novaLinha = tabela.row.add(traducao).node();
        $(novaLinha).addClass('text-primary');

        $.each(traducao, function(coluna, mensagem){
            if(mensagem && coluna !== 'chave'){
                adicionarNovaTraducao({coluna, chave: traducao.chave, mensagem});
            }
        });
        
        tabela.draw(false);
        tabela.page.jumpToData( traducao.chave, 1 );

        $("#modalTraducao input").val('');
        $("#modalTraducao").modal('hide');
    }

    const existeChaveDuplicada = function(chave) {
        const novasChavesPt = Object.keys(novasTraducoes.pt || {});
        return chavesMensagensPt.includes(chave) || novasChavesPt.includes(chave)
    }

    const salvarTraducoes = function () {
        $.ajax({
            url: '/traducoes',
            method: 'POST',
            data: JSON.stringify({ novasTraducoes, chavesModificadas }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function () {
                location.reload();
            }
        });
    }

    const editarCelula = function ({ td, texto, data }) {
        if ($(td).find('input').length) return;

        const input = $(`<input class="form-control" type="text" value="${texto}"/>`);
        $(td).html(input);

        $(input).off().focus().focusout(function () {
            const novoValorCelula = $(this).val();
            $(td).html(novoValorCelula);

            if (novoValorCelula === texto) return;

            const coluna = $(td).attr("data-coluna");
            const chave = data.chave;
            const antigoValor = coluna === 'chave' ? chave : traducoes[coluna][chave]

            if (antigoValor !== novoValorCelula) {
                $(td).addClass('text-success');
            } else {
                $(td).removeClass('text-success');
            }

            if (coluna === 'chave') {
                modificarChaves({ chave, novaChave: novoValorCelula, acao: 'alterar' });
            } else {
                adicionarNovaTraducao({ coluna, chave, mensagem: novoValorCelula });
            }
        })
    }

    const verificarLinhasSelecionadas = function () {
        const qtdLinhasSelecionadas = tabela.rows({ selected: true }).count();
        if (qtdLinhasSelecionadas > 0) {
            $("#btnExcluir, #btnDesmarcar").show();
        } else {
            $("#btnExcluir, #btnDesmarcar").hide();
        }
    }

    const desmarcarTodos = function () {
        tabela.rows().deselect();
    }

    var tabela = $("#tabela").DataTable({
        colReorder: { fixedColumnsLeft: 2 },
        language: { url: '/js/plugins/datatables_pt-BR.json' },
        select: { style: 'multi', selector: 'td:first-child' },
        columns: [
            { title: '', data: null, render() { return '' } },
            { title: 'Chave', data: 'chave', name: 'chave' },
            { title: 'PT', data: 'pt', name: 'pt' },
            { title: 'EN', data: 'en', name: 'en' },
            { title: 'ES', data: 'es', name: 'es' }
        ],
        columnDefs: [
            { orderable: false, className: 'select-checkbox', targets: 0 },
            {
                targets: [1, 2, 3, 4],
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
            tabela.on('select deselect', function () {
                verificarLinhasSelecionadas();
            });
        },
        createdRow: (row, data) => {
            $(row).attr("id", data.chave);
        }
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

    $("#tabela").on("traducao:alterada", function (e, params) {
        $("#btnSalvar").show();
    });

    $("#btnSalvar").click(salvarTraducoes);

    $("#btnDesmarcar").click(desmarcarTodos);

    $("#btnExcluir").click(excluirTraducoes);

    $("#btnInserirTraducao").click(inserirNovaTraducao);

    $("#inputPt").on('input', function () {
        $("#inputChave").val(formularioTraducao.gerarChaveAutomatica("#inputPt"))
    })

    console.log('traducoesIncompletas', traducoesIncompletas)
}