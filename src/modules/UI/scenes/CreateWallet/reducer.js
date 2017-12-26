import {combineReducers} from 'redux'
import * as ACTION from './action'

const isCreatingWallet = (state = false, action) => {
  switch (action.type) {
  case ACTION.CREATE_WALLET_START:
    return true
  case ACTION.CREATE_WALLET_SUCCESS:
    return false
  default:
    return state
  }
}

const createWallet = combineReducers({
  isCreatingWallet
})

export default createWallet
