// @flow

import React, { Component } from 'react'
import { ActivityIndicator, Alert, Text, View, TouchableHighlight } from 'react-native'
import FAIcon from 'react-native-vector-icons/FontAwesome'
import Ionicon from 'react-native-vector-icons/Ionicons'
// $FlowFixMe
import ImagePicker from 'react-native-image-picker'
import { Actions } from 'react-native-router-flux'
import Camera from 'react-native-camera'
import type { AbcCurrencyWallet, AbcParsedUri } from 'edge-login'

import s from '../../../../locales/strings.js'
import T from '../../components/FormattedText'
import Gradient from '../../components/Gradient/Gradient.ui'
import SafeAreaView from '../../components/SafeAreaView'
import AddressModal from './components/AddressModalConnector'
import { AUTHORIZED, DENIED } from '../../permissions'
import * as WALLET_API from '../../../Core/Wallets/api.js'
import * as UTILS from '../../../utils.js'

import styles, { styles as styleRaw } from './style'
import ABAlert from '../../components/ABAlert/indexABAlert'

import WalletListModal from '../../../UI/components/WalletListModal/WalletListModalConnector'
import * as Constants from '../../../../constants/indexConstants'

import type {PermissionStatus} from '../../../ReduxTypes'

import BluetoothScan from './BluetoothScan.ui'
import CameraScan from './CameraScan.ui'

type Props = {
  cameraPermission: PermissionStatus,
  abcWallet: AbcCurrencyWallet,
  torchEnabled: boolean,
  scanEnabled: boolean,
  walletListModalVisible: boolean,
  scanToWalletListModalVisibility: any,
  dispatchEnableScan(): void,
  dispatchDisableScan(): void,
  toggleEnableTorch(): void,
  toggleAddressModal(): void,
  toggleWalletListModal(): void,
  updateParsedURI(AbcParsedUri): void,
  loginWithEdge(string): void,
  toggleScanToWalletListModal: () => void
}

const HEADER_TEXT = s.strings.send_scan_header_text

const DENIED_PERMISSION_TEXT = '' // blank string because way off-centered (not sure reason why)
// const TRANSFER_TEXT = s.strings.fragment_send_transfer
const ADDRESS_TEXT = s.strings.fragment_send_address
// const PHOTOS_TEXT   = s.strings.fragment_send_photos
const FLASH_TEXT = s.strings.fragment_send_flash

export default class Scan extends Component<Props> {
  constructor () {
    super()

    this.state = {
      currentTab: 'camera'
    }
  }

  changeToTab (name) {
    if (this.state.currentTab !== name) this.setState({currentTab: name})
  }

  render () {
    return (
      <SafeAreaView>
        <View style={{ flex: 1 }}>
          <Gradient style={styles.gradient} />

          <Gradient style={[styles.overlayTabAreaWrap]}>

            <TouchableHighlight
              style={this.state.currentTab === 'camera' ? styles.bottomButton : styles.bottomButtonDisabled}
              onPress={() => this.changeToTab('camera')} underlayColor={styleRaw.underlay.color}>
              <View style={styles.bottomButtonTextWrap}>
                <FAIcon style={[styles.addressCameraIcon]} name="camera" />
              </View>
            </TouchableHighlight>

            <TouchableHighlight
              style={this.state.currentTab === 'bluetooth' ? styles.bottomButton : styles.bottomButtonDisabled}
              onPress={() => this.changeToTab('bluetooth')} underlayColor={styleRaw.underlay.color}>
              <View style={styles.bottomButtonTextWrap}>
                <FAIcon style={[styles.addressBluetoothIcon]} name="bluetooth" />
              </View>
            </TouchableHighlight>

          </Gradient>

          <View style={styles.topSpacer} />

          {this.state.currentTab === 'camera' && <CameraScan {...this.props} />}
          {this.state.currentTab === 'bluetooth' && <BluetoothScan {...this.props} />}

          {this.renderDropUp()}
        </View>
      </SafeAreaView>
    )
  }

  renderDropUp = () => {
    if (this.props.showToWalletModal) {
      return <WalletListModal topDisplacement={Constants.SCAN_WALLET_DIALOG_TOP} type={Constants.FROM} />
    }
    return null
  }

  _onToggleTorch = () => {
    this.props.toggleEnableTorch()
  }

  _onToggleAddressModal = () => {
    this.props.toggleAddressModal()
  }

  _onToggleWalletListModal = () => {
    this.props.toggleScanToWalletListModal()
  }

  onBarCodeRead = (scan: { data: any }) => {
    if (!this.props.scanEnabled) return
    const uri = scan.data
    this.parseURI(uri)
  }

  parseURI = (uri: string) => {
    try {
      if (/^airbitz:\/\/edge\//.test(uri)) {
        this.props.loginWithEdge(uri)
        return
      }
      const parsedURI = WALLET_API.parseURI(this.props.abcWallet, uri)
      this.props.updateParsedURI(parsedURI)
      Actions.sendConfirmation()
    } catch (error) {
      this.props.dispatchDisableScan()
      Alert.alert(s.strings.fragment_send_send_bitcoin_unscannable, error.toString(), [{ text: s.strings.string_ok, onPress: () => this.props.dispatchEnableScan() }])
    }
  }

  selectPhotoTapped = () => {
    const options = { takePhotoButtonTitle: null }

    ImagePicker.showImagePicker(options, response => {
      if (!response.didCancel && !response.error && !response.customButton) {
        // this.refs.cameraCapture.capture({})
        // You can also display the image using data:
        // let source = { uri: 'data:image/jpeg;base64,' + response.data };
        // TODO: make edgelogin work with image picker - paulvp
        /* if (/^airbitz:\/\/edge\//.test(uri)) {
          console.log('EDGE LOGIN THIS IS A EDGE LOGIN , do the login stuff. ')
          return
        } */
        Actions.sendConfirmation()
      }
    })
  }

  renderCamera = () => {
    if (this.props.cameraPermission === AUTHORIZED) {
      const torchMode = this.props.torchEnabled ? Camera.constants.TorchMode.on : Camera.constants.TorchMode.off

      return <Camera style={styles.preview}
        ref="cameraCapture"
        torchMode={torchMode}
        onBarCodeRead={this.onBarCodeRead} />
    } else if (this.props.cameraPermission === DENIED) {
      return (
        <View style={[styles.preview, { justifyContent: 'center', alignItems: 'center' }, UTILS.border()]}>
          <Text>{DENIED_PERMISSION_TEXT}</Text>
        </View>
      )
    } else {
      return (
        <View style={[{ flex: 1, justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator size="large" style={{ flex: 1, alignSelf: 'center' }} />
        </View>
      )
    }
  }
}
