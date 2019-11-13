import Repository from "./Repository";

const resource = "/user";

const userRepository = Repository;
userRepository.defaults.headers.common["Authorization"] = "Bearer " + window.localStorage.getItem("token");

export default {
    getUserById(userId) {
        return userRepository.get(`${resource}/${userId}`);
    },
    getFollowers(userId) {
        return userRepository.get(`${resource}/${userId}/follower`);
    },
    getFollowings(userId) {
        return userRepository.get(`${resource}/${userId}/following`);
    },
    follow(targetId) {
        return userRepository.post(`${resource}/follow/${targetId}`);
    },
    getMyPosts(userId, page) {
        return userRepository.get(`${resource}/${userId}/posts?page=${page}`)
    },
    changeuserinfo(dataRequest){
        return userRepository.post(`${resource}`, dataRequest);
    }
};
