import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

// import { 
//   makeExecutableSchema,
//   addMockFunctionsToSchema
// } from 'graphql-tools';
//  import { mockNetworkInterfaceWithSchema } from 'apollo-test-utils';
 import { typeDefs } from './graphql/schema';
// const schema = makeExecutableSchema({ typeDefs });
// addMockFunctionsToSchema({ schema });
// const mockNetworkInterface = mockNetworkInterfaceWithSchema({ schema });

// const { makeExecutableSchema } = require('graphql-tools')

// // SCHEMA DEFINITION
// const typeDefs = `
// type Query {
//   user(id: ID!): User
// }
// type User {
//   id: ID!
//   name: String
// }`

// // RESOLVERS
// const resolvers = {
//   Query: {
//     user: (root, args, context, info) => {
//       return (args.id)
//     }
//   },
// }

// // (EXECUTABLE) SCHEMA
// const schema = makeExecutableSchema({
//   typeDefs,
//   resolvers
// })

// import {
//   makeExecutableSchema,
//   addMockFunctionsToSchema,
//   mergeSchemas,
// } from 'graphql-tools';


// const chirpSchema = makeExecutableSchema({
//   typeDefs
// });

// addMockFunctionsToSchema({ schema: chirpSchema });

export const graphqlClient = new ApolloClient({
  link: new HttpLink({ uri: 'http://13.250.57.10:3001/graphql' }),
  cache: new InMemoryCache({addTypename: false})
});

export const client = require('graphql-client')({
  url: 'http://13.250.57.10:3001/graphql'
})