import {Linking} from 'react-native'
import {Actions} from 'react-native-router-flux'
import * as WALLET_API from '../../../Core/Wallets/api'

const formatWallet = (w) => ({
  'id': w.id,
  'name': w.name,
  'type': w.type,
  'currencyCode': w.currencyCode,
  'primaryNativeBalance': w.currencyCode
})

export class PluginBridge {
  constructor (context) {
    this.context = context
    this.navStack = []
  }

  bitidAddress () {
    return Promise.resolve(null)
  }

  bitidSignature () {
    // TODO: not supported by core...yet
    // const {uri, message} = data
    return Promise.resolve(null)
  }

  chooseWallet () {
    // TODO: this.props.toggleScanToWalletListModal()
    return Promise.resolve(null)
  }

  selectedWallet () {
    return Promise.resolve(formatWallet(this.context.walletId))
  }

  wallets () {
    let wallets = Object.keys(this.context.wallets)
      .map((key) => formatWallet(this.context.wallets[key]))
    return Promise.resolve(wallets)
  }

  getAddress (data) {
    const walletId = data.walletId
    const coreWallet = this.context.coreWallets[walletId]
    const currencyCode = data.currencyCode
    return WALLET_API.getReceiveAddress(coreWallet, currencyCode)
      .then((receiveAddress) => {
        const encodedURI = coreWallet.encodeUri(receiveAddress)
        return {'encodeUri': encodedURI, 'address': receiveAddress}
      })
  }

  finalizeReceiveRequest () {
    // TODO
    // const {wallet, requestId} = data
    return Promise.resolve(null)
  }

  createSpendRequest () {
    // TODO
    // const {wallet, toAddress, amountSatoshi, options} = data
    return Promise.resolve(null)
  }

  createSpendRequest2 () {
    // TODO
    // const {wallet, toAddress, toAddress2, amountSatoshi, amountSatoshi2, options} = data
    return Promise.resolve(null)
  }

  requestSign (data) {
    const {coreWallet, signTransaction} = data
    return WALLET_API.signTransaction(coreWallet, signTransaction)
  }

  broadcastTx (data) {
    const {coreWallet, rawtx} = data
    return WALLET_API.broadcastTransaction(coreWallet, rawtx)
  }

  saveTx (data) {
    const {coreWallet, signedTransaction} = data
    return WALLET_API.signTransaction(coreWallet, signedTransaction)
      .then(() => {
        return true
      })
  }

  requestFile () {
    // TODO
    // const {options} = data
    return Promise.resolve(null)
  }

  readData (data) {
    return this.context.folder.file(data.key).getText()
  }

  writeData (data) {
    const {key, value} = data
    return this.context.folder.file(key)
      .setText(value)
      .then(() => {
        return true
      })
  }

  clearData () {
    return Promise.resolve(true)
    /* TODO: find out why this breaks the account locally
    return this.context.folder.delete()
      .then(() => {
        return true
      })
      */
  }

  getAffiliateInfo () {
    // TODO
    return Promise.resolve(null)
  }

  get (data) {
    const {key} = data
    if (this.context.plugin[key]) {
      return Promise.resolve(this.context.plugin[key])
    } else {
      return Promise.reject(`${key} is not valid for plugin`)
    }
  }

  debugLevel (data) {
    console.log(`LOGGING ${this.context.plugin.key}  ${data.level}: ${data.text}`)
    return Promise.resolve(null)
  }

  showAlert () {
    // TODO: this.props.openABAlert({title: data['title'], message: data['message']})
    return Promise.resolve(null)
  }

  hideAlert () {
    // TODO: this.props.closeABAlert()
    return Promise.resolve(null)
  }

  title () {
    // TODO
    // const {title} = data
    return Promise.resole(null)
  }

  back () {
    if (this.navStack.length === 0) {
      Actions.pop()
    } else {
      this.webview.injectJavaScript('window.history.back()')
    }
    return Promise.resolve(null)
  }

  exit () {
    Actions.pop()
    return Promise.resolve(null)
  }

  launchExternal (data) {
    return Linking.openURL(data.uri)
  }

  navStackClear () {
    this.navStack = []
    return Promise.resolve(null)
  }

  navStackPush (data) {
    this.navStack.push(data.path)
    return Promise.resolve(null)
  }

  navStackPop () {
    this.navStack.pop()
    return Promise.resolve(null)
  }
}
