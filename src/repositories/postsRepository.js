import Repository from "./Repository";

const resource = "/post";

const postRepository = Repository
postRepository.defaults.headers.common["Authorization"] = "Bearer " + window.localStorage.getItem("token");

export default {
  getPostsByPage(page) {
    return postRepository.get(`${resource}/post?page=${page}`);
  },
};
