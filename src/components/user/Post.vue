<template>
    <ul class="ul-list-post">
        <li :key="index" v-for="(post,index) in posts">
            <a title>
                <img :src="post.photos[0].photoUri" @click="$router.push({name: 'postdetail', query:{id: post.id}})"
                     alt/>
            </a>
        </li>
        <infinite-loading @infinite="infiniteHandler" spinner="spiral">
            <span slot="no-more">...</span>
            <div slot="no-results">No post found</div>
        </infinite-loading>
    </ul>
</template>

<script>
    import InfiniteLoading from "vue-infinite-loading";
    import {RepositoryFactory} from '@/repositories/RepositoryFactory'
    import {eventBus} from "@/main";

    const UserRepository = RepositoryFactory.get('user');

    export default {
        components: {
            InfiniteLoading
        },

        props: {
            id: String
        },

        data() {
            return {
                posts: [],
                page: 0
            };
        },

        methods: {
            infiniteHandler($state) {
                setTimeout(() => {
                    try {
                        this.fetchMyPosts($state)
                    } catch (e) {
                        eventBus.$emit("notifyError", e.response.data.message)
                    }
                }, 1000);
            },
            async fetchMyPosts($state) {
                var res = await UserRepository.getMyPosts(this.id, this.page);
                if (res.status === 200) {
                    var data = res.data;
                    if (data.list.length) {
                        this.posts = this.posts.concat(data.list);
                        this.page++;
                        $state.loaded();
                    } else {
                        $state.complete();
                    }
                }
            }
        }
    };
</script>
