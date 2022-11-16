import ModalTraducao from '/components/ModalTraducao.js';
import Tabela from '/components/Tabela.js';

const Traducoes = async () => {
  let template = await fetch("/pages/Traducoes.html");
  template = await template.text();

  return ({
    template: template,
    components: {
      "ModalTraducao": await ModalTraducao(),
      "Tabela": await Tabela(),
    },
    data () {
      return {
        traducao: null,
        novasTraducoes: [],
        traducoesIncompletas: [],
        tabela: {
          cabecalho: [
            { text: "Chave", value: "chave", },
            { text: "Português", value: "pt" },
            { text: "Inglês", value: "en" },
            { text: "Espanhol", value: "es" },
            { text: "Opções", value: "opcoes", sortable: false },
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
        this.verificarTraducao(linhaTraducao);
        this.tabela.itens.push(linhaTraducao);
      }
      console.log("incompletas", this.traducoesIncompletas)
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
      modalTraducaoFechado () {
        this.traducao = null;
      },
      verificarTraducao (traducao) {
        Object.keys(traducao).forEach((idioma) => {
          const mensagem = traducao[idioma];
          if (mensagem === '') this.traducoesIncompletas.push({ chave: traducao.chave, idioma })
        });
      },
      excluirTraducao (traducao) {
        const traducaoItem = this.tabela.itens.find((linhaTraducao) => linhaTraducao.id === traducao.id);
        traducaoItem.acao = 'excluido';
        const traducaoNova = this.novasTraducoes.find((linhaTraducao) => linhaTraducao.id === traducao.id);
        if (traducaoNova) traducaoNova.acao = 'excluido';
        else this.novasTraducoes.push(traducaoItem);
      },
      editarTraducao (traducao) {
        this.traducao = traducao;
      },
      salvarTraducao (traducao) {
        if (traducao.id) {
          const traducaoItem = this.tabela.itens.find((linhaTraducao) => linhaTraducao.id === traducao.id);
          traducaoItem.chave = traducao.chave;
          traducaoItem.pt = traducao.pt;
          traducaoItem.es = traducao.es;
          traducaoItem.en = traducao.en;

          const novaTraducao = this.novasTraducoes.find((linhaTraducao) => linhaTraducao.id === traducao.id);
          if (novaTraducao) {
            novaTraducao.chave = traducao.chave;
            novaTraducao.pt = traducao.pt;
            novaTraducao.es = traducao.es;
            novaTraducao.en = traducao.en;
          } else {
            this.novasTraducoes.push(traducao);
          }
        } else {
          const novaTraducao = { ...traducao, id: traducao.chave };
          this.tabela.itens.unshift(novaTraducao);
          this.novasTraducoes.push(novaTraducao);
        }

        this.verificarTraducao(traducao);
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
    }
  });
}

export default Traducoes;