import Home from "/pages/Home.js";
import Icones from "/pages/Icones.js";
import Traducoes from "/pages/Traducoes.js";

const routes = [
  { path: '/', component: () => Home() },
  { path: '/icones', component: () => Icones() },
  { path: '/traducoes', component: () => Traducoes() },
];

const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes,
});

const App = {
  data () {
    return {
      menu: [
        { label: 'Home', icon: 'pi pi-fw pi-home', to: '/' },
        { label: 'Ícones', icon: 'pi pi-box', to: '/icones' },
        { label: 'Traduções', icon: 'pi pi-language', to: '/traducoes' },
      ]
    }
  },
  components: {
    "p-tabmenu": primevue.tabmenu,
  }
}

Vue.createApp(App)
  .use(router)
  .use(primevue.config.default, { ripple: true })
  .use(primevue.toastservice)
  .mount('#app');