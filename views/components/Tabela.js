const { FilterMatchMode } = primevue.api;
const { ref, computed } = Vue;
import StatusTraducaoEnum from "/js/statusTraducaoENUM.js";

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

      const menuModelo = computed(() => {
        const status = traducaoSelecionada.value?.status;
        const menu = [];

        if (status !== StatusTraducaoEnum.EXCLUIDO) {
          menu.push({ label: 'Excluir', icon: 'pi pi-fw pi-times', command: () => excluir(traducaoSelecionada) });
        }

        if (status === StatusTraducaoEnum.EDITADO || status === StatusTraducaoEnum.EXCLUIDO) {
          menu.push({ label: 'Desfazer', icon: 'pi pi-fw pi-undo', command: () => desfazer(traducaoSelecionada) })
        }

        return menu
      });

      const corLinha = (linha) => {
        if (linha.status === StatusTraducaoEnum.ADICIONADO) {
          return 'text-primary';
        } else if (linha.status === StatusTraducaoEnum.EXCLUIDO) {
          return 'text-red-500';
        } else if (linha.status === StatusTraducaoEnum.EDITADO) {
          return 'text-green-300';
        }
      }

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
          emit('aoEditar', event);
        }
      }

      const excluir = (event) => {
        emit('aoExcluir', traducaoSelecionada.value);
        traducaoSelecionada.value = null;
      }

      const desfazer = (event) => {
        emit('aoDesfazer', traducaoSelecionada.value);
        traducaoSelecionada.value = null;
      }

      return {
        contextMenu,
        traducaoSelecionada,
        menuModelo,
        pesquisa,
        filtros,
        corLinha,
        aoContextualizarMenuLinha,
        aoFinalizarEdicaoCelula,
        excluir,
      };
    },
  })
}

export default Tabela;