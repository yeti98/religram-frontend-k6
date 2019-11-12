<template>
    <div class="wrap">
        <div class="content">
            <div class="post-list" v-for="(post,index) in posts" :key="index">
                <post :post="post"></post>
                <br />
                <br />
            </div>
            <infinite-loading @infinite="infiniteHandler" spinner="spiral">
                <span slot="no-more">...</span>
                <div slot="no-results">No post found</div>
            </infinite-loading>
        </div>
        <footers key="footerhome" @reload="reload"></footers>
    </div>
</template>

<script>
    import {RepositoryFactory} from '@/repositories/RepositoryFactory'
    import Footers from "@/components/Footer.vue";
    import Post from "@/components/home/Post";
    import InfiniteLoading from "vue-infinite-loading";
    const PostRepository = RepositoryFactory.get('post');

    export default {
        name: "home",
        components: {
            Footers,
            Post,
            InfiniteLoading
        },


        methods: {
            infiniteHandler($state) {
                setTimeout(() => {
                    try {
                        this.fetchAllPosts($state)
                    }
                    catch (e) {
                        // console.log(e);
                    }
                }, 1000);
            },

            reload() {
                location.reload();
            },
            async fetchAllPosts($state) {
                var res = await PostRepository.getPostsByPage(this.page)
                if (res.status === 200) {
                    var data = res.data
                    if (data.list.length) {
                        this.posts = this.posts.concat(data.list);
                        this.page++;
                        $state.loaded();
                    } else {
                        $state.complete();
                    }
                }
            }
        },

        data() {
            return {
                posts: [],
                page: 0
            };
        },
        mounted() {
            if (localStorage.getItem("token") === null) {
                this.$router.push("/login");
            }
        }
    };
</script>

<style>
    a {
        cursor: pointer;
    }
</style>
