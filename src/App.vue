<template>
    <div id="app" class="wrap">
        <headers></headers>
        <keep-alive>
            <router-view :key="$route.fullPath" />
        </keep-alive>
        <div class="message message-error" v-show="error != ''">
            <p>{{error}}</p>
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
        data(){
            return{
                error: ""
            }
        },
        mounted() {
            eventBus.$on("notifyError", (msg) => {
                this.error = msg;
                setTimeout(() => this.error = "", 2000)
            })
        },
        destroyed() {
            eventBus.$off("notifyError")
        }
    };
</script>

<style>
</style>
