// @flow
import {type AbcTransaction} from 'airbitz-core-types'

const PREFIX = 'UI/components/TransactionAlert/'
export const DISPLAY_TRANSACTION_ALERT = PREFIX + 'DISPLAY_TRANSACTION_ALERT'
export const DISMISS_TRANSACTION_ALERT = PREFIX + 'DISMISS_TRANSACTION_ALERT'

export const displayTransactionAlert = (abcTransaction: AbcTransaction) => ({
  type: DISPLAY_TRANSACTION_ALERT,
  data: {abcTransaction}
})

export const dismissTransactionAlert = () => ({
  type: DISMISS_TRANSACTION_ALERT,
  data: {abcTransaction: ''}
})
