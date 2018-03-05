// @flow

import React, { Component } from 'react'
import { ActivityIndicator, Alert, Text, View, TouchableHighlight, FlatList, Image } from 'react-native'
import FAIcon from 'react-native-vector-icons/FontAwesome'
import Ionicon from 'react-native-vector-icons/Ionicons'
// $FlowFixMe
import ImagePicker from 'react-native-image-picker'
import { Actions } from 'react-native-router-flux'
import Camera from 'react-native-camera'
import type { AbcCurrencyWallet, AbcParsedUri } from 'edge-login'

import s from '../../../../locales/strings.js'
import * as WALLET_API from '../../../Core/Wallets/api.js'
import * as UTILS from '../../../utils.js'

import styles from './style'
import ABAlert from '../../components/ABAlert/indexABAlert'

import type {PermissionStatus} from '../../../ReduxTypes'

import BleManager from 'react-native-ble-manager'
import bleHelper from './BluetoothWatcher'

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
  }

  render () {
    return (
      <View style={styles.container}>
        <View style={{width: '100%'}}>
          <FlatList
            extraData={this.state}
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
    return (
      <TouchableHighlight onPress={() => this.onItemClick(item.id)}>
        <View style={styles.bluetoothItem}>
          <View style={styles.bluetoothItemStatus}>
            {
              item.connecting
                ? <ActivityIndicator size="small" color="#1998C7"/>
                : <Image
                  style={styles.bluetoothItemStatusBle}
                  source={require('../../../../assets/images/bluecoin/bluetooth.png')}
                />
            }
          </View>
          <Text style={styles.bluetoothItemText}>{item.name}</Text>
        </View>
      </TouchableHighlight>
    )
  }

  async onItemClick (id) {
    this._connectingStatus(id)
    try {
      await BleManager.enableBluetooth()
      await BleManager.socketConnect(id)
      await bleHelper.bleWatcherListener(BleManager.emitter, 'STATE_CONNECTED')
      setTimeout(() => {
        BleManager.socketWrite('getTxURI')
      }, 700)
      const uri = await bleHelper.bleWatcherListener(BleManager.emitter, 'READ')
      this.parseURI(uri)
      console.log('Bluetooth URI', uri)
    } catch (e) {
      console.log('onItemClick Error', e)
    }
    this._connectingStatus()
    BleManager.socketClose()
  }

  _connectingStatus (id) {
    const { bluetoothDevices } = this.state
    bluetoothDevices.forEach(item => {
      delete item.connecting
      if (item.id === id) item.connecting = true
    })
    this.setState({ bluetoothDevices })
    console.log(bluetoothDevices)
    this.render()
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
