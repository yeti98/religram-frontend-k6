import Vue from 'vue'
import Vuex from 'vuex'
import auth_store from "./modules/auth-store";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {},
    getters:{
        token: state => {
            return auth_store.state.token
        }
    },
    mutations: {},
    actions: {},
    modules: {
        auth_store
    }
})
