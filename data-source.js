const { RESTDataSource } = require('apollo-datasource-rest');

class PostsAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'https://jsonplaceholder.typicode.com/';
  }

  async getPosts() {
    return this.get(`posts/`);
  }
}

class UsersAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'https://jsonplaceholder.typicode.com/';
  }

  async getUsers() {
    return this.get(`users/`);
  }
  async getUser(id){
    return this.get(`users/${id}`);
  }
}

class CommentsAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'https://jsonplaceholder.typicode.com/';
  }

  async getComments() {
    return this.get(`comments/`);
  }
  async getComment(id){
    return this.get(`comments/${id}`);
  }
}

module.exports = { PostsAPI, UsersAPI, CommentsAPI} 