<template>
    <div class="wrap">
        <div class="content">
            <div class="form form-sign-up-fb">
                <form  id="form_sign_up_fb" @submit.prevent="signupfacebook">
                    <div class="sign-up-avatar">
                        <p><img :src="avatar" alt=""/></p>
                    </div>
                    <input
                            :class="{invalid: $v.email.$error}"
                            class="input-text" id="email" name="signup-email-fb" placeholder="Email" type="text" v-model="email"
                            value="">
                    <input
                            :class="{invalid: $v.fullname.$error}"
                            class="input-text" id="fullname" name="signup-name-fb" placeholder="Fullname" type="text"
                            v-model="fullname" value="">
                    <input :class="{invalid: $v.username.$error}" class="input-text" id="username" name="signup-user-fb" placeholder="Username"
                           type="text" v-model="username"
                           value="">
                    <input :class="{invalid: $v.password.$error}" class="input-text" id="password" name="signup-pass-fb" placeholder="Password"
                           type="password" v-model="password"
                           value="">
                    <button type="submit" class="btn btn-full" id="signup_submit_fb"
                            name="signup-submit-fb">Sign up
                    </button>
                </form>
            </div>
            <div class="sign-up">
                <p>
                    Have a account?
                    <a @click="goLogin">Log in</a>
                </p>
            </div>
        </div>
        <div class="message message-error" v-show="error!='' ">
            <p>{{error}}</p>
        </div>
    </div>
</template>

<script>
    import {RepositoryFactory} from '../../repositories/RepositoryFactory'
    import {email, fullname, password, username} from "@/validate/validate";
    import image2base64 from "image-to-base64"
    import {eventBus} from "@/main";

    const AuthRepository = RepositoryFactory.get('auth');

    export default {
        name: "SignupFacebook",
        data() {
            return {
                username: "",
                fullname: localStorage.getItem('fullname'),
                email: localStorage.getItem('email'),
                avatar: localStorage.getItem('avatar'),
                password: "",
                error: "",
            }
        },
        validations: {
            email, fullname, username, password
        },
        methods: {
            goLogin() {
                this.$router.push({name: "login"});
            },
            getBase64(){
                image2base64(this.avatar).then((res) => {
                    return res
                }).catch((error) => {
                    if (error){
                        //console.log(error)
                    }
                })
            },
            async signupfacebook() {
                this.$v.$touch();
                if (!this.$v.$invalid) {
                    let formData = {
                        username: this.username,
                        email: this.email,
                        password: this.password,
                        fullname: this.fullname,
                        avatar: this.getBase64(),

                    };
                    try {
                        var res = await AuthRepository.signup(formData);
                        if (res.status === 200) {
                            let userData = {
                                id: res.data.user.id,
                                username: res.data.user.username,
                                email: res.data.user.email,
                                fullname: res.data.user.fullname,
                                token: res.data.token,
                                avatar: res.data.user.avatar
                            };
                            this.$store.dispatch("authUser", userData);
                            setTimeout(() => {
                                this.$router.push({name: "home"});
                            }, 1000);
                        }
                    } catch (err) {
                        eventBus.$emit("notifyError", err.response.data.message)
                    }
                }
            }
        }
    }
</script>

<style scoped>
    .invalid {
        border-width: 2px;
        border-color: rgb(226, 35, 35);
    }
</style>
