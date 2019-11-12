import PostsRepository from "./postsRepository";
import AuthRepository from "./authRepository";
const repositories = {
  post: PostsRepository,
  auth: AuthRepository
};

export const RepositoryFactory = {
  get: name => repositories[name]
};
