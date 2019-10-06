<template>
    <div class="home">
        <img alt="Relipa Software" src="../assets/Relipa-text-2.png"/>
        <HelloWorld msg="Welcome to to to to to to to to something cool"/>
        <p v-show="!this.$store.state.token == ''">Your logged in</p>
        <br/>
        <p>Wanna click something? Hmmmmm</p>
        <button @click="login" class="btn btn-primary" v-show="this.$store.getters.token ==''">Log in</button>
        <button @click="logout" class="btn btn-primary" v-show="this.$store.getters.token !=''">Log out</button>
    </div>
</template>

<script>
    // @ is an alias to /src
    import HelloWorld from "@/components/HelloWorld.vue";

    export default {
        name: "home",
        components: {
            HelloWorld
        },
        mounted() {
            if (localStorage.getItem('token') === null) {
                this.$router.push("/login")
            }
        },

        methods: {
            logout() {
                this.$store.dispatch("clearAuth");
                console.log(this.$store.state.username);
            },

            login() {
                this.$router.push({name: "login"});
            }
        }
    };
</script>
