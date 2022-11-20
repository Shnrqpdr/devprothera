import StatusTraducaoEnum from '/js/statusTraducaoENUM.js';
import { clonarObjeto } from '/js/utils.js';
import ModalTraducao from '/components/ModalTraducao.js';
import Tabela from '/components/Tabela.js';
const { useToast } = primevue.usetoast;

const Traducoes = async () => {
  let template = await fetch("/pages/Traducoes.html");
  template = await template.text();

  return ({
    template: template,
    components: {
      "ModalTraducao": await ModalTraducao(),
      "Tabela": await Tabela(),
      "p-button": primevue.button,
      "p-toast": primevue.toast,
      "p-multiselect": primevue.multiselect
    },
    data () {
      return {
        exibirModalTraducao: false,
        status: [
          { name: StatusTraducaoEnum.ADICIONADO, code: StatusTraducaoEnum.ADICIONADO },
          { name: StatusTraducaoEnum.EXCLUIDO, code: StatusTraducaoEnum.EXCLUIDO },
          { name: StatusTraducaoEnum.EDITADO, code: StatusTraducaoEnum.EDITADO }
        ],
        statusSelecionados: [],
        toast: useToast(),
        tabela: {
          colunas: [
            { header: "Chave", field: "chave", },
            { header: "Português", field: "pt", },
            { header: "Inglês", field: "en", },
            { header: "Espanhol", field: "es", },
          ],
          itens: [],
        }
      }
    },
    computed: {
      traducoesAlteradas () {
        const traducoesAlteradas = this.tabela.itens.filter(traducao => traducao.status);
        return traducoesAlteradas;
      },
      itensTabela () {
        const arrayFiltroStatus = this.statusSelecionados.map(status => status.code);

        return this.tabela.itens.filter(traducao => {
          return arrayFiltroStatus.length ? arrayFiltroStatus.includes(traducao.status) : traducao;
        });
      }
    },
    async mounted () {
      const traducoes = await this.buscarTraducoes();
      for (const chave in traducoes?.pt) {
        const linhaTraducao = {
          id: chave,
          chave,
          pt: traducoes.pt[chave] || '',
          es: traducoes.es[chave] || '',
          en: traducoes.en[chave] || '',
        }
        this.tabela.itens.push(clonarObjeto(linhaTraducao));
      }
      this.traducoesOriginais = clonarObjeto(this.tabela.itens);
    },
    methods: {
      async buscarTraducoes () {
        const response = await fetch('/api/traducoes', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
        });

        const { traducoes } = await response.json();
        return traducoes;
      },
      existeChave (traducao) {
        return this.tabela.itens.reduce((acumulador, item) => {
          if (traducao.status === StatusTraducaoEnum.ADICIONADO) {
            return item.chave === traducao.chave ? acumulador + 1 : acumulador;
          } else {
            return item.chave === traducao.chave && item.id !== traducao.id ? acumulador + 1 : acumulador;
          }
        }, 0);
      },
      atualizarTraducao (event) {
        const { data: traducao, newValue: novoValor, field: coluna } = event;
        const valorAntigo = traducao[coluna];
        traducao[coluna] = novoValor;

        const existeChave = this.existeChave(traducao);

        if (existeChave) {
          traducao[coluna] = valorAntigo;
          return this.toast.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Já existe uma tradução com essa chave',
            life: 3000
          });
        }

        traducao.status = StatusTraducaoEnum.EDITADO;
        traducao[coluna] = novoValor;

        this.toast.add({
          severity: 'success',
          summary: 'Tradução atualizada',
          detail: `A tradução da chave ${traducao.chave} foi atualizada com sucesso.`,
          life: 3000
        });
      },
      excluirTraducao (traducao) {
        if (traducao.status === StatusTraducaoEnum.ADICIONADO) {
          this.tabela.itens = this.tabela.itens.filter(item => item.id !== traducao.id);
        }

        traducao.status = StatusTraducaoEnum.EXCLUIDO;
        this.toast.add({
          severity: 'success',
          summary: 'Tradução excluída',
          detail: `A tradução da chave ${traducao.chave} foi excluída com sucesso.`,
          life: 3000
        });
      },
      adicionarTraducao (traducao) {
        const novaTraducao = { ...traducao, id: traducao.chave, status: StatusTraducaoEnum.ADICIONADO };
        const existeChave = this.existeChave(novaTraducao);

        if (existeChave) {
          return this.toast.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Já existe uma tradução com essa chave',
            life: 3000
          });
        }

        this.tabela.itens.unshift(novaTraducao);
        this.toast.add({
          severity: 'success',
          summary: 'Tradução inserida com sucesso',
          detail: 'Uma nova tradução foi inserida',
          life: 3000
        });
        this.exibirModalTraducao = false;
      },
      desfazerAlteracao (traducao) {
        const traducaoOriginal = this.traducoesOriginais.find(traducaoOriginal => traducaoOriginal.id === traducao.id);
        const traducaoIndex = this.tabela.itens.findIndex(traducao => traducao.id === traducaoOriginal.id);
        this.tabela.itens[traducaoIndex] = clonarObjeto(traducaoOriginal);
        this.toast.add({
          severity: 'success',
          summary: 'Alteração desfeita',
          detail: `A tradução ${traducao.chave} voltou ao estado original.`,
          life: 3000
        });
      },
      async salvarNovasTraducoes () {
        await fetch('/api/traducoes', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.traducoesAlteradas)
        });

        window.location.reload();
      }
    },
  });
}

export default Traducoes;