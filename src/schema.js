const { makeExecutableSchema } = require('graphql-tools');
const { mergeTypeDefs, mergeResolvers } = require('@graphql-tools/merge');
const { loadFiles } = require('@graphql-tools/load-files');
const path = require('path');
// const resolvers = require('./modules/post/resolvers/post.resolver');
// const typeDefs = require('./modules/post/graphqlSchema');
// #3 Import GraphQL type definitions

const createExecutableSchema = async () => {
  const typeDefs = await loadFiles(path.join(__dirname, 'modules/**/types/**/*.schema.graphql'));
  const resolvers = await loadFiles(path.join(__dirname, 'modules/**/resolvers/**/*.resolver.js'));
  const mtypedefs=mergeTypeDefs(typeDefs);
  const mresolvers=mergeResolvers(resolvers);
  const executableSchema = makeExecutableSchema({
    typeDefs: mtypedefs,
    resolvers: mresolvers
  });
  return executableSchema;
}

module.exports = createExecutableSchema;
