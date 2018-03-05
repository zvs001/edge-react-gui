import React, { Component } from 'react'
import {Text, View, Image, TouchableOpacity, NativeModules, NativeEventEmitter} from 'react-native'
import { Actions } from 'react-native-router-flux'
import T from '../FormattedText/'
import {connect} from 'react-redux'
import {border as b} from '../../../utils.js'
import s from '../../../../locales/strings.js'
import FAIcon from 'react-native-vector-icons/FontAwesome'
import {bns} from 'biggystring'
import * as Constants from '../../../../constants/indexConstants'

import styles from './styles'

import BleManager from 'react-native-ble-manager'

const BLE_ACTIVE = require('../../../../assets/images/bluecoin/bluetooth.png')
const BLE_DISABLED = require('../../../../assets/images/bluecoin/bluetooth-disabled.png')

class BluetoothStatus extends Component<Props, State> {
  constructor () {
    super()

    this.state = {
      isPressed: false,
      isConnected: false
    }

    this._watcherConnections = this._watcherConnections.bind(this)

    this._bluetoothActive = () => this.setState({isConnected: true})
    this._bluetoothDisabled = () => this.setState({isConnected: false})

    BleManager.emitter.on('STATE_NONE', this._bluetoothDisabled)
    BleManager.emitter.on('STATE_LISTEN', this._bluetoothActive)
  }

  componentDidMount () {
    BleManager.start({showAlert: false})
  }

  componentWillUnmount () {
    BleManager.emitter.off('STATE_NONE', this._bluetoothDisabled)
    BleManager.emitter.off('STATE_LISTEN', this._bluetoothActive)
    BleManager.emitter.off('READ', this._watcherConnections)
  }

  _watcherConnections (msg) {
    console.log('status watch', msg)
    if (msg === 'getTxURI') {
      BleManager.socketWrite(this.props.encodedURI)
      Actions[Constants.WALLET_LIST]()
    }
  }

  async _listen () {
    try {
      await BleManager.enableBluetooth()
      await BleManager.socketListen()
      BleManager.emitter.on('READ', this._watcherConnections)
      this.setState({isConnected: true})
    } catch (e) {
      console.log('socketListenError', e)
    }
    this.setState({isPressed: false})
  }

  async _disable () {
    BleManager.emitter.off('READ', this._watcherConnections)
    BleManager.socketClose()
    this.setState({
      isConnected: false,
      isPressed: false
    })
  }

  // can be called only once
  async pressConnect () {
    this.setState({isPressed: true})
    this.state.isConnected ? this._disable() : this._listen()
  }

  render () {
    return (
      <View style={styles.view}>
        <View style={styles.bluetoothContainer}>
          <Text style={styles.text}>{this.state.isConnected ? 'Broadcasting request   ' : 'Request transaction with bluetooth'}</Text>
          {
            this.state.isPressed &&
            <Image
              style={styles.image}
              source={this.state.isConnected ? BLE_ACTIVE : BLE_DISABLED}
            />
          }
          {
            !this.state.isPressed &&
            <TouchableOpacity onPress={() => this.pressConnect()}>
              <Image
                style={styles.image}
                source={this.state.isConnected ? BLE_ACTIVE : BLE_DISABLED}
              />
            </TouchableOpacity>
          }
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state) => ({
  request: state.request
})

export default connect(mapStateToProps)(BluetoothStatus)
