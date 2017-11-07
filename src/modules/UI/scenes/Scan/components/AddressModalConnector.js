// @flow
import {connect} from 'react-redux'
import AddressModal from './AddressModal'
import {toggleAddressModal} from '../action'
import * as UI_SELECTORS from '../../../selectors.js'
import * as CORE_SELECTORS from '../../../../Core/selectors.js'
import {updateSpendInfo} from '../../SendConfirmation/action.js'
import {loginWithEdge} from '../../../../../actions/indexActions'
import type {AbcCurrencyWallet, AbcSpendInfo} from 'airbitz-core-types'
import {Actions} from 'react-native-router-flux'
import * as Constants from '../../../../../constants/indexConstants'

const mapStateToProps = (state: any) => {
  const walletId:string = UI_SELECTORS.getSelectedWalletId(state)
  const coreWallet: AbcCurrencyWallet = CORE_SELECTORS.getWallet(state, walletId)
  const currencyCode:string = UI_SELECTORS.getSelectedCurrencyCode(state)

  return {
    coreWallet,
    currencyCode,
    addressModalVisible: state.ui.scenes.scan.addressModalVisible
  }
}

const mapDispatchToProps = (dispatch: any) => ({
  toggleAddressModal: () => dispatch(toggleAddressModal()),
  updateSpendInfo: (spendInfo: AbcSpendInfo) => dispatch(updateSpendInfo(spendInfo)),
  loginWithEdge: (url: string) => {
    Actions[Constants.EDGE_LOGIN]() ,
    dispatch(loginWithEdge(url))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(AddressModal)
