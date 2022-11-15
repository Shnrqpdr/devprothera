const Tabela = async () => {
  let template = await fetch("/components/Tabela.html")
  template = await template.text();

  return ({
    template: template,
    components: {
      EasyDataTable: window["vue3-easy-data-table"]
    },
    props: {
      cabecalho: { type: Array, required: true },
      itens: { type: Array, required: true },
    },
    data () {
      return {
        pesquisa: '',
      }
    },
    methods: {
      exibirInformacoesLinha (item) {
        console.log(item);
        this.$emit('linha-clicada', item);
      },
      editar (item) {
        this.$emit('editar', item);
      },
      excluir (item) {
        this.$emit('excluir', item);
      }
    }
  })
}

export default Tabela;