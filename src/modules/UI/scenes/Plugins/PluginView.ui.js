import React from 'react'
import {WebView, FlatList, Text, View, Image} from 'react-native'
import {connect} from 'react-redux'
import {openABAlert, closeABAlert} from '../../components/ABAlert/action'
import {toggleScanToWalletListModal} from '../../components/WalletListModal/action'
import {Actions} from 'react-native-router-flux'
import * as CORE_SELECTORS from '../../../Core/selectors.js'

import * as actions from '../../../../actions/pluginsActions.js'

import {BUY_SELL, SPEND} from './plugins'
import {PluginBridge} from './api'

class PluginList extends React.Component {
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
    this.plugins = BUY_SELL
  }
}

class PluginSpend extends PluginList {
  constructor () {
    super()
    this.plugins = SPEND
  }
}

class PluginView extends React.Component {
  constructor (props) {
    super(props)
    this.webview = null
    this.plugin = this.props.plugin
    this.updateBridge(this.props)
  }

  updateBridge (props) {
    this.bridge = new PluginBridge({
      plugin:props.plugin,
      account:props.account,
      coreWallets:props.coreWallets,
      wallets:props.wallets,
      walletName:props.walletName,
      walletId:props.walletId,
      folder:props.account.folder.folder(this.plugin.key),
    })
  }

  componentWillReceiveProps (nextProps) {
    this.updateBridge(nextProps)
  }

  _renderWebView = () => {
    return this.plugin.sourceFile
  }

  _pluginReturn = (data) => {
    this.webview.injectJavaScript(`window.PLUGIN_RETURN('${JSON.stringify(data)}')`)
  }

  _nextMessage = (datastr) => {
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
    if (this.bridge[func]) {
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
    this.webview = webview
  }

  render () {
    return (
      <View>
        <Text onPress={() => this.props.requestSignTx({
          abcSpendInfo: {spendTargets: [{publicAddress: '123123123', nativeAmount: '10000000'}]},
          lockInputs: true,
          broadcast: false
        })}>
          RequestSignTX
        </Text>
        <Text onPress={() => Actions.sendConfirmation({spendInfo: {spendTargets: [{publicAddress: '123123123', nativeAmount: '10000000'}]}})}>
          Send Confirmation
        </Text>
        <WebView ref={this._setWebview} onMessage={this._onMessage} source={this._renderWebView()} />
      </View>
    )
  }
}
const mapStateToProps = (state) => ({
  account: CORE_SELECTORS.getAccount(state),
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
  requestSignTx: ({ abcSpendInfo, lockInputs, broadcast }) => {
    dispatch(actions.requestSignTx({ abcSpendInfo, broadcast, lockInputs }))
    Actions.sendConfirmation()
  }
})

const PluginViewConnect = connect(mapStateToProps, mapDispatchToProps)(PluginView)
export {PluginViewConnect, PluginBuySell, PluginSpend}
