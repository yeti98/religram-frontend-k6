<template>
    <div @click="goToNoti" class="post-user" style="padding-bottom: 5px; cursor:pointer">
        <div class="post-avatar">
            <a>
                <img :src="message.userAvatar" alt/>
            </a>
        </div>
        <div class="post-userName" style="width: 68%; word-wrap:break-word">
            <p v-if="message.type == 'follow'">
                <a>{{message.user}}</a>
                started follow you
            </p>
            <p v-else-if="message.type == 'comment'">
                <a title>{{message.user}}</a>
                commented on your post
            </p>
            <p v-else>
                <a title>{{message.user}}</a>
                liked your post
            </p>
            <timeago :autoUpdate="1" :datetime="message.createAt"></timeago>
        </div>
        <a id="image" v-if="message.type != 'follow'">
            <img :src="message.image"/>
        </a>

        <a :class="{btn:true, 'btn-follow':true, active:isFollow}" @click.stop="follow()" title v-else>
            <span v-if="isFollow">following</span>
            <span v-else>follow</span>
        </a>
    </div>
</template>

<script>
    import {RepositoryFactory} from '@/repositories/RepositoryFactory'
    import {eventBus} from "@/main";

    const UserRepository = RepositoryFactory.get('user');
    export default {
        props: {
            message: Object
        },

        data() {
            return {
                isFollow: false
            };
        },

        created() {
            this.getData()
        },

        methods: {
            async getData() {
                try {
                    var res = await UserRepository.getUserById(this.message.userId);
                    if (res.status === 200) {
                        this.isFollow = res.follow;
                    }
                } catch (e) {
                    eventBus.$emit("notifyError", e.response.data.message)
                }
            },
            async follow() {
                if (this.isFollow === false) {
                    let formData = {
                        type: "follow",
                        targetUser: this.message.userId
                    };
                    this.$store.dispatch("saveNewActivity", formData);
                }
                try {
                    var res = await UserRepository.follow(this.message.userId);
                    if (res.status === 200) {
                        this.isFollow = !this.isFollow;
                    }
                } catch (e) {
                    eventBus.$emit("notifyError", e.response.data.message)
                }
            },
            goToNoti() {
                if (this.message.type === "follow")
                    this.$router.push({
                        name: "otherprofile",
                        query: {id: this.message.userId}
                    });
                else {
                    this.$router.push({
                        name: "postdetail",
                        query: {id: this.message.post}
                    });
                }
            }
        }
    };
</script>
<style scoped>
    .activity-header {
        text-align: center;
        font-weight: 200;
        font-size: 22px;
    }

    #image {
        display: inline-block;
        width: 40px;
        height: 40px;
        /* margin-top: -3px; */
        margin-left: 5px;
        margin-bottom: 5px;
    }

    #image img {
        max-width: 100%;
        max-height: 100%;
        width: 50px;
        height: 50px;
        object-fit: cover;
        margin-left: 10px;
    }

    .activity-text {
        margin-left: 10px;
        margin-top: 8px;
        font-size: 18px;
        position: absolute;
        top: 17%;
        left: 50px;
    }
</style>
