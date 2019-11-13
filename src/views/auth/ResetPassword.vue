<template>
    <div class="wrap">
        <div class="content">
            <div class="form form-reset-pw">
                <form @submit.prevent="onSubmit" id="form_reset_pw">
                    <label>New password</label>
                    <input
                            :class="{invalid: $v.password.$error}"
                            class="input-text"
                            id="password"
                            name="reset-pw"
                            placeholder="New password"
                            type="password"
                            v-model="password"
                    />
                    <label>Confirm password</label>
                    <input
                            :class="{invalid: $v.confirmPassword.$error}"
                            class="input-text"
                            id="confirmPassword"
                            name="reset-pw-cf"
                            placeholder="Confirm password"
                            type="password"
                            v-model="confirmPassword"
                    />
                    <button
                            class="btn btn-full"
                            id="reset_pw_submit"
                            name="reset-pw-submit"
                            type="submit"
                    >Reset password
                    </button>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
    import {RepositoryFactory} from '@/repositories/RepositoryFactory'
    import {eventBus} from "@/main";
    import {confirmPassword, password} from "@/validate/validate";

    const AuthRepository = RepositoryFactory.get('auth');

    export default {
        data() {
            return {
                password: "",
                confirmPassword: "",
            };
        },
        validations: {
            password,
            confirmPassword
        },

        created() {
        },

        methods: {
            async onSubmit() {
                this.$v.$touch();
                if (!this.$v.$invalid) {
                    try {
                        var res = await AuthRepository.savenewpass({
                            newPass: this.password,
                            confirmPass: this.confirmPassword
                        });
                        if (res.status === 200) {
                            eventBus.$emit("notifySuccess", "Save successfuly!");
                            this.$router.push({name: "login"});
                        }
                    } catch (e) {
                        eventBus.$emit("notifyError", e.response.data.message)
                    }
                }
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
