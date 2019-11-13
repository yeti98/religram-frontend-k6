import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/store'
import Vuelidate from 'vuelidate';
import TextareaAutosize from "vue-textarea-autosize";
import VueTimeago from "vue-timeago";
import Croppa from "vue-croppa";


Vue.config.productionTip = false;
Vue.use(Vuelidate);
export const eventBus = new Vue();
Vue.use(TextareaAutosize);
Vue.use(VueTimeago, {
    name: "Timeago", // Component name, `Timeago` by default
    locale: "en" // Default locale
});
Vue.use(Croppa);

function debounce(fn, delay = 300) {
    var timeoutID = null;
    return function () {
        clearTimeout(timeoutID);
        var args = arguments;
        var that = this;
        timeoutID = setTimeout(function () {
            fn.apply(that, args);
        }, delay);
    }
}

// this is where we integrate the v-debounce directive!
// We can add it globally (like now) or locally!
Vue.directive('debounce', (el, binding) => {
    if (binding.value !== binding.oldValue) {
        // window.debounce is our global function what we defined at the very top!
        el.oninput = debounce(ev => {
            el.dispatchEvent(new Event('change'));
        }, parseInt(binding.value) || 300);
    }
});
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
