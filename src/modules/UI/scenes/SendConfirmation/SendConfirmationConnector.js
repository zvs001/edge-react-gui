// @flow
import {connect} from 'react-redux'
import SendConfirmation from './SendConfirmation.ui'
import type {FlipInputFieldInfo} from '../../components/FlipInput/FlipInput.ui'

import type {State, Dispatch} from '../../../ReduxTypes'
import type {GuiWallet, GuiDenomination} from '../../../../types'
import type {AbcCurrencyWallet, AbcTransaction, AbcSpendInfo} from 'airbitz-core-types'

import {bns} from 'biggystring'

import * as UTILS from '../../../utils'
import * as CORE_SELECTORS from '../../../Core/selectors.js'
import * as UI_SELECTORS from '../../selectors.js'
import * as SETTINGS_SELECTORS from '../../Settings/selectors.js'

import {
  signBroadcastAndSave,
  updateSpendPending,
  processSpendInfo
} from './action.js'

const mapStateToProps = (state: State, ownProps) => {
  const sendConfirmation = UI_SELECTORS.getSceneState(state, 'sendConfirmation')
  let fiatPerCrypto = 0
  const currencyConverter = CORE_SELECTORS.getCurrencyConverter(state)
  const guiWallet: GuiWallet = UI_SELECTORS.getSelectedWallet(state)
  const abcWallet: AbcCurrencyWallet = CORE_SELECTORS.getWallet(state, guiWallet.id)
  const currencyCode: string = UI_SELECTORS.getSelectedCurrencyCode(state)
  const primaryDisplayDenomination: GuiDenomination = SETTINGS_SELECTORS.getDisplayDenomination(state, currencyCode)
  const primaryExchangeDenomination: GuiDenomination = UI_SELECTORS.getExchangeDenomination(state, currencyCode)
  const secondaryExchangeDenomination: GuiDenomination = UTILS.getDenomFromIsoCode(guiWallet.fiatCurrencyCode)
  const secondaryDisplayDenomination: GuiDenomination = secondaryExchangeDenomination
  const primaryInfo: FlipInputFieldInfo = {
    displayCurrencyCode: currencyCode,
    exchangeCurrencyCode: currencyCode,
    displayDenomination: primaryDisplayDenomination,
    exchangeDenomination: primaryExchangeDenomination
  }
  const secondaryInfo: FlipInputFieldInfo = {
    displayCurrencyCode: guiWallet.fiatCurrencyCode,
    exchangeCurrencyCode: guiWallet.isoFiatCurrencyCode,
    displayDenomination: secondaryDisplayDenomination,
    exchangeDenomination: secondaryExchangeDenomination
  }
  if (guiWallet) {
    const isoFiatCurrencyCode = guiWallet.isoFiatCurrencyCode
    fiatPerCrypto = CORE_SELECTORS.getExchangeRate(state, currencyCode, isoFiatCurrencyCode)
  }

  const {
    error,
    transaction,
    pending
  } = state.ui.scenes.sendConfirmation

  const spendInfo = state.ui.scenes.sendConfirmation.spendInfo || ownProps.spendInfo
  const nativeAmount = spendInfo.spendTargets[0].nativeAmount || '0'

  if (spendInfo) {
    spendInfo.currencyCode = currencyCode
  }

  let errorMsg = null
  if (error && nativeAmount && bns.gt(nativeAmount, '0')) {
    errorMsg = error.message
  }

  let sliderDisabled = true

  if (transaction && !error && !pending) {
    sliderDisabled = false
  }

  return {
    lockedInputs: false,
    sendConfirmation,
    abcWallet,
    nativeAmount,
    errorMsg,
    fiatPerCrypto,
    guiWallet,
    currencyCode,
    primaryInfo,
    sliderDisabled,
    secondaryInfo,
    currencyConverter
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  processSpendInfo: (spendInfo: AbcSpendInfo): any => dispatch(processSpendInfo(spendInfo)),
  updateSpendPending: (pending: boolean): any => dispatch(updateSpendPending(pending)),
  signBroadcastAndSave: (abcTransaction: AbcTransaction): any => dispatch(signBroadcastAndSave(abcTransaction))
})

export default connect(mapStateToProps, mapDispatchToProps)(SendConfirmation)
