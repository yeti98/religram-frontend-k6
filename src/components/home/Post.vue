<template>
    <div class="post-item">
        <div class="post-user">
            <div class="post-avatar">
                <a @click="goToUser">
                    <img :src="post.user.avatar" alt/>
                </a>
            </div>
            <div class="post-userName">
                <p>
                    <a @click="goToUser">{{post.user.username}}</a>
                </p>
                <p>
          <span class="post-date">
            <timeago :autoUpdate="1" :datetime="post.createAt"></timeago>
          </span>
                </p>
            </div>
        </div>
        <div class="post-image">
            <p @click="$router.push({name: 'postdetail', query:{id: post.id}})" class="post-thumb">
                <img :src="post.photos[0].photoUri" alt/>
            </p>
        </div>
        <div class="post-event">
            <p>
                <!-- <span :class="{'post-icon-like': true, active: isLike}" @click="likePost">
                  <a title></a>
                </span>-->
                <span @click="likePost" class="post-icon-like active" v-if="isLike">
          <a title></a>
        </span>
                <span @click="likePost" class="post-icon-like" v-else>
          <a title></a>
        </span>
                <span
                        @click="$router.push({name: 'postdetail', query:{id: post.id}, hash:'#comment'})"
                        class="post-icon-comment"
                >
          <a title></a>
        </span>
                <span class="post-icon-upload">
          <a title></a>
        </span>
            </p>
            <p style="font-weight: bold" v-if="likeCount>1">{{likeCount}} likes</p>
            <p style="font-weight: bold" v-else>{{likeCount}} like</p>
        </div>
        <div class="post-title">
            <!-- <p>{{post.content}}</p> -->
            <readMore :text="post.content"></readMore>
            <br/>
        </div>
        <p
                @click="$router.push({name: 'postdetail', query:{id: post.id}})"
                class="post-view-all"
                style="cursor: pointer"
                v-if="post.comments.length>3"
        >View all {{post.comments.length}} comments</p>
        <div :key="index" class="post-comment" v-for="(comment,index) in cmShow">
            <comment :comment="comment" :postID="post.id" :targetComment="comment" key="commentposthome"></comment>
        </div>
        <form @submit.prevent="postComment">
            <textarea-autosize
                    :max-height="350"
                    :min-height="25"
                    id="text"
                    placeholder="Add comment..."
                    v-model="commentMessage"
            />

            <p @click="postComment" style="color: rgb(25, 122, 255);" v-if="commentMessage != ''">post</p>
            <p style="color: rgb(199, 241, 247); cursor: default" v-else>post</p>
            <!-- <img src="../../../public/images/send-icon.png"  /> -->
        </form>
    </div>
</template>

<script>
    import Comment from "@/components/home/Comment";
    import ReadMore from "@/components/home/ReadMore";
    import {RepositoryFactory} from '@/repositories/RepositoryFactory'
    import {eventBus} from "@/main";

    function convertCreateAt(offset) {
        var d = new Date();
        var utc = d.getTime() + (d.getTimezoneOffset() * 60000);
        var nd = new Date(utc + (3600000 * offset));
        return nd;
    }

    const PostRepository = RepositoryFactory.get('post');
    export default {
        components: {
            Comment,
            ReadMore
        },
        props: {
            post: Object
        },
        activated() {
            let like = localStorage.getItem(this.post.id);
            if (like != null) {
                if (this.isLike !== like) {
                    if (this.isLike === true) {
                        this.isLike = false;
                        this.likeCount--;
                    } else {
                        this.isLike = true;
                        this.likeCount++;
                    }
                }
                localStorage.removeItem(this.post.id);
            }
        },
        mounted() {
            eventBus.$on("replyComment", (postID, targetCommentID, content) => {
                document.getElementById("text").focus();
                this.commentMessage = "@" + content;
                this.isReply = true;
                this.targetCommentID = targetCommentID
            })
        },
        data() {
            return {
                cmShow: [],
                commentMessage: "",
                isLike: false,
                likeCount: 0,
                isReply: false
            };
        },
        created() {
            this.likeCount = this.post.likes.length;
            if (this.post.comments.length <= 3)
                this.cmShow = this.cmShow.concat(this.post.comments);
            else {
                this.cmShow = this.cmShow.concat(this.post.comments[0]);
                this.cmShow = this.cmShow.concat(this.post.comments[1]);
                this.cmShow = this.cmShow.concat(
                    this.post.comments[this.post.comments.length - 1]
                );
            }
            let id = localStorage.getItem("id");
            for (let i = 0; i < this.post.likes.length; i++) {
                if (this.post.likes[i].user.id === id) {
                    this.isLike = true;
                    break;
                }
            }
        },

        methods: {
            postComment() {
                // TODO: Thông báo
                if (!this.isReply) {
                    this.mainComment()
                    // TODO: Thông báo
                } else {
                    this.replyComment();
                    this.isReply = !this.isReply;
                    // TODO: Thông báo
                }
            },
            async mainComment() {
                try {
                    let commentRequest = {
                        userId: window.localStorage.getItem("id"),
                        comment: this.commentMessage.trim(),
                        hashtags: [],
                        metions: []
                    };
                    let res = await PostRepository.comment(this.post.id, commentRequest);
                    if (res.status === 200) {
                        this.cmShow = this.cmShow.concat({
                            user: {
                                avatar: window.localStorage.getItem("avatar"),
                                username: window.localStorage.getItem("username")
                            },
                            content: this.commentMessage.trim(),
                            replyComments: [],
                            createAt: (convertCreateAt("+7.0")).toISOString().slice(0, -1)
                        });
                        this.commentMessage = "";
                    }
                } catch (e) {
                    eventBus.$emit("notifyError", e.response.data.message)
                }
            },
            async likePost() {
                // TODO: Thông báo
                try {
                    var res = await PostRepository.like(this.post.id);
                    if (res.status === 200) {
                        if (this.isLike) {
                            this.isLike = false;
                            this.likeCount--;
                        } else {
                            this.isLike = true;
                            this.likeCount++;
                        }
                    }
                } catch (e) {
                    eventBus.$emit("notifyError", e.response.data.message)
                }
            },

            goToUser() {
                if (this.post.user.id === localStorage.getItem("id")) {
                    this.$router.push("profile");
                } else {
                    this.$router.push({
                        name: "otherprofile",
                        query: {id: this.post.user.id}
                    });
                }
            },
            async replyComment() {
                try {
                    let commentRequest = {
                        userId: window.localStorage.getItem("id"),
                        comment: this.commentMessage.trim(),
                        hashtags: [],
                        mentions: []
                    };
                    let res = await PostRepository.replyAComment(this.post.id, this.targetCommentID, commentRequest);
                    if (res.status === 200) {
                        for (var ii = 0, len = this.post.comments.length; ii < len; ii++) {
                            if (this.post.comments[ii].id === this.targetCommentID) {
                                this.post.comments[ii].replyComments.push({
                                    user: {
                                        avatar: window.localStorage.getItem("avatar"),
                                        username: window.localStorage.getItem("username")
                                    },
                                    content: this.commentMessage.trim(),
                                    replyComments: [],
                                    createAt: (convertCreateAt("+7.0")).toISOString().slice(0, -1)
                                });
                                this.commentMessage = "";
                                break;
                            }
                        }
                    }
                } catch (e) {
                    eventBus.$emit("notifyError", e.response.data.message)
                }

            }
        }
    };
</script>

<style scoped>
    form {
        display: inline-block;
        position: relative;
        width: 100%;
    }

    form #text {
        padding-right: 4.6em;
        max-height: 160px;
        min-height: 30px;
        resize: horizontal;
        width: 96%;
        overflow: auto !important;
    }

    form img {
        background-color: Transparent;
        position: absolute;
        top: 3.5px;
        right: 30px;
        width: 25px;
        cursor: pointer;
        color: beige;
    }

    .post-title {
        width: 95%;
        word-wrap: break-word;
    }

    form p {
        position: absolute;
        top: 4.5px;
        right: 30px;
        width: 25px;
        cursor: pointer;
    }

    #text {
        font-family: "Roboto", sans-serif;
    }
</style>
