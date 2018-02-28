import { combineReducers } from 'redux'

import * as Constants from '../../constants/indexConstants'
// @flow
import type { State } from '../ReduxTypes'
import errorAlert from './components/ErrorAlert/reducer'
import transactionAlert from './components/TransactionAlert/reducer'
import contacts from './contacts/reducer'
import { request } from './Request/reducer.js'
import { scenes } from './scenes/reducer.js'
import { settings } from './Settings/reducer.js'
import { wallets } from './Wallets/reducer.js'

export const uiReducer = combineReducers({
  errorAlert,
  transactionAlert,
  scenes,
  wallets,
  request,
  settings,
  contacts
})

export const ui = (state: $PropertyType<State, 'ui'>, action: any) => {
  if (action.type === Constants.LOGOUT || action.type === Constants.DEEP_LINK_RECEIVED) {
    return uiReducer(undefined, ({ type: 'DUMMY_ACTION_PLEASE_IGNORE' }: any))
  }

  return uiReducer(state, action)
}
