// @flow

import type { AbcTransaction } from 'edge-core-js'
import { combineReducers } from 'redux'

import type { Action } from '../../../ReduxTypes.js'
import * as ACTION from './action'
import * as WALLET_ACTION from '../../Wallets/action.js'

export type TransactionsState = Array<AbcTransaction>

const transactions = (state: TransactionsState = [], action: Action) => {
  if (!action.data) return state
  switch (action.type) {
    case ACTION.UPDATE_TRANSACTIONS:
      return action.data.transactions
    case WALLET_ACTION.SELECT_WALLET:
      return []
    default:
      return state
  }
}

const visibleTransactions = (state: Array<any> = [], action: Action) => {
  if (!action.data) return state
  switch (action.type) {
    case ACTION.UPDATE_TRANSACTIONS:
      return action.data.groupedTransactionsByDate
    case WALLET_ACTION.SELECT_WALLET:
      return []
    default:
      return state
  }
}

const searchVisible = (state: boolean = false, action: Action) => {
  switch (action.type) {
    case ACTION.TRANSACTIONS_SEARCH_VISIBLE:
      return true
    case ACTION.TRANSACTIONS_SEARCH_HIDDEN:
      return false
    default:
      return state
  }
}

const updatingBalance = (state: boolean = true, action) => {
  switch (action.type) {
    case ACTION.ENABLE_UPDATING_BALANCE:
      return true
    case ACTION.DISABLE_UPDATING_BALANCE:
      return false
    case ACTION.TOGGLE_UPDATING_BALANCE:
      return !state
    default:
      return state
  }
}

const transactionsWalletListModalVisibility = (state = false, action) => {
  switch (action.type) {
    case ACTION.TOGGLE_TRANSACTIONS_WALLET_LIST_MODAL:
      return !state
    default:
      return state
  }
}

const loadingTransactions = (state = false, action) => {
  switch (action.type) {
    case ACTION.START_TRANSACTIONS_LOADING:
      return true
    case ACTION.END_TRANSACTIONS_LOADING:
      return false
    default:
      return state
  }
}

export const transactionList = combineReducers({
  transactions,
  searchVisible,
  updatingBalance,
  transactionsWalletListModalVisibility,
  visibleTransactions,
  loadingTransactions
})

export default transactionList
