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
    },
    data () {
      return {
        traducoesOriginais: [],
        novasTraducoes: [],
        exibirModalTraducao: false,
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
        this.tabela.itens.push({ ...linhaTraducao });
        this.traducoesOriginais.push({ ...linhaTraducao });
      }
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
        const mesmaChave = (item) => {
          const temChave = item.chave === traducao.chave;
          const naoEhMesmaLinha = item.id !== traducao.id;

          if (traducao.acao === 'adicionar') {
            return temChave;
          } else {
            return temChave && naoEhMesmaLinha;
          }
        };

        var contagemChaves = this.tabela.itens.reduce((acumulador, item) => {
          if (mesmaChave(item)) return acumulador + 1;
          else return acumulador;
        }, 0);

        contagemChaves = this.novasTraducoes.reduce((acumulador, item) => {
          if (mesmaChave(item)) return acumulador + 1
          else return acumulador;
        }, contagemChaves);

        return contagemChaves;
      },
      atualizarTraducao (event) {
        const { data, newValue, field } = event;
        const valorAntigo = data[field];
        data[field] = newValue;

        const existeChave = this.existeChave(data);

        if (existeChave) {
          data[field] = valorAntigo;
          return this.toast.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Já existe uma tradução com essa chave',
            life: 3000
          });
        }

        data.acao = 'atualizar';

        const existeTraducao = this.novasTraducoes.find(traducao => traducao.id === data.id)

        if (existeTraducao) {
          existeTraducao[field] = newValue;
        } else {
          this.novasTraducoes.push(data);
        }

        this.toast.add({
          severity: 'success',
          summary: 'Tradução atualizada',
          detail: `A tradução da chave ${data.chave} foi atualizada com sucesso.`,
          life: 3000
        });
      },
      excluirTraducao (traducao) {
        if (traducao.acao === 'adicionar') {
          this.tabela.itens = this.tabela.itens.filter(item => item.id !== traducao.id);
          this.novasTraducoes = this.novasTraducoes.filter(item => item.id !== traducao.id);
        } else {
          traducao.acao = 'excluir';
          this.novasTraducoes.push(traducao);
        }

        this.toast.add({
          severity: 'success',
          summary: 'Tradução excluída',
          detail: `A tradução da chave ${traducao.chave} foi excluída com sucesso.`,
          life: 3000
        });
      },
      adicionarTraducao (traducao) {
        const novaTraducao = { ...traducao, id: traducao.chave, acao: 'adicionar' };
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
        this.novasTraducoes.push(novaTraducao);
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

        if (traducaoOriginal) {
          const traducaoIndex = this.tabela.itens.findIndex(traducao => traducao.id === traducaoOriginal.id);
          traducao.pt = traducaoOriginal.pt;
          traducao.en = traducaoOriginal.en;
          traducao.es = traducaoOriginal.es;
          delete traducao.acao;
          this.tabela.itens[traducaoIndex] = traducao;
        }

        this.novasTraducoes = this.novasTraducoes.filter(traducaoNova => traducaoNova.id !== traducao.id);

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
          body: JSON.stringify(this.novasTraducoes)
        });

        window.location.reload();
      }
    },
  });
}

export default Traducoes;