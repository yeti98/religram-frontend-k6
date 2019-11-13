<template>
    <div class="wrap">
        <div class="content">
            <div class="profile">
                <div class="profile-header">
                    <div class="post-user">
                        <div class="post-avatar post-avatar-small">
                            <a title=""><img :src="avatar" alt=""/></a>
                        </div>
                        <div class="post-userName">
                            <p><a @click="usernameOnClicked" href title="">{{constusername}}</a></p>
                            <p>
                                <a @click="handleChangeAvatarClicked" class="btn-change-proflie btn" title="">
                                    Change profile photo </a>
                                <a @click="handleChangePasswordClicked" class="btn-change-pw btn" href title="">
                                    Change password</a></p>
                        </div>
                    </div>
                </div>
                <div class="profile-content">
                    <div class="form form-change-profile">
                        <form @submit.prevent="onSubmit" class="change-profile">
                            <label>Name</label>
                            <input :class="{invalid: $v.fullname.$error}"
                                   :placeholder="fullname"
                                   @focusout="handleFocusOut(fullname, $event.target)"
                                   @input="handleFullnameInput($event.target.value)"
                                   id="change_profile_name" name="change-profile-name" onfocusin="this.placeholder=''"
                                   type="text"
                                   value="">
                            <div class="error" v-if="$v.fullname.$error">Name must be between
                                {{$v.fullname.$params.minLength.min}} and {{$v.fullname.$params.maxLength.max}}
                                characters.
                            </div>
                            <label>Username</label>
                            <input :class="{invalid: $v.username.$error}"
                                   :placeholder="username"
                                   @focusout="handleFocusOut(username, $event.target)"
                                   @input="handleUsernameInput($event.target.value)"
                                   id="change_profile_user"
                                   name="change-profile-user"
                                   onfocusin="this.placeholder=''" type="text" value="">
                            <label>Email</label>
                            <input :class="{invalid: $v.email.$error}"
                                   :placeholder="email"
                                   @focusout="handleFocusOut(email, $event.target)"
                                   @input="handleEmailInput($event.target.value)"
                                   id="change_profile_email"
                                   name="change-profile-email"
                                   onfocusin="this.placeholder=''" type="text" value="">
                            <button class="btn btn-full" id="change_profil_submit" name="change-profile-submit"
                                    type="submit">Submit
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        <Footer></Footer>
        <input @change="onFileSelected" name="myFile" ref="inputt" type="file" v-show="false"/>
    </div>
</template>

<script>

    import {email, fullname, username} from "@/validate/validate";
    import Footer from "@/components/Footer";
    import {RepositoryFactory} from '@/repositories/RepositoryFactory'
    import {eventBus} from "@/main";

    const UserRepository = RepositoryFactory.get('user');

    export default {
        name: "EditUser",
        components: {
            Footer
        },
        data() {
            return {
                constusername: localStorage.getItem('username'),
                username: localStorage.getItem('username'),
                fullname: localStorage.getItem('fullname'),
                email: localStorage.getItem('email'),
                avatar: localStorage.getItem('avatar'),
                image: null
            }
        },
        validations: {
            email, username, fullname
        },
        methods: {
            usernameOnClicked() {
                this.$router.push({name: 'profile'})
            },
            handleFocusOut(key, target) {
                if (target.value === "") {
                    target.placeholder = key
                }
            },
            handleFullnameInput(value) {
                this.fullname = value;
                this.$v.fullname.$touch();
            },

            handleUsernameInput(value) {
                this.username = value;
                this.$v.username.$touch();
            },
            handleEmailInput(value) {
                this.email = value;
                this.$v.email.$touch();
            },
            handleChangeAvatarClicked() {
                this.$refs.inputt.click();
            },
            onFileSelected(event) {
                let files = event.target.files;
                let fileReader = new FileReader();
                let imageUrl = null;
                fileReader.addEventListener("load", () => {
                    imageUrl = fileReader.result;
                    let formData = {
                        imageUrl: imageUrl,
                        type: "image"
                    };
                    this.$router.push({name: "create", query: {pic: formData}, params: {mode: 'avatar'}});
                });
                fileReader.readAsDataURL(files[0]);
                this.image = files[0];
            },
            handleChangePasswordClicked() {
                this.$router.push({name: 'changepassword'})
            },
            async onSubmit() {
                this.$v.$touch();
                if (!this.$v.$invalid) {
                    let userData = {
                        username: this.username,
                        fullname: this.fullname,
                        email: this.email
                    };
                    try {
                        var res = await UserRepository.changeuserinfo(userData)
                        if(res.status===200){
                            this.constusername = userData.username;
                            eventBus.$emit("notifySuccess", "Save successfuly!")
                            this.$store.commit('updateUserInfo', userData)
                        }
                    } catch (e) {
                        eventBus.$emit("notifyError", e.response.data.message)
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
