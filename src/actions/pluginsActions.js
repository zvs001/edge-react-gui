// @flow

import type {AbcSpendInfo, AbcTransaction} from 'airbitz-core-types'

export const requestSignTx = (spendInfo: AbcSpendInfo) => {
  return {
    type: 'REQUEST_SIGN_TX',
    data: {
      spendInfo,
      shouldBroadcast: false,
      shouldLockInputs: false
    }
  }
}

export const requestLockedSignTx = (spendInfo: AbcSpendInfo) => {
  return {
    type: 'REQUEST_LOCKED_SIGN_TX',
    data: {
      spendInfo,
      shouldBroadcast: false,
      shouldLockInputs: true
    }
  }
}

export const requestSignBroadcastTx = (spendInfo: AbcSpendInfo) => {
  return {
    type: 'REQUEST_SIGN_BROADCAST_TX',
    data: {
      spendInfo,
      shouldBroadcast: true,
      shouldLockInputs: false
    }
  }
}

export const requestLockedSignBroadcastTx = (spendInfo: AbcSpendInfo) => {
  return {
    type: 'REQUEST_LOCKED_SIGN_TX',
    data: {
      spendInfo,
      shouldBroadcast: true,
      shouldLockInputs: true
    }
  }
}

export const onBroadcastTxSuccess = (abcTransaction: AbcTransaction) => {
  return {
    type: 'TX_BROADCAST_SUCCESS',
    data: {
      status: 'SUCCESS',
      error: null,
      abcTransaction
    }
  }
}

export const onSignTxSuccess = (abcTransaction: AbcTransaction) => {
  return {
    type: 'TX_SIGN_SUCCESS',
    data: {
      status: 'SUCCESS',
      error: null,
      abcTransaction
    }
  }
}

export const onSignTxError = (error: Error) => {
  return {
    type: 'TX_SIGN_ERROR',
    data: {
      status: 'ERROR',
      error,
      abcTransaction: null
    }
  }
}

export const onSignTxCancel = () => {
  return {
    type: 'TX_SIGN_CANCEL',
    data: {
      status: 'CANCEL',
      error: null,
      abcTransaction: null
    }
  }
}
