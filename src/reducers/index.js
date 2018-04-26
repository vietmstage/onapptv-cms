import {combineReducers} from 'redux'
import {routerReducer as router} from 'react-router-redux'
import project from './project'
const appReducer = combineReducers({
  project,
  router
})

export default appReducer