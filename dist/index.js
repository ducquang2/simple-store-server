const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { WebSocketServer } = require('ws');
const { useServer } = require('graphql-ws/lib/use/ws');
const { expressMiddleware } = require('@apollo/server/express4');
const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const { createServer } = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { PubSub } = require('graphql-subscriptions');
// const pubsub = new PubSub();
const { JsonDB, Config } = require('node-json-db');
const { v4 } = require('uuid');
var db = new JsonDB(new Config("myDataBase", true, false, '/'));
db.push('/users', []);
// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = `#graphql
  type User {
    id: ID
    username: String
    password: String
  }

  type Query {
    users: [User]
  }

  type Mutation {
    SignIn(username: String!, password: String!): User
    SignUp(username: String!, password: String!): User
  }
`;
const resolvers = {
    Query: {
        users: async () => {
            const res = await db.getData("/users");
            console.log(res);
            return db.getData("/users");
        },
    },
    Mutation: {
        SignIn: (parent, args, context, info) => {
            return args;
        },
        SignUp: async (parent, args, context, info) => {
            const users = await db.getData('/users');
            const exist = users.find(x => x.username.toLowerCase() === args.username.toLowerCase());
            if (!exist) {
                await db.push("/users", [...users, { ...args, id: v4() }]);
                return args;
            }
            else {
                throw Error('User exist');
            }
        },
    }
};
// const server = new ApolloServer({
//   typeDefs,
//   resolvers,
// });
// startStandaloneServer(server, {
//   listen: { port: 4000 },
// }).then(({ url }) => console.log(`🚀  Server ready at: ${url}`))
const app = express();
const httpServer = createServer(app);
const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql',
});
const schema = makeExecutableSchema({ typeDefs, resolvers });
const serverCleanup = useServer({ schema }, wsServer);
const server = new ApolloServer({
    schema,
    plugins: [
        // Proper shutdown for the HTTP server.
        ApolloServerPluginDrainHttpServer({ httpServer }),
        // Proper shutdown for the WebSocket server.
        {
            async serverWillStart() {
                return {
                    async drainServer() {
                        await serverCleanup.dispose();
                    },
                };
            },
        },
    ],
});
server.start().then(() => {
    app.use('/graphql', cors(), bodyParser.json(), expressMiddleware(server));
    const PORT = 4000;
    // Now that our HTTP server is fully set up, we can listen to it.
    httpServer.listen(PORT, () => {
        console.log(`Server is now running on http://localhost:${PORT}/graphql`);
    });
});
