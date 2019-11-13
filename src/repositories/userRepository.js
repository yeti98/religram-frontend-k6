import Repository from "./Repository";

const resource = "/user/";

const userRepository = Repository
userRepository.defaults.headers.common["Authorization"] = "Bearer " + window.localStorage.getItem("token");

export default {
    getPostsByPage(page) {
        return userRepository.get(`${resource}/post?page=${page}`);
    },
    getPostById(id) {
        return userRepository.get(`${resource}/post/${id}`);
    },
    like(postId){
        return userRepository.post(`${resource}/post/${postId}/like`);
    }
};
