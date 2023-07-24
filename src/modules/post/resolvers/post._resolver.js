// #1 Import the model created with mongoose
const Post = require('../models/post.model');

// #2 Create resolver functions to handle GraphQL queries
/**
 * Query resolver "posts" must return values in response to
 * the query "posts" in GraphQL schema.
 */
const resolvers = {
  Query: {
    hello: (obj, { subject }) => {
      return `Hello, ${subject}! from Server`;
    },
    // Query which returns posts list
    posts: async () => await Post.find({}).exec(),
    findPostById: async (parent, {id})=> await Post.findById(id).exec(),
    findPosts: async (parent, {params})=>{
      if (params) {
        const query={};
        query['$and']=[];
        if (params.title) {
          query['$and'].push({title:params.title});
        }
        if (params.author) {
          query['$and'].push({author:params.author});
        }
        if (params.body) {
          query['$and'].push({body:{$regex:params.body}});
        }
        if (params.hidden) {
          query['$and'].push({hidden:params.hidden});
        }
        if (params.favs) {
          query['$and'].push({"meta.favs":params.favs});
        }
        if (params.votes) {
          query['$and'].push({"meta.votes":params.votes});
        }
        return await Post.find(query).exec();
      }
      return await Post.find({}).exec();
    }
  },

  /**
   * Mutation resolver addPost creates a new document in MongoDB
   * in response to the "addPost" mutation in GraphQL schema.
   * The mutation resolvers must return the created object.
   */
  Mutation: {
    createPost: async (parent, { input }) => {
      try {
        // Create a new record in the database
        const newPost = new Post({ ...input });
        // Save the record and return it
        const p = await newPost.save();
        return { post: p, msg: false };
      } catch (error) {
        console.log(error);
        return { post: null, msg: true };
      }
    },
    putPost: async (parent, { input }) => {
      try {
        const p = await Post.findOneAndReplace({ title: input.title }, { ...input }).exec();
        return { post: p, msg: false };
      } catch (error) {
        console.log(error);
        return { post: null, msg: true };
      }
    },
    patchPost: async (parent, { input }) => {
      try {
        const p = await Post.findByIdAndUpdate(input._id, { ...input }).exec();
        return { post: p, msg: false };
      } catch (error) {
        console.log(error);
        return { post: null, msg: true };
      }
    },
    removePost: async (parent, { id }) => {
      try {
        await Post.findByIdAndDelete(id).exec();
        return { success: true, msg: false };
      } catch (error) {
        console.log(error);
        return { success: false, msg: true };
      }
    }
  }
};

module.exports = resolvers;
