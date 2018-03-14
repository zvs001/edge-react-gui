import type { AbcCurrencyWallet, AbcParsedUri } from 'edge-core-js'
// @flow
import React, { Component } from 'react'
import { Alert, Clipboard } from 'react-native'
import { Actions } from 'react-native-router-flux'
import FAIcon from 'react-native-vector-icons/FontAwesome'
import { sprintf } from 'sprintf-js'

import * as Constants from '../../../../../constants/indexConstants'
import s from '../../../../../locales/strings.js'
import { colors } from '../../../../../theme/variables/airbitz.js'
import * as WALLET_API from '../../../../Core/Wallets/api.js'
import StylizedModal from '../../../components/Modal/Modal.ui'
import styles from '../style'
import { AddressInput } from './AddressInput.js'
import { AddressInputButtons } from './AddressInputButtons.js'

type Props = {
  coreWallet: AbcCurrencyWallet,
  currencyCode: string,
  addressModalVisible: boolean,
  toggleAddressModal(): void,
  updateParsedURI(AbcParsedUri): void,
  loginWithEdge(string): void,
  onExitButtonFxn: void
}
type State = {
  uri: string,
  clipboard: string
}

export default class AddressModal extends Component<Props, State> {
  componentWillMount () {
    this.setState({
      uri: '',
      clipboard: ''
    })
  }

  _setClipboard (props: Props) {
    const coreWallet = props.coreWallet
    Clipboard.getString().then(uri => {
      try {
        // Will throw in case uri is invalid
        WALLET_API.parseURI(coreWallet, uri)
        // console.log('AddressModal parsedURI', parsedURI)
        this.setState({
          clipboard: uri
        })
      } catch (e) {
        // console.log('Clipboard does not contain a valid address.')
        // console.log(`Clipboard: ${uri}`)
        // console.log(e)
      }
    })
  }

  _flushUri () {
    this.setState({
      uri: ''
    })
  }

  componentDidMount () {
    this._setClipboard(this.props)
  }

  componentWillReceiveProps (nextProps: Props) {
    this._setClipboard(nextProps)
    const uriShouldBeCleaned = !this.props.addressModalVisible && !!this.state.uri.length
    if (uriShouldBeCleaned) {
      this._flushUri()
    }
  }

  render () {
    const icon = <FAIcon name={Constants.ADDRESS_BOOK_O} size={24} color={colors.primary} style={styles.icon} />

    const copyMessage = this.state.clipboard ? sprintf(s.strings.string_paste_address, this.state.clipboard) : null
    const middle = (
      <AddressInput
        copyMessage={copyMessage}
        onChangeText={this.onChangeText}
        onSubmit={this.onSubmit}
        onPaste={this.onPasteFromClipboard}
        uri={this.state.uri}
      />
    )

    const bottom = <AddressInputButtons onSubmit={this.onSubmit} onCancel={this.onCancel} />

    return (
      <StylizedModal
        featuredIcon={icon}
        headerText={s.strings.fragment_send_address_dialog_title}
        modalMiddle={middle}
        modalBottom={bottom}
        visibilityBoolean={this.props.addressModalVisible}
        onExitButtonFxn={this.props.onExitButtonFxn}
        style={copyMessage && styles.withAddressCopied}
      />
    )
  }

  onPasteFromClipboard = () => {
    this.setState({ uri: this.state.clipboard }, this.onSubmit)
  }

  onSubmit = () => {
    const uri = this.state.uri
    // We want to check to see if the url is an edge login.

    if (/^airbitz:\/\/edge\//.test(uri)) {
      this.props.loginWithEdge(uri)
      return
    }

    const coreWallet = this.props.coreWallet
    try {
      const parsedURI = WALLET_API.parseURI(coreWallet, uri)
      parsedURI.currencyCode = this.props.currencyCode // remove when Ethereum addresses support indicating currencyCodes

      // console.log('AddressModal parsedURI', parsedURI)
      this.props.toggleAddressModal()
      this.props.updateParsedURI(parsedURI)
      Actions.sendConfirmation('fromScan')
    } catch (e) {
      Alert.alert('Invalid Address', 'The address you input is not a valid address.')
      // console.log(e)
    }
  }
  onCancel = () => {
    this.props.toggleAddressModal()
  }

  onChangeText = (uri: string) => {
    this.setState({ uri })
  }
}
