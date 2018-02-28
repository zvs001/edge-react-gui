import { bns } from 'biggystring'
import type { AbcMetadata, AbcParsedUri, AbcTransaction } from 'edge-login'
// @flow
import { Actions } from 'react-native-router-flux'

import { OPEN_AB_ALERT } from '../../../../constants/indexConstants'
import { getWallet } from '../../../Core/selectors.js'
import { broadcastTransaction, getMaxSpendable, makeSpend, saveTransaction, signTransaction } from '../../../Core/Wallets/api.js'
import type { Dispatch, GetState } from '../../../ReduxTypes'
import { openABAlert } from '../../components/ABAlert/action'
import { getSelectedWalletId } from '../../selectors.js'
import { GuiMakeSpendInfo, getSpendInfo, getTransaction } from './selectors'

const PREFIX = 'UI/SendConfimation/'

export const UPDATE_LABEL = PREFIX + 'UPDATE_LABEL'
export const UPDATE_IS_KEYBOARD_VISIBLE = PREFIX + 'UPDATE_IS_KEYBOARD_VISIBLE'
export const UPDATE_SPEND_PENDING = PREFIX + 'UPDATE_SPEND_PENDING'
export const RESET = PREFIX + 'RESET'
export const UPDATE_TRANSACTION = PREFIX + 'UPDATE_TRANSACTION'

export const updateAmount = (nativeAmount: string, exchangeAmount: string, fiatPerCrypto: string) => (dispatch: Dispatch, getState: GetState) => {
  const amountFiatString: string = bns.mul(exchangeAmount, fiatPerCrypto)
  const amountFiat: number = parseFloat(amountFiatString)
  const metadata: AbcMetadata = { amountFiat }
  dispatch(createTX({ nativeAmount, metadata }, false))
}

export const createTX = (parsedUri: GuiMakeSpendInfo | AbcParsedUri, forceUpdateGui?: boolean = true) => (dispatch: Dispatch, getState: GetState) => {
  const state = getState()
  const walletId = getSelectedWalletId(state)
  const abcWallet = getWallet(state, walletId)
  const parsedUriClone = { ...parsedUri }
  const spendInfo = getSpendInfo(state, parsedUriClone)
  makeSpend(abcWallet, spendInfo)
    .then(abcTransaction => {
      dispatch(updateTransaction(abcTransaction, parsedUriClone, forceUpdateGui, null))
    })
    .catch(e => dispatch(updateTransaction(null, parsedUriClone, forceUpdateGui, e)))
}

export const updateMaxSpend = () => (dispatch: Dispatch, getState: GetState) => {
  const state = getState()
  const walletId = getSelectedWalletId(state)
  const abcWallet = getWallet(state, walletId)
  const spendInfo = getSpendInfo(state)
  getMaxSpendable(abcWallet, spendInfo)
    .then(nativeAmount => {
      const amount: AbcParsedUri = { nativeAmount }
      dispatch(createTX(amount, true))
    })
    .catch(e => console.log(e))
}

export const signBroadcastAndSave = () => async (dispatch: Dispatch, getState: GetState) => {
  const state = getState()
  const selectedWalletId = getSelectedWalletId(state)
  const wallet = getWallet(state, selectedWalletId)
  const abcUnsignedTransaction = getTransaction(state)
  let abcSignedTransaction = abcUnsignedTransaction
  dispatch(updateSpendPending(true))
  try {
    abcSignedTransaction = await signTransaction(wallet, abcUnsignedTransaction)
    abcSignedTransaction = await broadcastTransaction(wallet, abcSignedTransaction)
    await saveTransaction(wallet, abcSignedTransaction)
    dispatch(updateSpendPending(false))
    Actions.pop()
    const successInfo = {
      success: true,
      title: 'Transaction Sent',
      message: 'Your transaction has been successfully sent.'
    }
    dispatch(openABAlert(OPEN_AB_ALERT, successInfo))
  } catch (e) {
    dispatch(updateSpendPending(false))
    const errorInfo = {
      success: false,
      title: 'Transaction Failure',
      message: e.message
    }
    dispatch(updateTransaction(abcSignedTransaction, null, true, new Error('broadcastError')))
    dispatch(openABAlert(OPEN_AB_ALERT, errorInfo))
  }
}

export const updateLabel = (label: string) => ({
  type: UPDATE_LABEL,
  data: { label }
})

export const reset = () => ({
  type: RESET,
  data: {}
})

export const updateTransaction = (transaction: ?AbcTransaction, parsedUri: ?AbcParsedUri, forceUpdateGui: ?boolean, error: ?Error) => ({
  type: UPDATE_TRANSACTION,
  data: { transaction, parsedUri, forceUpdateGui, error }
})

export const updateSpendPending = (pending: boolean) => ({
  type: UPDATE_SPEND_PENDING,
  data: { pending }
})

export { createTX as updateMiningFees, createTX as updateParsedURI }
