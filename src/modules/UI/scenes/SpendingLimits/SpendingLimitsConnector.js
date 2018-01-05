// @flow

import {connect} from 'react-redux'

import type {Dispatch, State} from '../../../ReduxTypes'
import {updateDailySpendingLimit, updateTransactionSpendingLimit} from './action.js'
import SpendingLimits from './SpendingLimits.ui.js'

import * as SETTINGS_SELECTORS from '../../Settings/selectors.js'

export const mapStateToProps = (state: State, ownProps: Object) => ({
  pluginName: ownProps.pluginName,
  isTransactionSpendingLimitEnabled: SETTINGS_SELECTORS.getIsTransactionSpendingLimitEnabled(state, ownProps.currencyCode),
  transactionSpendingLimit:          SETTINGS_SELECTORS.getTransactionSpendingLimit(state, ownProps.currencyCode),
  isDailySpendingLimitEnabled:       SETTINGS_SELECTORS.getIsDailySpendingLimitEnabled(state, ownProps.currencyCode),
  isDailySpendingLimit:              SETTINGS_SELECTORS.getDailySpendingLimit(state, ownProps.currencyCode),
})
export const mapDispatchToProps = (dispatch: Dispatch) => ({
  updateDailySpendingLimit: (currencyCode: string, isEnabled: boolean, dailySpendingLimit: string) => {
    dispatch(updateDailySpendingLimit(currencyCode, isEnabled, dailySpendingLimit))
  },
  updateTransactionSpendingLimit: (currencyCode: string, isEnabled: boolean, dailySpendingLimit: string) => {
    dispatch(updateTransactionSpendingLimit(currencyCode, isEnabled,  dailySpendingLimit))
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(SpendingLimits)
