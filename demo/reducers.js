import { combineReducers } from 'redux'
import notifications from '../src/notifications.redux'
import demo from './demo.redux.js'

const todoApp = combineReducers({
  notifications,
  demo
})

export default todoApp
