<template>
    <div>
        <div class="box-back box-back-v2">
            <a @click="$router.push({name: 'home'})">
                <i aria-hidden="true" class="fa fa-angle-left"></i>Photo
            </a>
        </div>
        <div class="content">
            <div class="post-list">
                <div class="post-comment__item">
                    <div class="post-user">
                        <div class="post-avatar">
                            <a>
                                <img :src="post.user.avatar" alt/>
                            </a>
                        </div>
                        <div class="post-userName">
                            <p>
                                <a>{{post.user.username}}</a>
                            </p>
                            <p>
                <span class="post-date">
                  <timeago :autoUpdate="1" :datetime="post.createAt"></timeago>
                </span>
                            </p>
                        </div>
                    </div>
                    <div class="post-image">
                        <p class="post-thumb">
                            <img :src="post.photos[0].photoUri" alt/>
                        </p>
                    </div>
                    <div class="post-event">
                        <p>
              <span :class="{'post-icon-like': true, active: isLike}" @click="likePost">
                <a></a>
              </span>
                            <span @click="goToComment" class="post-icon-comment">
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
                        <readMore :text="post.content"></readMore>
                    </div>
                    <div class="post-comment">
                        <p @click="viewMoreCm"
                           class="post-view-all"
                           style="cursor: pointer"
                           v-if="cmShow.length< cmCount"
                        >View more {{cmCount - cmShow.length}} comments</p>
                        <div :key="comment.id" id="comment" v-for="comment in cmShow">
                            <comment :comment="comment" :postID="post.id" :targetComment="comment"
                                     key="commentpostdetail"></comment>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!--        TODO: mention and hashtag-->
        <form @submit.prevent="postComment">
            <textarea-autosize
                    :max-height="350"
                    :min-height="25"
                    id="text"
                    placeholder="Add comment..."
                    ref="commentBox"
                    v-model="commentMessage"
            />
            <p @click="postComment"
               style="color: rgb(25, 122, 255);"
               v-if="commentMessage.trim() != ''">post</p>
            <p style="color: rgb(199, 241, 247); cursor: default" v-else>post</p>
        </form>
        <footers key="footerpostdetail"></footers>
    </div>
</template>
<script>
    import Footers from "@/components/Footer";
    import Comment from "@/components/home/Comment";
    import ReadMore from "@/components/home/ReadMore";
    import {eventBus} from "@/main";
    import {RepositoryFactory} from '@/repositories/RepositoryFactory'

    const PostRepository = RepositoryFactory.get('post');

    function convertCreateAt(offset) {
        var d = new Date();
        var utc = d.getTime() + (d.getTimezoneOffset() * 60000);
        var nd = new Date(utc + (3600000 * offset));
        return nd;
    }

    export default {
        components: {
            Footers,
            Comment,
            ReadMore,
        },
        created() {
            this.id = this.$route.query.id;
            this.getDataPost();
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
                id: "",
                post: {},
                isLike: false,
                likeCount: 0,
                cmShow: [],
                cmCount: 0,
                index: 0,
                commentMessage: "",
                isReply: false,
                targetCommentID: {
                    default: -1,
                    type: Number
                },
                keywords: "",
                processed_mentions: [],
                processed_hashtags: [],
                selectedUser: Object,
                options: [],
                isUser: true,
                currentPage: 0,
            };
        },
        watch: {
            //TODO: Mention Hashtag
        },
        methods: {
            async getDataPost() {
                try {
                    var res = await PostRepository.getPostById(this.id);
                    if (res.status === 200) {
                        this.post = res.data;
                        let id = localStorage.getItem("id");
                        for (let i = 0; i < this.post.likes.length; i++) {
                            if (this.post.likes[i].user.id === id) {
                                this.isLike = true;
                                break;
                            }
                        }
                        this.likeCount = this.post.likes.length;
                        this.cmCount = this.post.comments.length;
                        this.index = this.post.comments.length - 1;
                        if (this.post.comments.length < 10)
                            this.cmShow = this.cmShow.concat(this.post.comments);
                        else {
                            if (this.index > 0) {
                                let des = this.index - 9;
                                if (des < 0) des = 0;

                                for (let i = this.index; i >= des; i--) {
                                    this.cmShow.unshift(this.post.comments[i]);
                                }
                                this.index = des - 1;
                            }
                        }
                    }
                } catch (e) {
                    //console.log(e)
                }
            },

            viewMoreCm() {
                if (this.index > 0) {
                    let des = this.index - 9;
                    if (des < 0) des = 0;
                    for (let i = this.index; i >= des; i--) {
                        this.cmShow.unshift(this.post.comments[i]);
                    }
                    this.index = des - 1;
                }
            },

            async postComment() {
                if (!this.isReply) {
                    this.mainComment()
                    let formData = {
                        type: "comment",
                        targetUser: this.post.user.id,
                        image: this.post.photos[0].photoUri,
                        postId: this.post.id
                    };
                    this.$store.dispatch("saveNewActivity", formData);
                } else {
                    this.replyComment();
                    this.isReply = !this.isReply;
                    let formData = {
                        type: "comment",
                        targetUser: this.post.user.id,
                        image: this.post.photos[0].photoUri,
                        postId: this.post.id
                    };
                    this.$store.dispatch("saveNewActivity", formData);
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
            },
            async mainComment() {
                try {
                    let commentRequest = {
                        userId: window.localStorage.getItem("id"),
                        comment: this.commentMessage.trim(),
                        hashtags: [],
                        mentions: []
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
                let formData = {
                    type: "like",
                    targetUser: this.post.user.id,
                    image: this.post.photos[0].photoUri,
                    postId: this.post.id
                };
                this.$store.dispatch("saveNewActivity", formData);
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
                        localStorage.setItem(this.post.id, this.isLike);
                    }
                } catch (e) {
                    // console.log(e.response);
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
            goToComment() {
                window.scrollTo(0, document.body.scrollHeight);
                this.$refs.commentBox.$el.focus();
            },
        }
    }

</script>
<style scoped>
    form {
        display: inline-block;
        position: relative;
        width: 100%;
    }

    form #text {
        padding-right: 4.6em;
        resize: none;
        width: 96%;
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

    /*.captionarea {*/
    /*    height: auto !important;*/
    /*    width: auto;*/
    /*    min-height: 30px;*/
    /*    max-height: 350px;*/
    /*    overflow-y: scroll;*/
    /*    resize: none !important;*/
    /*    alignment: left;*/
    /*}*/
</style>
