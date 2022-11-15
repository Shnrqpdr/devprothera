const Home = async () => {
  let template = await fetch("/pages/Home.html")
  template = await template.text();
  return ({
    template: template,
    setup() {
      
    }
  })
}

export default Home;