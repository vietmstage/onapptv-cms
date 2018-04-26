import {Map, List} from 'immutable'
const initialState = Map({
  list: List(),
  selected: Map()
})

export default function projectReducer (state = initialState, action) {
  switch (action.type) {
    case 'GET_PROJECT_LIST':
      return state.merge({
        list: action.result
      })
    case 'ADD_NEW_PROJECT':
      const currentList = state.get('list').toJS()
      currentList.push(action.result)
      return state.merge({
        list: currentList
      })
    case 'CHANGE_APP':
      return state.merge({
        selected: action.payload
      })
    default:
      return state
  }
}
