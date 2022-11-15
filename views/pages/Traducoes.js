const Traducoes = async () => {
    let template = await fetch("/pages/Traducoes.html")
    template = await template.text();
    return ({
      template: template,
      setup() {
        
      }
    })
  }
  
  export default Traducoes;