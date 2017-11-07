// @flow

import React from 'react'
import {WebView, FlatList, Text, View, Image} from 'react-native'
import {connect} from 'react-redux'
import type {AbcCurrencyWallet, AbcTransaction} from 'airbitz-core-types'
import type {GuiWallet} from '../../../../types'

import {openABAlert} from '../../components/ABAlert/action'
import {toggleScanToWalletListModal} from '../../components/WalletListModal/action'
import {Actions} from 'react-native-router-flux'
import * as CORE_SELECTORS from '../../../Core/selectors.js'

// import * as actions from '../../../../actions/pluginsActions.js'

import {BUY_SELL, SPEND} from './plugins'
import {PluginBridge} from './api'

type PluginListProps = {}
type PluginListState = {}
class PluginList extends React.Component<PluginListProps, PluginListState> {
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
      <View>
        <FlatList
          // $FlowFixMe
          data={this.plugins}
          renderItem={this._renderPlugin}
        />
      </View>
    )
  }
}

class PluginBuySell extends PluginList {
  constructor () {
    super()
    // $FlowFixMe
    this.plugins = BUY_SELL
  }
}

class PluginSpend extends PluginList {
  constructor () {
    super()
    // $FlowFixMe
    this.plugins = SPEND
  }
}

type PluginViewProps = {
  abcWallets: Array<AbcCurrencyWallet>,
  account: any,
  plugin: any,
  walletId: string,
  walletName: string,
  wallets: Array<GuiWallet>
}
type PluginViewState = {}
class PluginView extends React.Component<PluginViewProps, PluginViewState> {
  constructor (props) {
    super(props)
    // $FlowFixMe
    this.webview = null
    // $FlowFixMe
    this.plugin = this.props.plugin
    this.updateBridge(this.props)
  }

  updateBridge (props) {
    // $FlowFixMe
    this.bridge = new PluginBridge({
      plugin:props.plugin,
      account:props.account,
      abcWallets:props.abcWallets,
      wallets:props.wallets,
      walletName:props.walletName,
      walletId:props.walletId,
      // $FlowFixMe
      folder:props.account.folder.folder(this.plugin.key),
    })
  }

  componentWillReceiveProps (nextProps) {
    this.updateBridge(nextProps)
  }

  _renderWebView = () => {
    // $FlowFixMe
    return this.plugin.sourceFile
  }

  _pluginReturn = (data) => {
    // $FlowFixMe
    this.webview.injectJavaScript(`window.PLUGIN_RETURN('${JSON.stringify(data)}')`)
  }

  _nextMessage = (datastr) => {
    // $FlowFixMe
    this.webview.injectJavaScript(`window.PLUGIN_NEXT('${datastr}')`)
  }

  _onMessage = (event) => {
    console.log(event.nativeEvent.data)
    if (!this.webview) {
      return
    }
    this._nextMessage(event.nativeEvent.data)
    const data = JSON.parse(event.nativeEvent.data)
    const {cbid, func} = data

    console.log(func)
    // $FlowFixMe
    if (this.bridge[func]) {
      // $FlowFixMe
      this.bridge[func](data)
        .then((res) => {
          this._pluginReturn({cbid, func, err:null, res})
        })
        .catch((err) => {
          this._pluginReturn({cbid, func, err, res:null})
        })
    } else {
      this._pluginReturn({cbid, func, err:'invalid function'})
    }
  }

  _setWebview = (webview) => {
    // $FlowFixMe
    this.webview = webview
  }

  render () {
    return (
      <View>
        <Text onPress={() => Actions.sendConfirmation({
          abcSpendInfo: {spendTargets: [{publicAddress: '123123123', nativeAmount: '1230000000000000'}]},
          finishCallback: (error: Error | null, abcTransaction: AbcTransaction | null) => {
            console.log('finishCallback')
            console.log('abcTransaction', abcTransaction)
          },
          lockInputs: false,
          broadcast: false })}>
          Send Confirmation
        </Text>
        <WebView ref={this._setWebview} onMessage={this._onMessage} source={this._renderWebView()} />
      </View>
    )
  }
}
const mapStateToProps = (state) => ({
  account: CORE_SELECTORS.getAccount(state),
  abcWallets: state.core.wallets.byId,
  wallets: state.ui.wallets.byId,
  walletName: state.ui.scenes.walletList.walletName,
  walletId: state.ui.scenes.walletList.walletId,
})
const mapDispatchToProps = (dispatch) => ({
  dispatch,
  toggleScanToWalletListModal: () => dispatch(toggleScanToWalletListModal()),
  openABAlert: (alertSyntax) => dispatch(openABAlert(alertSyntax))
})
const PluginViewConnect = connect(mapStateToProps, mapDispatchToProps)(PluginView)

export {PluginViewConnect, PluginBuySell, PluginSpend}
