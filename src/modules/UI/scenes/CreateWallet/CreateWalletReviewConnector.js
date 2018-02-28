// @flow

import { connect } from 'react-redux'

import type { Dispatch, State } from '../../../ReduxTypes'
import { getSupportedFiats } from '../../../utils.js'
import { getSupportedWalletTypes } from '../../Settings/selectors.js'
import { createCurrencyWallet } from './action'
import { CreateWalletReview as CreateWalletReviewConnector } from './CreateWalletReview.ui'
import type { CreateWalletReviewDispatchProps } from './CreateWalletReview.ui'

const mapStateToProps = (state: State) => {
  const nextState = {
    isCreatingWallet: state.ui.scenes.createWallet.isCreatingWallet,
    supportedWalletTypes: getSupportedWalletTypes(state),
    supportedFiats: getSupportedFiats()
  }

  // auto select fiat USD and crypto Bluecoin
  nextState.selectedFiat = nextState.supportedFiats[nextState.supportedFiats.findIndex((fiatType) => fiatType.value === 'USD')]
  nextState.selectedWalletType = nextState.supportedWalletTypes[nextState.supportedWalletTypes.findIndex((walletType) => walletType.value === 'wallet:bluecoin')]

  return nextState
}

const mapDispatchToProps = (dispatch: Dispatch): CreateWalletReviewDispatchProps => ({
  createCurrencyWallet: (walletName: string, walletType: string, fiatCurrencyCode: string) => {
    dispatch(createCurrencyWallet(walletName, walletType, fiatCurrencyCode))
  }
})

export const CreateWalletReview = connect(mapStateToProps, mapDispatchToProps)(CreateWalletReviewConnector)
