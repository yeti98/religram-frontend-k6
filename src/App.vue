<template>
    <div class="wrap" id="app">
        <headers></headers>
        <keep-alive>
            <router-view :key="$route.fullPath"/>
        </keep-alive>
        <div class="message message-error" v-show="error != ''">
            <p>{{error}}</p>
        </div>
        <div class="message message-success" v-show="success!=''">
            <p>{{success}}</p>
        </div>
    </div>
</template>

<script>
    import Headers from "@/components/Header";
    import {eventBus} from "@/main";

    export default {
        components: {
            Headers
        },
        created() {
            this.$store.dispatch("tryToLogin");
        },
        data() {
            return {
                error: "",
                success: ""
            }
        },
        mounted() {
            eventBus.$on("notifyError", (msg) => {
                this.error = msg;
                setTimeout(() => this.error = "", 2000)
            })
            eventBus.$on("notifySuccess", (msg) => {
                this.success = msg;
                setTimeout(() => this.success = "", 2000)
            })
        },
        destroyed() {
            eventBus.$off("notifyError")
        }
    };
</script>

<style>
</style>
