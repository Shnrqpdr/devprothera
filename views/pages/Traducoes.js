import ModalTraducao from '/components/ModalTraducao.js';

const Traducoes = async () => {
  let template = await fetch("/pages/Traducoes.html")
  template = await template.text();

  return ({
    template: template,
    components: {
      "ModalTraducao": await ModalTraducao()
    },
    data() {
      return {
        traducoes: [],
        novasTraducoes: {},
        chavesModificadas: {}
      }
    },
    mounted() {
      this.traducoes = this.buscarTraducoes();
    },
    methods: {
      async buscarTraducoes() {
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
      adicionarTraducao(dados) {
        console.log(dados);
      }
    }
  });
}

export default Traducoes;