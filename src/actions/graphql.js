import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import graphql from 'graphql-client'
import store from '../store/configureStore'
export const graphqlClient = new ApolloClient({
  link: new HttpLink({ uri: 'http://contentkit-prod.ap-southeast-1.elasticbeanstalk.com/graphql' }),
  cache: new InMemoryCache({addTypename: false})
});

export const client = () => {
  return graphql({
    url: 'http://contentkit-prod.ap-southeast-1.elasticbeanstalk.com/graphql',
    headers: {
      Authorization: store.getState().project.get('selected').toJS().projectToken
    }
  })
}