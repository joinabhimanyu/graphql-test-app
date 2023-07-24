// #1 Import Express and Apollo Server
const express = require('express');
const cors = require('cors');
const { ApolloServer } = require('apollo-server-express');

// #2 Import mongoose
const mongoose = require('./config/database');

const createExecutableSchema = require('./schema');

const startServer = async () => {
  const port = 3000;
  // #5 Initialize an Apollo server
  const schema = await createExecutableSchema();
  const server = new ApolloServer({
    playground: false, schema, context: async ({ req }) => {
      // get the user token from the headers
      const token = req.headers.authorization || req.headers.Authorization || req.headers["x-access-token"] || '';
      console.log('token: ', JSON.stringify(token));
      return {
        token
      }
    }
  });

  // #6 Initialize an Express application
  const app = express();
  app.use('*', cors({ origin: `http://localhost:${port}` }));
  // #7 Use the Express application as middleware in Apollo server
  server.applyMiddleware({ app });

  // #8 Set the port that the Express application will listen to
  app.listen({ port: 3000 }, () => {
    console.log(`Server running on http://localhost:${port}${server.graphqlPath}`);
  });
}

startServer().catch((error) => {
  console.error(error)
  process.exit(1)
});

// const { ApolloServer }=require('apollo-server-express');
// const GraphiQL=require('apollo-server-module-graphiql');

// const express=require('express');

// const schema=require('./schema');

// const { execute, subscribe }=require('graphql');
// const { createServer, Server }=require('http');
// const { SubscriptionServer }=require('subscriptions-transport-ws');
// const url=require('url');

// // type ExpressGraphQLOptionsFunction = (req?: express.Request, res?: express.Response) => any | Promise<any>;

// function graphiqlExpress(options) {
//   const graphiqlHandler = (req, res, next) => {
//     const query = req.url && url.parse(req.url, true).query;
//     GraphiQL.resolveGraphiQLString(query, options, req).then(
//       (graphiqlString) => {
//         res.setHeader('Content-Type', 'text/html');
//         res.write(graphiqlString);
//         res.end();
//       },
//       (error) => next(error)
//     );
//   };

//   return graphiqlHandler;
// }

// const startServer= async (port) => {
//   const app = express();

//   const server = createServer(app);

//   const apolloServer = new ApolloServer({
//     playground: false,
//     schema
//   });

//   apolloServer.applyMiddleware({ app, path: '/graphql' });

//   if (module.hot) {
//     app.use(
//       '/graphiql',
//       graphiqlExpress({
//         endpointURL: '/graphql',
//         query:
//           '# Welcome to your own GraphQL server!\n#\n' +
//           '# Press Play button above to execute GraphQL query\n#\n' +
//           '# You can start editing source code and see results immediately\n\n' +
//           'query hello($subject:String) {\n  hello(subject: $subject)\n}',
//         subscriptionsEndpoint: `ws://localhost:${port}/subscriptions`,
//         variables: { subject: 'World' }
//       })
//     );
//   }

//   return new Promise(resolve => {
//     server.listen(port, () => {
//       // tslint:disable-next-line
//       new SubscriptionServer(
//         {
//           execute,
//           schema,
//           subscribe
//         },
//         {
//           path: '/subscriptions',
//           server
//         }
//       );
//       resolve(server);
//     });
//   });
// };

// module.exports=startServer;