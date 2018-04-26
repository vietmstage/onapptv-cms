import {createStore, applyMiddleware, compose} from 'redux'
import rootReducer from '../reducers'
import {createLogger} from 'redux-logger'
import thunk from 'redux-thunk'
import promise from '../middlewares/promise'
// import dataLoader from '../middlewares/dataloader'

// import {routerMiddleware} from 'react-router-redux'
// import createHistory from 'history/createBrowserHistory'
const NODE_ENV = process.env.NODE_ENV
function configureStore (initialState) {
  const middlewares = [thunk, promise]
  if (NODE_ENV === 'development') middlewares.push(createLogger({ collapsed: true }))
  const enhancer = compose(applyMiddleware(...middlewares));
  // const finalCreateStore = applyMiddleware(...middlewares)(createStore)
  return createStore(rootReducer, initialState, enhancer)
}
const store = configureStore()
export default store