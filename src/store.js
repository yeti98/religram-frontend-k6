import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    username: "",
    fullname: "",
    email: "",
    token: ""
  },
  mutations: {
    authUser (state , userData){
      state.username = userData.username;
      state.fullname = userData.fullname;
      state.email = userData.email;
      state.token = userData.token;
    },

    clearAuth(state){
      state.username = "";
      state.fullname = "";
      state.email = "";
      state.token = "";
    }
  },
  actions: {
    authUser({commit}, userData){
      commit('authUser', userData);
      localStorage.setItem('token', userData.token)
    },

    clearAuth({commit}){
      commit('clearAuth');
      localStorage.removeItem('token');
    },

    tryToLogin({commit}){
      const token = localStorage.getItem('token');
      if(token == null) return false;
      commit('authUser',{token:token})
      return true
    }
  }
})
