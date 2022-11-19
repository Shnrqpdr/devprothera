const { FilterMatchMode } = primevue.api;
const { ref } = Vue;

const Tabela = async () => {
  let template = await fetch("/components/Tabela.html")
  template = await template.text();

  return ({
    template: template,
    components: {
      "p-inputtext": primevue.inputtext,
      "p-datatable": primevue.datatable,
      "p-column": primevue.column,
      "p-contextmenu": primevue.contextmenu,
    },
    props: {
      colunas: { type: Array, required: true },
      itens: { type: Array, required: true },
    },
    setup (props, { emit }) {
      const contextMenu = ref();

      const traducaoSelecionada = ref();

      const menuModelo = ref([
        { label: 'Excluir linha', icon: 'pi pi-fw pi-times', command: () => excluir(traducaoSelecionada) }
      ]);

      const pesquisa = ref("");

      const filtros = ref({
        'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
      });

      const aoContextualizarMenuLinha = (event) => {
        contextMenu.value.show(event.originalEvent);
      };

      const aoFinalizarEdicaoCelula = (event) => {
        const { data, newValue, field } = event;

        if (newValue.trim().length > 0 && newValue !== data[field]) {
          data[field] = newValue;
          emit('aoEditar', event);
        }
      }

      const excluir = (event) => {
        emit('aoExcluir', traducaoSelecionada.value);
        traducaoSelecionada.value = null;
      }

      return {
        contextMenu,
        traducaoSelecionada,
        menuModelo,
        pesquisa,
        filtros,
        aoContextualizarMenuLinha,
        aoFinalizarEdicaoCelula,
        excluir,
      };
    },
  })
}

export default Tabela;