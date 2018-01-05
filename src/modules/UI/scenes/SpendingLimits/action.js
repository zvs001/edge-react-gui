// @flow

const PREFIX = 'SPENDING_LIMITS/'

export const UPDATE_TRANSACTION_SPENDING_LIMIT_START   = PREFIX + 'UPDATE_TRANSACTION_SPENDING_LIMIT'
export const UPDATE_TRANSACTION_SPENDING_LIMIT_SUCCESS = PREFIX + 'UPDATE_TRANSACTION_SPENDING_LIMIT'
export const UPDATE_TRANSACTION_SPENDING_LIMIT_ERROR   = PREFIX + 'UPDATE_TRANSACTION_SPENDING_LIMIT'

export const UPDATE_DAILY_SPENDING_LIMIT_START   = PREFIX + 'UPDATE_DAILY_SPENDING_LIMIT'
export const UPDATE_DAILY_SPENDING_LIMIT_SUCCESS = PREFIX + 'UPDATE_DAILY_SPENDING_LIMIT'
export const UPDATE_DAILY_SPENDING_LIMIT_ERROR   = PREFIX + 'UPDATE_DAILY_SPENDING_LIMIT'

import type {Dispatch, GetState} from '../../../ReduxTypes'

import * as CORE_SELECTORS from '../../../Core/selectors'
import * as SETTINGS_API from '../../../Core/Account/settings'

export const updateTransactionSpendingLimit = (currencyCode: string, isEnabled: boolean, transactionSpendingLimit: string) => (dispatch: Dispatch, getState: GetState) => {
  dispatch(updateTransactionSpendingLimitStart(currencyCode, isEnabled, transactionSpendingLimit))

  const state = getState()
  const account = CORE_SELECTORS.getAccount(state)

  return SETTINGS_API.setTransactionSpendingLimitRequest(account, currencyCode, isEnabled, transactionSpendingLimit)
    .then(() => dispatch(updateTransactionSpendingLimitSuccess(currencyCode, isEnabled, transactionSpendingLimit)))
    .catch((error) => dispatch(updateTransactionSpendingLimitError(error)))
}

export const updateTransactionSpendingLimitStart = (currencyCode: string, isEnabled: boolean, transactionSpendingLimit: string) => ({
  type: UPDATE_TRANSACTION_SPENDING_LIMIT_START,
  data: {
    currencyCode,
    isEnabled,
    transactionSpendingLimit
  }
})

export const updateTransactionSpendingLimitSuccess = (currencyCode: string, isEnabled: boolean, transactionSpendingLimit: string) => ({
  type: UPDATE_TRANSACTION_SPENDING_LIMIT_SUCCESS,
  data: {
    currencyCode,
    isEnabled,
    transactionSpendingLimit
  }
})

export const updateTransactionSpendingLimitError = (error: Error) => ({
  type: UPDATE_TRANSACTION_SPENDING_LIMIT_ERROR,
  data: {error}
})

export const updateDailySpendingLimit = (currencyCode: string, isEnabled: boolean, dailySpendingLimit: string) => (dispatch: Dispatch, getState: GetState) => {
  dispatch(updateDailySpendingLimitStart(currencyCode, isEnabled,dailySpendingLimit))

  const state = getState()
  const account = CORE_SELECTORS.getAccount(state)

  return SETTINGS_API.setDailySpendingLimitRequest(account, currencyCode, isEnabled, dailySpendingLimit)
  .then(() => dispatch(updateDailySpendingLimitSuccess(currencyCode, isEnabled, dailySpendingLimit)))
  .catch((error) => dispatch(updateDailySpendingLimitError(error)))
}

export const updateDailySpendingLimitStart = (currencyCode: string, isEnabled: boolean, dailySpendingLimit: string) => ({
  type: UPDATE_DAILY_SPENDING_LIMIT_START,
  data: {
    currencyCode,
    dailySpendingLimit
  }
})

export const updateDailySpendingLimitSuccess = (currencyCode: string, isEnabled: boolean, dailySpendingLimit: string) => ({
  type: UPDATE_DAILY_SPENDING_LIMIT_SUCCESS,
  data: {
    currencyCode,
    dailySpendingLimit
  }
})

export const updateDailySpendingLimitError = (error: Error) => ({
  type: UPDATE_DAILY_SPENDING_LIMIT_ERROR,
  data: {error}
})
