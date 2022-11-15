import { primeiraLetraMaiuscula, primeiraLetraMinuscula, removerAcentos } from '/js/utils.js';

const ModalTraducao = async () => {
    let template = await fetch("/components/ModalTraducao.html")
    template = await template.text();

    return ({
        template: template,
        data() {
            return {
                modal: null,
                chave: '',
                pt: '',
                en: '',
                es: '',
            }
        },
        mounted() {
            this.modal = new bootstrap.Modal(document.getElementById('modalTraducao'));
            this.chave = '';
            this.pt = '';
            this.en = '';
            this.es = '';
        },
        methods: {
            adicionar() {
                if(!(this.chave && this.pt)) return;
                this.$emit('adicionar', { chave: this.chave, pt: this.pt, en: this.en, es: this.es, })
                this.modal.hide();
            },
            gerarChaveAutomatica() {
                let mensagem = primeiraLetraMinuscula(this.pt).split(' ');
                for (let i = 1; i < mensagem.length; i++) {
                    mensagem[i] = primeiraLetraMaiuscula(mensagem[i]);
                }
                this.chave = removerAcentos(mensagem.join(''));
            }
        }
    })
}

export default ModalTraducao;