// @flow

import React, { Component } from 'react'
import { ActivityIndicator, Alert, Text, View, TouchableHighlight, FlatList, NativeEventEmitter, NativeModules, Image } from 'react-native'
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

import BleManager from 'react-native-ble-manager'

const BleManagerModule = NativeModules.BleManager
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule)

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
      currentTab: 'camera',
      bluetoothDevices: [],
      status: ''
    }
  }

  async componentDidMount () {
    BleManager.start({showAlert: false})
    await BleManager.enableBluetooth()
    const list = await BleManager.getBondedPeripherals()
    this.setState({ bluetoothDevices: list })

    this.watcherSocket = bleManagerEmitter.addListener('BleSocketServiceEvent', (msg) => {
      console.log('BleSocketServiceEvent SCAN', msg)
      switch (msg.event) {
        case 'STATE_LISTEN|NONE':
          this.setState({status: ''})
          break
        case 'STATE_CONNECTING':
          this.setState({status: 'Connecting'})
          break
        case 'STATE_CONNECTED':
          this.setState({status: 'Connected'})
          break
        case 'read': // here we will receive parsedUriString
          this.parseURI(msg.text)
          break
      }
    })
  }

  componentWillUnmount () {
    if (this.watcherSocket) this.watcherSocket.remove()
  }

  render () {
    console.log(this.props)
    return (
      <View style={styles.container}>
        <View style={{width: '100%'}}>
          <FlatList
            style={styles.bluetoothList}
            data={this.state.bluetoothDevices}
            renderItem={item => this.renderBluetoothItem(item)}
            keyExtractor={(item, index) => item.id}
          />
        </View>
        <ABAlert />
      </View>
    )
  }

  renderBluetoothItem ({ item }) {
    console.log(item)
    return (
      <TouchableHighlight onPress={() => this.onItemClick(item.id)}>
        <View style={styles.bluetoothItem}>
          <View style={styles.bluetoothItemStatus}>
            <Image
              style={styles.bluetoothItemStatusBle}
              source={require('../../../../assets/images/bluecoin/bluetooth.png')}
            />
          </View>
          <Text style={styles.bluetoothItemText}>{item.name}</Text>
        </View>
      </TouchableHighlight>
    )
  }

  onItemClick (id) {
    BleManager.socketConnect(id).then(res => {
      console.log('socketConnect success', res)
    }).catch(
      err => console.error('err', err)
    )
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
}
