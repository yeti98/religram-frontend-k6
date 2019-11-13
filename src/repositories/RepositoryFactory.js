import PostsRepository from "./postsRepository";
import AuthRepository from "./authRepository";
import UserRepository from "./userRepository";
const repositories = {
  post: PostsRepository,
  auth: AuthRepository,
  user: UserRepository
};

export const RepositoryFactory = {
  get: name => repositories[name]
};
