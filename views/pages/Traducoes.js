import ModalTraducao from '/components/ModalTraducao.js';
import Tabela from '/components/Tabela.js';

const Traducoes = async () => {
  let template = await fetch("/pages/Traducoes.html")
  template = await template.text();

  return ({
    template: template,
    components: {
      "ModalTraducao": await ModalTraducao(),
      "Tabela": await Tabela(),
    },
    data () {
      return {
        traducoes: [],
        novasTraducoes: {},
        chavesModificadas: {},
        tabela: {
          columns: [
            { label: 'ID', field: 'id', align: 'center', filterable: false },
            { label: 'Username', field: 'user.username' },
            { label: 'First Name', field: 'user.first_name' },
            { label: 'Last Name', field: 'user.last_name' },
            { label: 'Email', field: 'user.email', align: 'right', sortable: false }
          ],
          rows: window.rows
        }
      }
    },
    mounted () {
      this.traducoes = this.buscarTraducoes();
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
      adicionarTraducao (dados) {
        console.log(dados);
      }
    }
  });
}

export default Traducoes;