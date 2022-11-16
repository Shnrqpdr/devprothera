import { primeiraLetraMaiuscula, primeiraLetraMinuscula, removerAcentos } from '/js/utils.js';

const ModalTraducao = async () => {
  let template = await fetch("/components/ModalTraducao.html")
  template = await template.text();

  return ({
    template: template,
    props: {
      traducao: { type: Object, default: null },
    },
    data () {
      return {
        modal: null,
        chave: '',
        pt: '',
        en: '',
        es: '',
      }
    },
    mounted () {
      this.modal = new bootstrap.Modal(document.getElementById('modalTraducao'));

      document.getElementById('modalTraducao').addEventListener('hidden.bs.modal', () => {
        this.$emit('fechado');
      });
    },
    methods: {
      salvar () {
        if (!(this.chave && this.pt)) return;
        this.$emit('salvar', {
          id: this.traducao?.id,
          chave: this.chave,
          pt: this.pt,
          en: this.en,
          es: this.es,
        });
        this.modal.hide();
      },
      gerarChaveAutomatica () {
        let mensagem = primeiraLetraMinuscula(this.pt).split(' ');
        for (let i = 1; i < mensagem.length; i++) {
          mensagem[i] = primeiraLetraMaiuscula(mensagem[i]);
        }
        this.chave = removerAcentos(mensagem.join(''));
      }
    },
    watch: {
      traducao: {
        handler (traducao) {
          this.chave = this.traducao?.chave || '';
          this.pt = this.traducao?.pt || '';
          this.en = this.traducao?.en || '';
          this.es = this.traducao?.es || '';

          if (traducao) {
            this.modal?.show();
          }
        },
        deep: true,
        immediate: true,
      }
    }
  })
}

export default ModalTraducao;