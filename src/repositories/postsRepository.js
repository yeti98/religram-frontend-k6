import Repository from "./Repository";

const resource = "/post";

const postRepository = Repository
postRepository.defaults.headers.common["Authorization"] = "Bearer " + window.localStorage.getItem("token");

export default {
  getPostsByPage(page) {
    return postRepository.get(`${resource}/post?page=${page}`);
  },
  getPostById(id) {
    return postRepository.get(`${resource}/post/${id}`);
  },
  like(postId){
    return postRepository.post(`${resource}/post/${postId}/like`);
  },
  comment(postId, commentRequest){
    return postRepository.post(`${resource}/post/${postId}/comment`, commentRequest);
  },
  replyAComment(postId, commentId, commentRequest){
    return postRepository.post(`${resource}/post/${postId}/comment/${commentId}`, commentRequest);
  },
  createPost(postRequest){
    return postRepository.post(`${resource}/post`, postRequest);
  }
};
