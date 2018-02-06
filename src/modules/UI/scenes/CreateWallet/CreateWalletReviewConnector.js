// @flow

import {connect} from 'react-redux'
// eslint-disable-next-line no-duplicate-imports
import {
  CreateWalletReviewComponent
} from './CreateWalletReview.ui'
// eslint-disable-next-line no-duplicate-imports
import type {
  CreateWalletReviewDispatchProps
} from './CreateWalletReview.ui'
import {createCurrencyWallet} from './action'
import type {State, Dispatch} from '../../../ReduxTypes'
import {getSupportedFiats} from '../../../utils.js'
import {getSupportedWalletTypes} from '../../Settings/selectors.js'

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
  createCurrencyWallet: (walletName: string, walletType: string, fiatCurrencyCode: string): any => dispatch(createCurrencyWallet(walletName, walletType, fiatCurrencyCode))
})

export const CreateWalletReview = connect(mapStateToProps, mapDispatchToProps)(CreateWalletReviewComponent)
