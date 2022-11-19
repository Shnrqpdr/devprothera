import { primeiraLetraMaiuscula, primeiraLetraMinuscula, removerAcentos } from '/js/utils.js';

const ModalTraducao = async () => {
  let template = await fetch("/components/ModalTraducao.html")
  template = await template.text();

  return ({
    template: template,
    components: {
      "p-dialog": primevue.dialog,
      "p-button": primevue.button,
      "p-inputtext": primevue.inputtext,
    },
    props: {
      exibir: { type: Boolean, required: true },
      traducao: { type: Object, default: null },
    },
    data () {
      return {
        chave: '',
        pt: '',
        en: '',
        es: '',
      }
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
      },
      gerarChaveAutomatica () {
        let mensagem = primeiraLetraMinuscula(this.pt).split(' ');
        for (let i = 1; i < mensagem.length; i++) {
          mensagem[i] = primeiraLetraMaiuscula(mensagem[i]);
        }
        this.chave = removerAcentos(mensagem.join(''));
      },
      fechar () {
        this.$emit('fechar');
      }
    },
    watch: {
      exibir (valor) {
        if (!valor) {
          this.chave = '';
          this.pt = '';
          this.en = '';
          this.es = '';
        }
      }
    }
  });
}

export default ModalTraducao;