<template>
    <div class="wrap">
        <div class="box-back box-back-v2">
            <a @click="handleReturnClicked" title>
                <i aria-hidden="true" class="fa fa-angle-left"></i>Password
                change
            </a>
        </div>
        <div class="content">
            <div class="profile-header">
                <div class="post-user">
                    <div class="post-avatar post-avatar-small">
                        <a title>
                            <img :src="avatar" alt/>
                        </a>
                    </div>
                    <div class="post-userName">
                        <p>
                            <a @click="usernameOnClicked" title>{{username}}</a>
                        </p>
                    </div>
                </div>
            </div>
            <div class="profile-content">
                <div class="form form-change-pw">
                    <form @submit.prevent="onSubmit" action class="change-pw" method>
                        <label>Current password</label>
                        <input
                                class="input-text"
                                id="change_pw_current"
                                name="change-pw-current"
                                placeholder
                                type="password"
                                v-model="currentPassword"
                                value
                        />
                        <label>New password</label>
                        <input
                                :class="{invalid: $v.password.$error}"
                                id="change_pw_new"
                                name="change-pw-new"
                                placeholder
                                type="password"
                                v-model="password"
                                value
                        />
                        <label>Confirm password</label>
                        <input
                                :class="{invalid: $v.confirmPassword.$error}"
                                id="change-pw-confirm"
                                name="change-pw-confirm"
                                placeholder
                                type="password"
                                v-model="confirmPassword"
                                value
                        />
                        <button
                                class="btn btn-full"
                                id="change_pw_submit"
                                name="change-pw-submit"
                                type="submit"
                        >
                            Change
                            password
                        </button>
                        <p>
                            <a @click="handleForgotPasswordClicked" title>Forgot password</a>
                        </p>
                    </form>
                </div>
            </div>
        </div>
        <Footer @reload="reload" key="footerprofile"></Footer>
    </div>
</template>

<script>
    import {confirmPassword, password} from "@/validate/validate";
    import Footer from "@/components/Footer";
    import {RepositoryFactory} from '@/repositories/RepositoryFactory'
    import {eventBus} from "@/main";

    const AuthRepository = RepositoryFactory.get('auth');
    export default {
        name: "ChangePassword",
        components: {
            Footer
        },
        data() {
            return {
                avatar: localStorage.getItem("avatar"),
                username: localStorage.getItem("username"),
                currentPassword: "",
                password: "",
                confirmPassword: "",
            };
        },
        validations: {
            password,
            confirmPassword
        },
        methods: {
            handleReturnClicked() {
                this.$router.push({name: "editprofile"});
            },
            handleForgotPasswordClicked() {
                this.$router.push({name: "forgotpassword"});
            },
            usernameOnClicked() {
                this.$router.push({name: "profile"});
            },
            reload() {
                location.reload();
            },
            async onSubmit() {
                this.$v.$touch();
                if (!this.$v.$invalid) {
                    let userData = {
                        currentPassword: this.currentPassword,
                        newPassword: this.password
                    };
                    try {
                        var res = await AuthRepository.changepass(userData);
                        if (res.status === 200) {
                            eventBus.$emit("notifySuccess", "Save successfuly!");
                            this.$router.push({name: "login"});
                            this.$store.dispatch("clearAuth");
                        }
                    } catch (e) {
                        eventBus.$emit("notifyError", e.response.data.message)
                    }
                }
            }
        }
    };
</script>
Save successfuly!
<style scoped>
    .invalid {
        border-width: 2px;
        border-color: rgb(226, 35, 35);
    }
</style>
