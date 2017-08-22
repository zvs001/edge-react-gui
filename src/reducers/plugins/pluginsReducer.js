// @flow

import type {AbcSpendInfo, AbcTransaction} from 'airbitz-core-types'
const initialState = {
  spendInfo: null,
  shouldLockInputs: false,
  shouldBroadcast: false,
  status: '',
  error: null,
  abcTransaction: null
}

type State = {
  spendInfo: ?AbcSpendInfo,
  shouldLockInputs: boolean,
  shouldBroadcast: boolean,
  status: '' | 'SUCCESS' | 'ERROR' | 'CANCEL',
  error: ?Error,
  abcTransaction: ?AbcTransaction
}
export default (state: State = initialState, action: any): State => {
  const {type, data = {}} = action
  switch (type) {
  case 'TX_BROADCAST_SUCCESS': {
    const {abcTransaction} = data
    return {
      ...state,
      status: 'SUCCESS',
      error: null,
      abcTransaction
    }
  }

  case 'TX_SIGN_SUCCESS': {
    const {abcTransaction} = data
    return {
      ...state,
      status: 'SUCCESS',
      error: null,
      abcTransaction
    }
  }

  case 'TX_SIGN_ERROR': {
    const {error} = data
    return {
      ...state,
      status: 'ERROR',
      error,
      abcTransaction: null
    }
  }

  case 'TX_SIGN_CANCEL': {
    return {
      ...state,
      status: 'CANCEL',
      error: null,
      abcTransaction: null
    }
  }

  case 'RESET': {
    return initialState
  }

  default:
    return state
  }
}
