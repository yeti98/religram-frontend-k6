import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Login from './views/auth/Login';
import Signup from "@/views/auth/Signup";
import SignupFacebook from "@/views/auth/SignupFacebook";
import PostDetail from "@/views/post/PostDetail";
import Create from "@/views/post/Create";
import Profile from '@/views/user/Profile';

Vue.use(Router);

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home
        },
        {
            path: "/login",
            name: 'login',
            component: Login
        },
        {
            path: "/signup",
            name: "signup",
            component: Signup
        },

        {
            path: "/signupfacebook",
            name: "signupfacebook",
            component: SignupFacebook
        },
        {
            path: "/post",
            name: "postdetail",
            component: PostDetail
        },
        {
            path: "/create",
            name: "create",
            component: Create,
            props: true
        },
        {
            path: '/profile',
            name: 'profile',
            component: Profile
        }]
})
