import React, { Component } from 'react'
import {Text, View, Image, TouchableOpacity, NativeModules, NativeEventEmitter} from 'react-native'
import T from '../FormattedText/'
import {connect} from 'react-redux'
import {border as b} from '../../../utils.js'
import s from '../../../../locales/strings.js'
import FAIcon from 'react-native-vector-icons/FontAwesome'
import {bns} from 'biggystring'

import styles from './styles'

import BleManager from 'react-native-ble-manager'

const BleManagerModule = NativeModules.BleManager
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule)
// import THEME from '../../../../theme/variables/airbitz'

// const REMAINING_TEXT = s.strings.bitcoin_remaining
// const RECEIVED_TEXT = s.strings.bitcoin_received

const BLE_ACTIVE = require('../../../../assets/images/bluecoin/bluetooth.png')
const BLE_DISABLED = require('../../../../assets/images/bluecoin/bluetooth-disabled.png')

class BluetoothStatus extends Component<Props, State> {
  constructor () {
    super()

    this.state = {
      isPressed: false,
      isConnected: false
    }
  }

  componentDidMount () {
    BleManager.start({showAlert: false})
  }

  componentWillUnmount () {
    if (this.watcherSocket) this.watcherSocket.remove()
  }

  // can be called only once
  async pressConnect () {
    this.setState({isPressed: true})

    try {
      await BleManager.enableBluetooth()
      await BleManager.socketListen()
      this.setState({isConnected: true})
      this.watcherSocket = bleManagerEmitter.addListener('BleSocketServiceEvent', (msg) => {
        if (msg.event === 'STATE_CONNECTED') BleManager.socketWrite(this.props.encodedURI)
      })

    } catch (e) { this.setState({isPressed: false}) }
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
