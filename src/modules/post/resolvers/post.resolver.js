const { composeResolvers } = require('@graphql-tools/resolvers-composition');
const isAuthenticated = require('../../../middlewares/isAuthenticated');
const hasRole = require('../../../middlewares/hasRole');
const verifyToken = require('../../../middlewares/verifyToken');
const resolvers = require('./post._resolver');

const resolversComposition = {
    'Query.posts': [verifyToken(), isAuthenticated(), hasRole('admin')],
    'Query.findPostById': [verifyToken(), isAuthenticated(), hasRole('admin')],
    'Query.findPosts': [verifyToken(), isAuthenticated(), hasRole('admin')],
    'Mutation.createPost': [verifyToken(), isAuthenticated(), hasRole('admin')],
    'Mutation.putPost': [verifyToken(), isAuthenticated(), hasRole('admin')],
    'Mutation.patchPost': [verifyToken(), isAuthenticated(), hasRole('admin')],
    'Mutation.removePost': [verifyToken(), isAuthenticated(), hasRole('admin')],
}

const composedResolvers = composeResolvers(resolvers, resolversComposition);
module.exports = composedResolvers;