// @flow

import { Actions } from 'react-native-router-flux'
import { connect } from 'react-redux'

import type { Dispatch, State } from '../../../ReduxTypes'
import * as UTILS from '../../../utils'
import * as SETTINGS_SELECTORS from '../../Settings/selectors'
import { dismissTransactionAlert } from './actions.js'
import TransactionAlert from './TransactionAlert.ui'

const mapStateToProps = (state: State) => {
  const abcTransaction = state.ui.transactionAlert.abcTransaction
  const displayAlert = state.ui.transactionAlert.displayAlert
  if (!displayAlert || !abcTransaction) return {}

  const { nativeAmount, currencyCode } = abcTransaction
  const displayDenomination = SETTINGS_SELECTORS.getDisplayDenomination(state, currencyCode || 'ETH')
  // $FlowFixMe
  const { symbol: displaySymbol, name: displayName, multiplier: displayMultiplier } = displayDenomination
  const displayAmount = UTILS.convertNativeToDisplay(displayMultiplier)(nativeAmount)
  const viewTransaction = () => Actions.transactionDetails({ abcTransaction })

  return {
    displayAlert,
    displayName,
    displayAmount,
    displaySymbol,
    viewTransaction
  }
}
const mapDispatchToProps = (dispatch: Dispatch) => ({
  dismissAlert: () => dispatch(dismissTransactionAlert())
})

export default connect(mapStateToProps, mapDispatchToProps)(TransactionAlert)
