<template>
    <div class="wrap">
        <div class="content">
            <div class="profile">
                <div class="profile-header">
                    <div class="post-user">
                        <div class="post-avatar">
                            <a title>
                                <img :src="userData.avatar" alt/>
                            </a>
                        </div>
                        <div class="post-userName">
                            <p>
                                <a title>{{userData.username}}</a>
                            </p>
                            <p>
                                <a @click="follow" class="btn-follow btn active" v-show="userData.follow">Following</a>
                                <a @click="follow" class="btn-follow-user btn" v-show="!userData.follow">Follow</a>
                            </p>
                        </div>
                    </div>
                    <div class="post-user__name">
                        <p>{{userData.fullname}}</p>
                    </div>
                </div>
                <div class="profile-content">
                    <div class="tab">
                        <div class="tab-title">
                            <a :class="{active:isPost}" @click="showPost" style="cursor:pointer">
                                <span>{{userData.post}}</span>
                                <p v-if="userData.post >1 || userData.post==0">posts</p>
                                <p v-else>post</p>
                            </a>
                            <a :class="{active:isFollower}" @click="showFollower" style="cursor:pointer">
                                <span>{{userData.follower}}</span>
                                <p v-if="userData.follower >1 || userData.follower==0">followers</p>
                                <p v-else>follower</p>
                            </a>
                            <a :class="{active:isFollowing}" @click="showFollowing" style="cursor:pointer">
                                <span>{{userData.following}}</span>
                                following
                            </a>
                        </div>
                        <div class="tab-content">
                            <post :id="id" v-if="isPost"></post>
                            <follower :followers="followers" :id="id" :yourId="yourId" v-if="isFollower"></follower>
                            <follower :followers="followings" :id="id" :yourId="yourId" v-if="isFollowing"></follower>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <footers></footers>
    </div>
</template>

<script>
    import Post from "@/components/user/Post";
    import Footers from "@/components/Footer";
    import Follower from "@/components/user/Follower";
    import {RepositoryFactory} from '@/repositories/RepositoryFactory'
    import {eventBus} from "@/main";

    const UserRepository = RepositoryFactory.get('user');

    export default {
        components: {
            Post,
            Footers,
            Follower
        },
        created() {
            this.id = this.$route.query.id;
            if (this.id === localStorage.getItem("id"))
                this.$router.push({name: "profile"});
            this.getData();
            this.getFollowers();
            this.getFollowings();
        },

        data() {
            return {
                id: "",
                userData: {},
                isFollow: Boolean,
                isPost: true,
                isFollower: false,
                isFollowing: false,
                yourId: localStorage.getItem("id"),
                followers: [],
                followings: []
            };
        },

        methods: {
            async follow() {
                if (this.userData.follow === false) {
                    let formData = {
                        type: "follow",
                        targetUser: this.id
                    };
                    this.$store.dispatch("saveNewActivity", formData);
                }
                try {
                    var res = await UserRepository.follow(this.id);
                    if (res.status === 200) {
                        this.getData();
                        this.getFollowers();
                    }
                } catch (e) {
                    eventBus.$emit("notifyError", e.response.data.message)
                }
            },
            async getData() {
                try {
                    var res = await UserRepository.getUserById(this.id);
                    if (res.status === 200) {
                        this.userData = res.data;
                    }
                } catch (e) {
                    eventBus.$emit("notifyError", e.response.data.message)
                }
            },
            showPost() {
                (this.isPost = true),
                    (this.isFollower = false),
                    (this.isFollowing = false);
            },

            showFollower() {
                (this.isPost = false),
                    (this.isFollower = true),
                    (this.isFollowing = false);
            },

            showFollowing() {
                (this.isPost = false),
                    (this.isFollower = false),
                    (this.isFollowing = true);
            },
            async getFollowers() {
                try {
                    var res = await UserRepository.getFollowers(this.id);
                    if (res.status === 200) {
                        this.followers = res.data;
                    }
                } catch (e) {
                    eventBus.$emit("notifyError", e.response.data.message)
                }
            },
            async getFollowings() {
                try {
                    var res = await UserRepository.getFollowings(this.id);
                    if (res.status === 200) {
                        this.followings = res.data;
                    }
                } catch (e) {
                    eventBus.$emit("notifyError", e.response.data.message)
                }
            }
        }
    };
</script>
