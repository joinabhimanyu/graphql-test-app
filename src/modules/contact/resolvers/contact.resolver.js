const { composeResolvers } = require('@graphql-tools/resolvers-composition');
const isAuthenticated = require('../../../middlewares/isAuthenticated');
const verifyToken = require('../../../middlewares/verifyToken');
const hasRole = require('../../../middlewares/hasRole');
const resolvers = require('./contact._resolver');

const resolversComposition = {
    'Query.contacts': [verifyToken(), isAuthenticated(), hasRole('admin')],
    'Query.findContactById': [verifyToken(), isAuthenticated(), hasRole('admin')],
    'Query.findContacts': [verifyToken(), isAuthenticated(), hasRole('admin')],
    'Mutation.createContact': [verifyToken(), isAuthenticated(), hasRole('admin')],
    'Mutation.putContact': [verifyToken(), isAuthenticated(), hasRole('admin')],
    'Mutation.patchContact': [verifyToken(), isAuthenticated(), hasRole('admin')],
    'Mutation.removeContact': [verifyToken(), isAuthenticated(), hasRole('admin')],
}

const composedResolvers = composeResolvers(resolvers, resolversComposition);
module.exports = composedResolvers;