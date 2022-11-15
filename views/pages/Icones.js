const Icones = async () => {
    let template = await fetch("/pages/Icones.html");
    template = await template.text();

    return ({
        template: template,
        data() {
            return {
                pesquisa: '',
                icones: [],
            }
        },
        computed: {
            iconesFiltrados() {
                const regex = new RegExp(this.pesquisa, 'i');
                const iconesFiltrados = this.icones.filter((icone) => {
                    const { nomeArquivo } = icone;
                    const match = regex.test(nomeArquivo);
                    return this.pesquisa === '' || match
                });
                return iconesFiltrados
            }
        },
        async mounted() {
            const response = await fetch('/api/icones', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
            });

            const { icones } = await response.json();
            this.icones = icones;
        },
    });
}

export default Icones;