<template>
    <div class="wrap">
        <div class="content">
            <div class="center">
                <input class="textfield" placeholder="Search" v-debounce="400" v-model.lazy="keywords"/>
            </div>
            <ul class="center ulbar">
                <li><a :class="{btn: true, active:isUser}" @click="changeState">User</a></li>
                <li><a :class="{btn: true, active:isHashtags}" @click="changeState">Hashtags</a></li>
            </ul>
            <div>
                <SearchResult :id="yourId"
                              :users="users"
                              :yourId="yourId"
                              style="width: 90%; height: 90%"
                              v-show="isUser">
                </SearchResult>
                <ul class="ul-list-followers" v-show="isHashtags">
                    <li :key="index" v-for="(hashtag,index) in hashtags">
                        <div class="postuser">
                            <div class="post-avatar" style="margin-left: 10%">
                                <a @click="goHashtagPage(hashtag.id)">
                                    <img alt src="images/hashtag.webp"/>
                                </a>
                            </div>
                            <div class="post-userName">
                                <p>
                                    <a @click="goHashtagPage(hashtag.id)" title>{{hashtag.hashtag}}</a>
                                </p>
                            </div>
                        </div>
                    </li>
                </ul>
                <infinite-loading @infinite="infiniteHandler" spinner="spiral" v-if="keywords!=''">
                    <span slot="no-more">...</span>
                </infinite-loading>
            </div>
        </div>
        <Footer></Footer>
    </div>
</template>

<script>
    import Footer from "@/components/Footer";
    import SearchResult from "./SearchResult";
    import {eventBus} from "../../main";
    import InfiniteLoading from "vue-infinite-loading";
    import {RepositoryFactory} from '@/repositories/RepositoryFactory'

    const UserRepository = RepositoryFactory.get('user');

    function getUnique(arr, comp) {
        const unique = arr
            .map(e => e[comp])
            // store the keys of the unique objects
            .map((e, i, final) => final.indexOf(e) === i && i)
            // eliminate the dead keys & store unique objects
            .filter(e => arr[e]).map(e => arr[e]);
        return unique;
    }

    export default {
        name: "Search",
        components: {
            Footer, SearchResult, InfiniteLoading
        },
        activated() {
            eventBus.$once("updateFollow", this.fetch)
        },
        destroyed() {
            eventBus.$off("updateFollow", this.fetch)
        },
        data() {
            return {
                keywords: '',
                users: [],
                hashtags: [],
                isUser: true,
                isHashtags: false,
                yourId: localStorage.getItem('id'),
                currentPage: 0,
            }
        },
        watch: {
            keywords(after, before) {
                this.currentPage = 0;
                this.fetch();
            }
        },
        methods: {
            infiniteHandler($state) {
                if (this.keywords.length > 0) {
                    setTimeout(() => {
                        if (this.isUser) {
                            this.searchUserByKey($state);
                        } else {
                            this.searchHashtagByKey($state);
                        }
                    }, 1000)
                }
            },

            goHashtagPage(hashtagId) {
                hashtagId
            },
            changeState() {
                this.isUser = !this.isUser;
                this.isHashtags = !this.isHashtags;
                this.currentPage = 0;
                this.fetch();
            },
            async fetch() {
                if (this.keywords.length > 0) {
                    if (this.isUser) {
                        try {
                            let res = await UserRepository.searchUser(this.currentPage, this.keywords);
                            if (res.status === 200) {
                                if (res.data.list) {
                                    this.users = res.data.list;
                                }
                            }
                        } catch (e) {
                            eventBus.$emit("notifyError", e.response.data.message)
                        }
                    } else {
                        try {
                            let res = await UserRepository.searchHashtag(this.currentPage, this.keywords);
                            if (res.status === 200) {
                                if (res.data.list) {
                                    this.hashtags = res.data.list
                                }
                            }
                        } catch (e) {
                            eventBus.$emit("notifyError", e.response.data.message)
                        }
                    }
                }
            },
            async searchUserByKey($state) {
                try {
                    var res = await UserRepository.searchUser(this.currentPage, this.keywords);
                    if (res.status === 200) {
                        var data = res.data;
                        if (data.list.length) {
                            this.currentPage += 1;
                            this.users = getUnique(this.users.concat(data.list), 'id');
                            $state.loaded();
                        } else {
                            $state.complete();
                        }
                    }
                } catch (e) {
                    eventBus.$emit("notifyError", e.response.data.message)
                }
            },
            async searchHashtagByKey($state) {
                try {
                    var res = await UserRepository.searchHashtag(this.currentPage, this.keywords);
                    if (res.status === 200) {
                        var data = res.data;
                        if (data.list.length) {
                            this.currentPage += 1;
                            this.hashtags = getUnique(this.hashtags.concat(data.list), 'id');
                            $state.loaded();
                        } else {
                            $state.complete();
                        }
                    }
                } catch (e) {
                    eventBus.$emit("notifyError", e.response.data.message)
                }
            }
        }
    }
</script>

<style scoped>
    .btn {
        background-color: rgb(229, 229, 240);
        color: black !important;
        border-radius: 15px;
    }

    .active {
        background-color: rgb(183, 183, 204);
    }

    .textfield {
        width: 90% !important;
        padding: 12px 10px;
        margin: 8px 0;
        box-sizing: border-box;
    }

    ul {
        width: 90%;
        height: fit-content;
        list-style-type: none;
        padding: 0;
        margin: 10px auto 0 auto;
        background-color: #f1f1f1;
        overflow: hidden;
    }

    .ulbar li {
        width: calc(50% - 1px);
        float: left;
    }

    .ulbar li a {
        display: block;
        color: black;
        text-align: center;
        padding: 0 16px;
        text-decoration: none;
    }

    /* Change the link color on hover */
    .ulbar li a:hover {
        background-color: #555;
        color: white;
    }

    .postuser {
        display: flex !important;
        align-items: center;
        padding: 0 10px;
        width: 80% !important;
    }
</style>
