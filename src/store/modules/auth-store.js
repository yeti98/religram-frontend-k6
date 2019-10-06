const state = {
    id: Number,
    username: "",
    fullname: "",
    email: "",
    token: "",
    avatar: ""
};
const getters = {};
const mutations = {
    authUser(state, userData) {
        state.id = userData.id;
        state.username = userData.username;
        state.fullname = userData.fullname;
        state.email = userData.email;
        state.token = userData.token;
        state.avatar = userData.avatar
    },

    clearAuth(state) {
        state.username = "";
        state.fullname = "";
        state.email = "";
        state.token = "";
        state.id = null;
        state.avatar = ""
    }
};
const actions = {
    authUser({commit}, userData) {
        commit('authUser', userData);
        localStorage.setItem('token', userData.token);
        localStorage.setItem('id', userData.id);
        localStorage.setItem('username', userData.username);
        localStorage.setItem('fullname', userData.fullname);
        localStorage.setItem('email', userData.email)
        localStorage.setItem("avatar", userData.avatar)
    },

    clearAuth({commit}) {
        commit('clearAuth');
        localStorage.removeItem('token');
        localStorage.removeItem('fullname');
        localStorage.removeItem('id');
        localStorage.removeItem('email');
        localStorage.removeItem('username');
        localStorage.removeItem('avatar');

    },

    tryToLogin({commit}) {
        const token = localStorage.getItem('token');
        if (token == null) return false;
        commit('authUser', {token: token});
        return true
    }
};
export default {
    state,
    mutations,
    actions,
    getters
}
