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
      for (const chave in traducoes.pt) {
        const linhaTraducao = {
          id: chave,
          chave,
          pt: traducoes.pt[chave] || '',
          es: traducoes.es[chave] || '',
          en: traducoes.en[chave] || '',
        }
        this.tabela.itens.push(linhaTraducao);
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
      existeTraducao (item) {
        return this.novasTraducoes.find(traducao => (traducao.chave === item.chave || traducao.id === item.id))
      },
      atualizarTraducao (event) {
        const { data, newValue, field } = event;
        const existeTraducao = this.existeTraducao(data);

        data.acao = 'atualizar';

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
        traducao.acao = 'excluir';
        this.novasTraducoes.push(traducao);
        this.tabela.itens = this.tabela.itens.filter((linhaTraducao) => linhaTraducao.id !== traducao.id);
        this.toast.add({
          severity: 'success',
          summary: 'Tradução excluída',
          detail: `A tradução da chave ${traducao.chave} foi excluída com sucesso.`,
          life: 3000
        });
      },
      adicionarTraducao (traducao) {
        const novaTraducao = { ...traducao, id: traducao.chave, acao: 'adicionar' };
        const existeTraducao = this.existeTraducao(novaTraducao) || this.tabela.itens.find(traducao => traducao.id === novaTraducao.id);

        if (existeTraducao)
          return this.toast.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Já existe uma tradução com essa chave',
            life: 3000
          });

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