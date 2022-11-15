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

const app = Vue.createApp({});

app.use(router)
app.mount('#app');