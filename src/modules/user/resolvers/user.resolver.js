const { composeResolvers } = require('@graphql-tools/resolvers-composition');
const isAuthenticated = require('../../../middlewares/isAuthenticated');
const verifyToken = require('../../../middlewares/verifyToken');
const hasRole = require('../../../middlewares/hasRole');
const resolvers = require('./user._resolver');

const resolversComposition = {
    'Query.users': [verifyToken(), isAuthenticated(), hasRole('admin')],
    'Mutation.createUser': [verifyToken(), isAuthenticated(), hasRole('admin')],
    'Mutation.putUser': [verifyToken(), isAuthenticated(), hasRole('admin')],
    'Mutation.patchUser': [verifyToken(), isAuthenticated(), hasRole('admin')],
    'Mutation.removeUser': [verifyToken(), isAuthenticated(), hasRole('admin')],
}

const composedResolvers = composeResolvers(resolvers, resolversComposition);
module.exports = composedResolvers;