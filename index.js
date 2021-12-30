const { ApolloServer, gql } = require('apollo-server');
const  { PostsAPI, UsersAPI, CommentsAPI }  = require('./data-source')

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.
  
  type User {
    id: Int
    name: String
    posts: [Post]
  }

  type Post {
      title: String!
      user: User
      comments: [Comment]
  }

  type Comment {
      id: Int
      email: String
      body: String
      post: Post
  }

  # Queries can fetch a list of libraries
  type Query {
    posts: [Post]
    users: [User]
    getUser(id: Int): User

    #many to many
    getMovie(id: ID): Movie
    getActor(id: ID): Actor

    getMovies: [Movie]
    getActors: [Actor]
  }

  #many to many relation
  type Movie {
    id: ID!
    title: String
    actors: [Actor]
  }
  
  type Actor {
    id: ID!
    name: String
    movies: [Movie]
  }  
    
`;


let movies = [
  { id: '1', title: 'Erin Brockovich',  actorId: ['a', 'b'] },
  { id: '2', title: 'A Good Year',      actorId: ['b', 'c'] },
  { id: '3', title: 'A Beautiful Mind', actorId: ['c'] },
  { id: '4', title: 'Gladiator',        actorId: ['c'] }
];
let actors = [
  { id: 'a', name: 'Julia Roberts', movieId: ['1'] },
  { id: 'b', name: 'Albert Finney', movieId: ['1', '2'] },
  { id: 'c', name: 'Russell Crowe', movieId: ['2', '3', '4'] }
];

// Resolver map
const resolvers = {
    Query: {
      posts: async (_source, {} , {dataSources}) => {
          return dataSources.postsAPI.getPosts();
      },
      users: async (_source, {}, {dataSources}) => {
          return dataSources.usersAPI.getUsers();
      },
      getUser: async (_source, {id}, {dataSources}) => {
        return dataSources.usersAPI.getUser(id);
      },

      //many to many
      getMovie: async (_source, {id}, {dataSources}) => {
        return movies.find((movie) => {
          return movie.id === id
        })
      },

      getActor: async (_source, {id}, {dataSources}) => {
        return actors.find((actor) => actor.id === id)
      },

      getMovies: async () => {
        return movies
      },
      
      getActors: async () => {
        return actors
      }
    },
    User: {
      posts: async (_source, {}, {dataSources}) => {
        return dataSources.postsAPI.getPosts().then((res) => {            
            return res.filter(post => post.userId === _source.id)
        })
      }
    },
    Post: {
      user: async (_source, {}, {dataSources}) => {
          return dataSources.usersAPI.getUser(_source.userId)
      },
      comments: async (_source, {}, {dataSources}) => {
        return dataSources.commentsAPI.getComments().then((res) => {
          return res.filter(comment => comment.postId === _source.id)
        })
      }
    }, 
    
    // many to many
    Movie: {
      actors: async (_source, {}, {dataSources}) => {
         const mov = movies.find((movie) => movie.id === _source.id);
         const res = mov.actorId.map((id) => actors.find((actor) => actor.id === id))
         return res;
        }
    },

    Actor: {
      movies: async (_source, {}, {dataSources}) => {
        const act = actors.find((actor) => actor.id === _source.id);
        const res = act.movieId.map((id) => movies.find((movie) => movie.id == id));
        return res;
      }
    }
    
}
  // The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({ 
                                  typeDefs, 
                                  resolvers, 
                                  dataSources: () => ({ postsAPI : new PostsAPI(), 
                                                        usersAPI: new UsersAPI(),
                                                        commentsAPI: new CommentsAPI }) });

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
