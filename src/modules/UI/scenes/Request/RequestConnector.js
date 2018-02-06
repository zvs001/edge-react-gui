// @flow

import {connect} from 'react-redux'
import { type RequestStateProps, type RequestDispatchProps, Request } from './Request.ui'

import * as CORE_SELECTORS from '../../../Core/selectors.js'
import * as UI_SELECTORS from '../../selectors.js'
import * as SETTINGS_SELECTORS from '../../Settings/selectors.js'

import {saveReceiveAddress} from './action.js'
import {getDenomFromIsoCode} from '../../../utils'

import type {AbcCurrencyWallet} from 'edge-login'
import type {GuiDenomination, GuiWallet, GuiCurrencyInfo} from '../../../../types'
import type {Dispatch, State} from '../../../ReduxTypes'

const emptyDenomination: GuiDenomination = {
  name: '',
  symbol: '',
  multiplier: '',
  precision: 0,
  currencyCode: ''
}
const emptyInfo: GuiCurrencyInfo = {
  displayCurrencyCode: '',
  exchangeCurrencyCode: '',
  displayDenomination: emptyDenomination,
  exchangeDenomination: emptyDenomination
}

const mapStateToProps = (state: State): RequestStateProps => {
  let exchangeSecondaryToPrimaryRatio: number = 0
  const guiWallet: GuiWallet = UI_SELECTORS.getSelectedWallet(state)
  const currencyCode: string = UI_SELECTORS.getSelectedCurrencyCode(state)
  if (!guiWallet || !currencyCode) {
    return {
      loading: true,
      request: {},
      abcWallet: null,
      guiWallet: null,
      exchangeSecondaryToPrimaryRatio: 0,
      currencyCode: '',
      primaryCurrencyInfo: emptyInfo,
      secondaryCurrencyInfo: emptyInfo,
      showToWalletModal: false
    }
  }

  const abcWallet: AbcCurrencyWallet = CORE_SELECTORS.getWallet(state, guiWallet.id)
  // $FlowFixMe
  const primaryDisplayDenomination: GuiDenomination = SETTINGS_SELECTORS.getDisplayDenomination(state, currencyCode)
  const primaryExchangeDenomination: GuiDenomination = UI_SELECTORS.getExchangeDenomination(state, currencyCode)
  const secondaryExchangeDenomination: GuiDenomination = getDenomFromIsoCode(guiWallet.fiatCurrencyCode)
  const secondaryDisplayDenomination: GuiDenomination = secondaryExchangeDenomination
  const primaryExchangeCurrencyCode: string = primaryExchangeDenomination.name
  const secondaryExchangeCurrencyCode: string = secondaryExchangeDenomination.currencyCode ? secondaryExchangeDenomination.currencyCode : ''

  const primaryCurrencyInfo: GuiCurrencyInfo = {
    displayCurrencyCode: currencyCode,
    displayDenomination: primaryDisplayDenomination,
    exchangeCurrencyCode: primaryExchangeCurrencyCode,
    exchangeDenomination: primaryExchangeDenomination
  }
  const secondaryCurrencyInfo: GuiCurrencyInfo = {
    displayCurrencyCode: guiWallet.fiatCurrencyCode,
    displayDenomination: secondaryDisplayDenomination,
    exchangeCurrencyCode: secondaryExchangeCurrencyCode,
    exchangeDenomination: secondaryExchangeDenomination
  }
  if (guiWallet) {
    const isoFiatCurrencyCode: string = guiWallet.isoFiatCurrencyCode
    exchangeSecondaryToPrimaryRatio = CORE_SELECTORS.getExchangeRate(state, currencyCode, isoFiatCurrencyCode)
  }

  return {
    loading: false,
    request: state.ui.scenes.request,
    abcWallet,
    exchangeSecondaryToPrimaryRatio,
    guiWallet,
    currencyCode,
    primaryCurrencyInfo,
    secondaryCurrencyInfo,
    showToWalletModal: state.ui.scenes.scan.scanToWalletListModalVisibility
  }
}
const mapDispatchToProps = (dispatch: Dispatch): RequestDispatchProps => ({
  saveReceiveAddress: (receiveAddress) => dispatch(saveReceiveAddress(receiveAddress))
})

export default connect(mapStateToProps, mapDispatchToProps)(Request)
