// @flow

import type {AbcSpendInfo, AbcTransaction} from 'airbitz-core-types'

type RequestSignTx = {
  abcSpendInfo: AbcSpendInfo,
  lockInputs: boolean,
  broadcast: boolean
}

export const requestSignTx = ({abcSpendInfo, lockInputs, broadcast}: RequestSignTx) => {
  return {
    type: 'PLUGINS/REQUEST_SIGN_TX',
    data: {
      abcSpendInfo,
      broadcast,
      lockInputs
    }
  }
}

export const onBroadcastTxSuccess = (abcTransaction: AbcTransaction) => {
  return {
    type: 'PLUGINS/TX_BROADCAST_SUCCESS',
    data: {
      status: 'SUCCESS',
      error: null,
      abcTransaction
    }
  }
}

export const onSignTxSuccess = (abcTransaction: AbcTransaction) => {
  return {
    type: 'PLUGINS/TX_SIGN_SUCCESS',
    data: {
      status: 'SUCCESS',
      error: null,
      abcTransaction
    }
  }
}

export const onSignTxError = (error: Error) => {
  return {
    type: 'PLUGINS/TX_SIGN_ERROR',
    data: {
      status: 'ERROR',
      error,
      abcTransaction: null
    }
  }
}

export const onSignTxCancel = () => {
  return {
    type: 'PLUGINS/TX_SIGN_CANCEL',
    data: {
      status: 'CANCEL',
      error: null,
      abcTransaction: null
    }
  }
}
