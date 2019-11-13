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
        <div class="message message-success" v-show="showNoti" @click="$router.push({name:'activity'})">
            <p>You got new notification</p>
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
            this.fetchMessages();
        },
        data() {
            return {
                isCreate: true,
                error: "",
                success: "",
                showNoti: false
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
        },
        methods:{
            fetchMessages() {
                db.collection(localStorage.getItem("id"))
                    .orderBy("createAt")
                    .onSnapshot(snapshot => {
                        snapshot.docChanges().forEach(change => {
                            if (change.type === "added") {
                                if (this.isCreate === false) {
                                    this.showNoti = true;
                                    setTimeout(() => {
                                        this.showNoti = false;
                                    }, 3000);
                                }
                            }
                        });
                        this.isCreate = false;
                    });
            }

        }
    };
</script>

<style>
</style>
