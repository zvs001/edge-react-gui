// @flow

import React, { Component } from 'react'
import { ActivityIndicator, Alert, Text, View, TouchableHighlight, FlatList, Image, TouchableOpacity, NativeAppEventEmitter, DeviceEventEmitter, PermissionsAndroid } from 'react-native'
import FAIcon from 'react-native-vector-icons/FontAwesome'
import Ionicon from 'react-native-vector-icons/Ionicons'
import _ from 'lodash'
// $FlowFixMe
import ImagePicker from 'react-native-image-picker'
import { Actions } from 'react-native-router-flux'
import Camera from 'react-native-camera'
import type { AbcCurrencyWallet, AbcParsedUri } from 'edge-login'

import s from '../../../../locales/strings.js'
import * as WALLET_API from '../../../Core/Wallets/api.js'
import * as UTILS from '../../../utils.js'

import { LOCATION } from '../../permissions'
import type { Permission } from '../../permissions'

import styles from './style'
import ABAlert from '../../components/ABAlert/indexABAlert'

import type {PermissionStatus} from '../../../ReduxTypes'

import BleManager from 'react-native-ble-manager'
import bleHelper from './BluetoothWatcher'
import BluetoothSerial from 'react-native-android-bluetooth-discovery'

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
  toggleScanToWalletListModal: () => void,
  requestPermission: (permission: Permission) => void,
}

export default class Scan extends Component<Props> {
  constructor () {
    super()

    this.state = {
      currentTab: 'camera',
      bluetoothDevices: [],
      status: '',
      error_message: null,
      discovering: false,
      unpairedDevices: []
    }
  }

  async componentDidMount () {
    BleManager.start({showAlert: false})
    await BleManager.enableBluetooth()
    const list = await BleManager.getBondedPeripherals()
    this.setState({ bluetoothDevices: list })

    BluetoothSerial.on('deviceFound', (device) => {
      console.log('deviceFound', device)
      if (device.name) {
        const { unpairedDevices } = this.state
        if (_.findIndex(unpairedDevices, device) === -1) {
          this.setState({unpairedDevices: unpairedDevices.concat(device)})
        }
      }
    })
    BluetoothSerial.on('deviceDiscoveryFinish', () => {
      this.setState({ discovering: false })
    })
  }

  async componentWillUnmount () {
    console.log('Will Unmount')
    if (this.state.discovering) {
      BluetoothSerial.cancelDiscovery()
    }
    this.setState({discovering: false, error_message: null, unpairedDevices: []})
  }

  async requestLocationPermission () {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION
      )
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You received access to location')
        this.discoverUnpaired()
      } else {
        console.log('You didn\'t receive access to location')
        this.setState({ error_message: 'Location permission denied' })
      }
    } catch (err) {
      console.warn(err)
      this.setState({ error_message: 'Unknown error' })
    }
  }

  async discoverUnpaired () {
    const isEnabled = await BluetoothSerial.isEnabled()

    if (this.state.discovering) {
      return false
    } else if (!isEnabled) {
      this.setState({ error_message: 'Currently Bluetooth is disabled' })
      return false
    } else {
      this.setState({ discovering: true, error_message: null, unpairedDevices: [] })
      BluetoothSerial.doDiscovery()
    }
  }

  renderDiscoveredDevises () {
    const errorMessage = this.state.error_message || null
    if (errorMessage) {
      return (
        <Text style={styles.error_message}>{errorMessage}</Text>
      )
    } else {
      return null
    }
  }

  render () {
    const text = this.state.discovering ? 'Scanning...' : 'Scan'
    const list = this.state.bluetoothDevices.concat(this.state.unpairedDevices)

    return (
      <View style={styles.container}>
        <View style={{width: '100%', flexDirection: 'column'}}>
          <TouchableOpacity onPress={() => this.requestLocationPermission()}>
            <View style={styles.bluetoothScanButton}>
              <Text style={styles.bluetoothScanButtonText}>{text}</Text>
            </View>
          </TouchableOpacity>
          <FlatList
            extraData={this.state}
            style={styles.bluetoothList}
            data={list}
            renderItem={item => this.renderBluetoothItem(item)}
            keyExtractor={(item, index) => item.id}
          />
          { this.renderDiscoveredDevises() }
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
      const needBond = this.state.bluetoothDevices.find(device => device.id === id) || null
      if (!needBond) {
        await BleManager.createBond(id)
      }
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
