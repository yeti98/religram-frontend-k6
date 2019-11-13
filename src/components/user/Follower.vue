<template>
    <ul class="ul-list-followers">
        <li :key="index" v-for="(follower,index) in followers">
            <div class="post-user">
                <div class="post-avatar">
                    <a @click="getUser(follower.id)">
                        <img :src="follower.avatar" alt/>
                    </a>
                </div>
                <div class="post-userName">
                    <p>
                        <a @click="getUser(follower.id)" title>{{follower.username}}</a>
                    </p>
                </div>
            </div>
            <a
                    :class="{btn:true, 'btn-follow':true, active:follower.isFollow}"
                    @click="follow(follower.id, index, follower.isFollow)"
                    title
                    v-if="follower.id !== yourId"
            >
                <span v-if="follower.isFollow">following</span>
                <span v-else>follow</span>
            </a>
        </li>
    </ul>
</template>

<script>
    import {RepositoryFactory} from '@/repositories/RepositoryFactory'
    import {eventBus} from "@/main";

    const UserRepository = RepositoryFactory.get('user');

    export default {
        props: {
            id: String,
            yourId: String,
            followers: Array
        },

        methods: {
            async follow(targetId, index, isFollow) {
                if (isFollow === false) {
                    // TODO: Thông báo
                }
                if (targetId !== this.yourId) {
                    try {
                        var res = await UserRepository.follow(targetId);
                        if (res.status === 200) {
                            this.followers[index].isFollow = !this.followers[index].isFollow;
                            this.$emit("updateFollow");
                            eventBus.$emit("updateFollow");
                        }
                    } catch (e) {
                        eventBus.$emit("notifyError", e.response.data.message)
                    }
                }
            },

            getUser(userId) {
                if (userId === this.yourId) this.$router.push({name: "profile"});
                else this.$router.push({name: "otherprofile", query: {id: userId}});
            }
        }
    };
</script>

<style scoped>
    .disableButton {
        background-color: rgb(209, 206, 206);
    }
</style>
