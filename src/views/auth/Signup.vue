<template>
    <div class="wrap">
        <div class="header">
            <div class="logo">
                <a href="#" title>Religram</a>
                <p class="slogan">Heaven in your hands</p>
            </div>
        </div>
        <div class="content">
            <div class="form form-sign-up">
                <div class="login-fb login-fb-v2">
                    <p>
                        <i aria-hidden="true" class="fa fa-facebook"></i>
                        <a>Login with Facebook</a>
                    </p>
                </div>
                <div class="label-break">
                    <span>or</span>
                </div>
                <form @submit.prevent="onSubmit" id="form_sign_up">
                    <input
                            :class="{invalid: $v.email.$error}"
                            class="input-text"
                            id="email"
                            name="signup-email"
                            placeholder="Email"
                            type="text"
                            v-model="email"
                    />
                    <input
                            :class="{invalid: $v.fullname.$error}"
                            class="input-text"
                            id="fullname"
                            name="signup-name"
                            placeholder="Full name"
                            type="text"
                            v-model="fullname"
                    />
                    <input
                            :class="{invalid: $v.username.$error}"
                            class="input-text"
                            id="username"
                            name="signup-user"
                            placeholder="User name"
                            type="text"
                            v-model="username"
                    />
                    <input
                            :class="{invalid: $v.password.$error}"
                            class="input-text"
                            id="password"
                            name="signup-pass"
                            placeholder="Password"
                            type="password"
                            v-model="password"
                    />
                    <input
                            :class="{invalid: $v.confirmPassword.$error}"
                            class="input-text"
                            id="confirmPassword"
                            name="signup-pass-cf"
                            placeholder="Confirm password"
                            type="password"
                            v-model="confirmPassword"
                    />
                    <button class="btn btn-full" id="signup_submit" name="signup-submit" type="submit">Sign up</button>
                </form>
            </div>
            <div class="sign-up">
                <p>
                    Have a account?
                    <a @click="goLogin" href>Log in</a>
                </p>
            </div>
        </div>
        <div class="message message-error" v-show="error!='' ">
            <p>{{error}}</p>
        </div>
    </div>
</template>

<script>
    import auth from "../../axios/axios-auth";
    import {confirmPassword, fullname, password, username, email} from "@/validate/validate";


    export default {
        data() {
            return {
                username: "",
                password: "",
                email: "",
                fullname: localStorage.getItem('fullname'),
                confirmPassword: "",
                error: ""
            };
        },

        validations: {
            password, confirmPassword, fullname, username, email
        },

        methods: {
            onSubmit() {
                console.log(this.$v.email);
                console.log(this.$v.fullname);

                this.$v.$touch();
                if (!this.$v.$invalid) {
                    let formData = {
                        username: this.username,
                        email: this.email,
                        password: this.password,
                        fullname: this.fullname
                    };
                    auth
                        .post("/signup", formData)
                        .then(res => {
                            if (res.status == 200) {
                                let userData = {
                                    id: res.data.user.id,
                                    username: res.data.user.username,
                                    email: res.data.user.email,
                                    fullname: res.data.user.fullname,
                                    token: res.data.token,
                                    avatar: res.data.user.avatar,
                                };
                                this.$store.dispatch("authUser", userData);
                                this.$router.push({name: "home"});
                            }
                        })
                        .catch(err => {
                            if (err) {
                                this.error = err.response.data.message;
                                setTimeout(() => this.error = '', 2000)
                            }
                        });
                }
            },

            update(userData) {
                this.email = userData.email;
                this.fullname = userData.fullname;
            },

            goLogin() {
                this.$router.push({name: "login"});
            }
        }
    };
</script>

<style scoped>
    .invalid {
        border-width: 2px;
        border-color: rgb(226, 35, 35);
    }
</style>