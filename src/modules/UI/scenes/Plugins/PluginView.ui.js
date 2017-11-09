import React, { Component } from 'react'
import { WebView, FlatList, Text, View, Image, Linking } from 'react-native'
import { connect } from 'react-redux'
import { openABAlert, closeABAlert } from '../../components/ABAlert/action'
import { toggleScanToWalletListModal } from '../../components/WalletListModal/action'
import {Actions} from 'react-native-router-flux'

import * as WALLET_API from '../../../Core/Wallets/api.js'
import {BUY_SELL, SPEND} from './plugins.js'

class PluginList extends Component {
  _onPress = (plugin) => {
    Actions.plugin({plugin: plugin})
  }

  _renderPlugin = ({item}) => (
    <View style={{flex: 1, flexDirection: 'row'}}>
      <Image
        style={{width: 50, height: 50}}
        source={{uri: item.imageUrl}}
      />
      <View style={{flex: 1, flexDirection: 'column'}}>
        <Text id={item.key} key={item.key} onPress={() => this._onPress(item)}>{item.key}</Text>
        <Text>{item.subtitle}</Text>
      </View>
    </View>
  )

  render () {
    return (
      <FlatList
        data={this.plugins}
        renderItem={this._renderPlugin}
      />
    )
  }
}

class PluginBuySell extends PluginList {
  constructor () {
    super()
    this.plugins = BUY_SELL
  }
}

class PluginSpend extends PluginList {
  constructor () {
    super()
    this.plugins = SPEND
  }
}

class PluginView extends Component {
  constructor (props) {
    super(props)
    this.webview = null
    this.plugin = this.props.routes.scene.plugin
    this.navStack = []
  }

  _renderWebView = () => {
    return this.plugin.sourceFile
  }

  _formatWallet = (w) => {
    return {
      'id': w.id,
      'name': w.name,
      'type': w.type,
      'currencyCode': w.currencyCode,
      'primaryNativeBalance': w.currencyCode
    }
  }

  _pluginReturn = (data) => {
    this.webview.injectJavaScript('window.PLUGIN_RETURN(\'' + JSON.stringify(data) + '\')')
  }

  _onMessage = (event) => {
    if (!this.webview) {
      return
    }
    const data = JSON.parse(event.nativeEvent.data)
    const func = data['func']
    console.log('----------------------------------------------------------------------------------------------------')
    console.log(func)
    console.log('----------------------------------------------------------------------------------------------------')
    const FUNCTION_MAP = {
      // core
      'bitidAddress': (data) => {
        const cbid = data['cbid']
        // TODO: not supported by core...yet
        // const uri = data['uri']
        // const message = data['message']
        this._pluginReturn({'cbid': cbid, 'err': null, 'res': null})
      },
      'bitidSignature': (data) => {
        const cbid = data['cbid']
        // TODO: not supported by core...yet
        // const uri = data['uri']
        // const message = data['message']
        this._pluginReturn({'cbid': cbid, 'err': null, 'res': null})
      },
      'chooseWallet': (data) => {
        const cbid = data['cbid']
        this.props.toggleScanToWalletListModal()
        this._pluginReturn({'cbid': cbid, 'err': null, 'res': null})
      },
      'selectedWallet': (data) => {
        const cbid = data['cbid']
        this._pluginReturn({'cbid': cbid, 'err': null, 'res': this._formatWallet(this.props.walletId)})
      },
      'wallets': (data) => {
        const cbid = data['cbid']
        let wallets = Object.keys(this.props.wallets).map((key) => {
          return this._formatWallet(this.props.wallets[key])
        })
        this._pluginReturn({'cbid': cbid, 'err': null, 'res': wallets})
      },
      'getAddress': (data) => {
        const cbid = data['cbid']
        const walletId = data['walletId']
        const coreWallet = this.props.coreWallets[walletId]
        const currencyCode = data['currencyCode']
        WALLET_API.getReceiveAddress(coreWallet, currencyCode)
        .then((receiveAddress) => {
          const encodedURI = coreWallet.encodeUri(receiveAddress)
          this._pluginReturn({'cbid': cbid, 'err': null, 'res': {'encodeUri': encodedURI, 'address': receiveAddress}})
        }).catch((reason) => {
          this._pluginReturn({'cbid': cbid, 'err': reason, 'res': null})
        })
      },
      'finalizeReceiveRequest': (data) => {
        const cbid = data['cbid']
        // TODO
        // const wallet = data['wallet']
        // const requestId = data['requestId']
        this._pluginReturn({'cbid': cbid, 'err': null, 'res': null})
      },
      'createSpendRequest': (data) => {
        const cbid = data['cbid']
        // TODO
        // const wallet = data['wallet']
        // const toAddress = data['toAddress']
        // const amountSatoshi = data['amountSatoshi']
        // const options = data['options']
        this._pluginReturn({'cbid': cbid, 'err': null, 'res': null})
      },
      'createSpendRequest2': (data) => {
        const cbid = data['cbid']
        // TODO
        // const wallet = data['wallet']
        // const toAddress = data['toAddress']
        // const toAddress2 = data['toAddress2']
        // const amountSatoshi = data['amountSatoshi']
        // const amountSatoshi2 = data['amountSatoshi2']
        // const options = data['options']
        this._pluginReturn({'cbid': cbid, 'err': null, 'res': null})
      },
      'requestSign': (data) => {
        const cbid = data['cbid']
        const coreWallet = data['walletId']
        const tx = data['signTransaction']
        WALLET_API.signTransaction(coreWallet, tx)
        .then((signedTransaction) => {
          this._pluginReturn({'cbid': cbid, 'err': null, 'res': signedTransaction})
        }).catch((reason) => {
          this._pluginReturn({'cbid': cbid, 'err': reason, 'res': null})
        })
      },
      'broadcastTx': (data) => {
        const cbid = data['cbid']
        const coreWallet = data['walletId']
        const rawtx = data['rawtx']
        WALLET_API.broadcastTransaction(coreWallet, rawtx)
        .then((signedTransaction) => {
          this._pluginReturn({'cbid': cbid, 'err': null, 'res': signedTransaction})
        }).catch((reason) => {
          this._pluginReturn({'cbid': cbid, 'err': reason, 'res': null})
        })
      },
      'saveTx': (data) => {
        const cbid = data['cbid']
        const coreWallet = data['walletId']
        const signedTransaction = data['signedTransaction']
        WALLET_API.signTransaction(coreWallet, signedTransaction)
        .then(() => {
          this._pluginReturn({'cbid': cbid, 'err': null, 'res': true})
        }).catch((reason) => {
          this._pluginReturn({'cbid': cbid, 'err': reason, 'res': null})
        })
      },
      'requestFile': (data) => {
        const cbid = data['cbid']
        // TODO
        // const options = data['options']
        this._pluginReturn({'cbid': cbid, 'err': null, 'res': null})
      },
      'writeData': (data) => {
        const cbid = data['cbid']
        // TODO
        // const key = data['key']
        // const d = data['data']
        this._pluginReturn({'cbid': cbid, 'err': null, 'res': null})
      },
      'clearData': (data) => {
        const cbid = data['cbid']
        // TODO
        this._pluginReturn({'cbid': cbid, 'err': null, 'res': null})
      },
      'readData': (data) => {
        const cbid = data['cbid']
        // TODO
        // const key = data['key']
        this._pluginReturn({'cbid': cbid, 'err': null, 'res': null})
      },
      'getAffiliateInfo': (data) => {
        const cbid = data['cbid']
        // TODO
        this._pluginReturn({'cbid': cbid, 'err': null, 'res': null})
      },
      'getBtcDenomination': (data) => {
        const cbid = data['cbid']
        // TODO
        this._pluginReturn({'cbid': cbid, 'err': null, 'res': null})
      },

      // config
      'get': (data) => {
        const cbid = data['cbid']
        const key = data['key']
        console.log('----------------------------------------------------------------------------------------------------')
        console.log(key + ' ' + this.props.plugin[key])
        console.log('----------------------------------------------------------------------------------------------------')
        this._pluginReturn({'cbid': cbid, 'err': null, 'res': this.props.plugin[key]})
      },

      // ui
      'debugLevel': (data) => {
        const cbid = data['cbid']
        console.log(`LOGGING ${this.props.plugin['key']}  ${data['level']}: ${data['text']}`)
        this._pluginReturn({'cbid': cbid, 'err': null, 'res': null})
      },
      'showAlert': (data) => {
        const cbid = data['cbid']
        this.props.openABAlert({ title: data['title'], message: data['message'] })
        this._pluginReturn({'cbid': cbid, 'err': null, 'res': null})
      },
      'hideAlert': (data) => {
        const cbid = data['cbid']
        this.props.closeABAlert()
        this._pluginReturn({'cbid': cbid, 'err': null, 'res': null})
      },
      'title': (data) => {
        const cbid = data['cbid']
        // TODO
        // const title = data['title']
        this._pluginReturn({'cbid': cbid, 'err': null, 'res': null})
      },
      'back': (data) => {
        const cbid = data['cbid']
        if (this.navStack.length === 0) {
          Actions.pop()
        } else {
          this.webview.injectJavaScript('window.history.back()')
        }
        this._pluginReturn({'cbid': cbid, 'err': null, 'res': null})
      },
      'exit': (data) => {
        const cbid = data['cbid']
        Actions.pop()
        this._pluginReturn({'cbid': cbid, 'err': null, 'res': null})
      },
      'launchExternal': (data) => {
        const cbid = data['cbid']
        Linking.openURL(data['uri']).then((data) => {
          this._pluginReturn({'cbid': cbid, 'err': null, 'res': data})
        }).catch((err) =>
          this._pluginReturn({'cbid': cbid, 'err': err, 'res': null})
        )
      },
      'navStackClear': (data) => {
        const cbid = data['cbid']
        this.navStack = []
        this._pluginReturn({'cbid': cbid, 'err': null, 'res': null})
      },
      'navStackPush': (data) => {
        const cbid = data['cbid']
        this.navStack.push(data['path'])
        this._pluginReturn({'cbid': cbid, 'err': null, 'res': null})
      },
      'navStackPop': (data) => {
        const cbid = data['cbid']
        this.navStack.pop()
        this._pluginReturn({'cbid': cbid, 'err': null, 'res': null})
      },
    }
    FUNCTION_MAP[func](data)
  }

  _setWebview = (webview) => {
    this.webview = webview
  }

  render () {
    return (
      <WebView ref={this._setWebview} onMessage={this._onMessage} source={this._renderWebView()} />
    )
  }
}
const mapStateToProps = (state) => ({
  context: state.context,
  routes: state.routes,
  coreWallets: state.core.wallets.byId,
  wallets: state.ui.wallets.byId,
  walletName: state.ui.scenes.walletList.walletName,
  walletId: state.ui.scenes.walletList.walletId,
})

const mapDispatchToProps = (dispatch) => ({
  dispatch,
  toggleScanToWalletListModal: () => dispatch(toggleScanToWalletListModal()),
  openABAlert: (alertSyntax) => dispatch(openABAlert(alertSyntax)),
  closeABAlert: () => dispatch(closeABAlert()),
})

const PluginViewConnect = connect(mapStateToProps, mapDispatchToProps)(PluginView)
export { PluginViewConnect, PluginBuySell, PluginSpend }
