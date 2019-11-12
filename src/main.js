import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/store'
import Vuelidate from 'vuelidate';
import TextareaAutosize from "vue-textarea-autosize";
import VueTimeago from "vue-timeago";


Vue.config.productionTip = false;
Vue.use(Vuelidate);
export const eventBus = new Vue();
Vue.use(TextareaAutosize);
Vue.use(VueTimeago, {
    name: "Timeago", // Component name, `Timeago` by default
    locale: "en" // Default locale
});
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
