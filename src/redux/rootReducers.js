import { combineReducers } from 'redux'

import demo from './demo/reducer'
import common from './common/reducer'
import article from './article/reducer'
import user from './user/reducer'

export default combineReducers({
  demo,
  common,
  article,
  user
})
