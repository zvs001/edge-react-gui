// @flow

import { connect } from 'react-redux'

import type { State } from '../../../ReduxTypes'
import * as SETTINGS_SELECTORS from '../../Settings/selectors.js'
import { CreateWalletSelectCrypto as CreateWalletSelectCryptoComponent } from './CreateWalletSelectCrypto.ui.js'
import type { CreateWalletSelectCryptoStateProps } from './CreateWalletSelectCrypto.ui.js'

const mapStateToProps = (state: State): CreateWalletSelectCryptoStateProps => ({
  supportedWalletTypes: SETTINGS_SELECTORS.getSupportedWalletTypes(state),
  dimensions: state.ui.scenes.dimensions
})
const mapDispatchToProps = () => ({})
export const CreateWalletSelectCrypto = connect(mapStateToProps, mapDispatchToProps)(CreateWalletSelectCryptoComponent)
