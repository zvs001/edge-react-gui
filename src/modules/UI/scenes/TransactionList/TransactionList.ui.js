// @flow

import { bns } from 'biggystring'
import type { AbcDenomination, AbcTransaction } from 'edge-core-js'
import React, { Component } from 'react'
import { ActivityIndicator, Animated, Image, ScrollView, TouchableHighlight, TouchableOpacity, View, SectionList } from 'react-native'
// import Contacts from 'react-native-contacts'
// import Permissions from 'react-native-permissions'
import { Actions } from 'react-native-router-flux'

import receivedTypeImage from '../../../../assets/images/transactions/transaction-type-received.png'
import sentTypeImage from '../../../../assets/images/transactions/transaction-type-sent.png'
import requestImage from '../../../../assets/images/transactions/transactions-request.png'
import sendImage from '../../../../assets/images/transactions/transactions-send.png'
import * as Constants from '../../../../constants/indexConstants'
import { intl } from '../../../../locales/intl'
import s from '../../../../locales/strings.js'
import { PLATFORM } from '../../../../theme/variables/platform.js'

import type { GuiWallet, DateTransactionGroup, TransactionListTx, TransactionListSection, GuiContact } from '../../../../types'
import WalletListModal from '../../../UI/components/WalletListModal/WalletListModalConnector'
import * as UTILS from '../../../utils'
import T from '../../components/FormattedText'
import Gradient from '../../components/Gradient/Gradient.ui'
import SafeAreaView from '../../components/SafeAreaView'
import styles, { styles as styleRaw } from './style'

// import SearchBar from './components/SearchBar.ui'
const INITIAL_TRANSACTION_BATCH_NUMBER = 10
const SUBSEQUENT_TRANSACTION_BATCH_NUMBER = 30
const SCROLL_THRESHOLD = 0.5

type Props = {
  getTransactions: (walletId: string, currencyCode: string) => void, // getting transactions from Redux
  updateExchangeRates: () => void,
  transactionsSearchHidden: () => void,
  fetchTransactions: (walletId: string, currencyCode: string, options: Object) => void,
  contacts: Array<GuiContact>,
  selectedWalletId: string,
  selectedCurrencyCode: string,
  loading: boolean,
  updatingBalance: boolean,
  transactions: Array<AbcTransaction>,
  multiplier: string,
  uiWallet: GuiWallet,
  displayDenomination: AbcDenomination,
  balanceInCrypto: string,
  fiatSymbol: string,
  balanceInFiat: number,
  fiatCurrencyCode: string,
  isoFiatCurrencyCode: string,
  visibleTransactions: Array<DateTransactionGroup>
}
type State = {
  focused: boolean,
  balanceBoxVisible: boolean,
  op: any,
  animation: any,
  balanceBoxOpacity: any,
  balanceBoxHeight: any,
  width: ?number,
  showBalance: boolean,
  currentCurrencyCode: string,
  currentWalletId: string,
  currentEndIndex: number
}

const SHOW_BALANCE_TEXT = s.strings.string_show_balance
const REQUEST_TEXT = s.strings.fragment_request_subtitle
const SEND_TEXT = s.strings.fragment_send_subtitle
const SENT_TEXT = s.strings.fragment_transaction_list_sent_prefix
const RECEIVED_TEXT = s.strings.fragment_transaction_list_receive_prefix
const UNCONFIRMED_TEXT = s.strings.fragment_wallet_unconfirmed

export default class TransactionList extends Component<Props, State> {
  state = {
    focused: false,
    animation: new Animated.Value(0),
    op: new Animated.Value(0),
    balanceBoxHeight: new Animated.Value(200),
    balanceBoxOpacity: new Animated.Value(1),
    balanceBoxVisible: true,
    showBalance: true,
    renderedTxCount: 0,
    completedTx: [],
    dataSrc: [],
    width: undefined,
    currentCurrencyCode: '',
    currentWalletId: '',
    currentEndIndex: 0
  }

  componentWillMount () {
    this.props.updateExchangeRates()
    this.handleScrollEnd()
  }

  componentWillReceiveProps (nextProps: Props) {
    if ((nextProps.selectedWalletId !== this.props.selectedWalletId) ||
        (nextProps.selectedCurrencyCode !== this.props.selectedCurrencyCode)) {
      this.fetchListOfTransactions(nextProps.selectedWalletId, nextProps.selectedCurrencyCode)
    }
  }

  fetchListOfTransactions = (walletId: string, currencyCode: string) => {
    this.props.fetchTransactions(walletId, currencyCode, {
      numEntries: this.state.currentEndIndex,
      numIndex: 0
    })
  }

  handleScrollEnd = () => {
    const walletId = this.props.selectedWalletId
    const currencyCode = this.props.selectedCurrencyCode
    const { currentEndIndex, currentWalletId, currentCurrencyCode } = this.state
    let newEndIndex = currentEndIndex

    const txLength = this.props.transactions.length
    if (!txLength) {
      newEndIndex = INITIAL_TRANSACTION_BATCH_NUMBER
    } else if (txLength === currentEndIndex) {
      newEndIndex += SUBSEQUENT_TRANSACTION_BATCH_NUMBER
    }

    if (
      newEndIndex !== currentEndIndex ||
      (currentWalletId !== '' && currentWalletId !== walletId) ||
      (currentCurrencyCode !== '' && currentCurrencyCode !== currencyCode)
    ) {
      this.setState(
        state => ({
          currentCurrencyCode: currencyCode,
          currentEndIndex: newEndIndex,
          currentWalletId: walletId
        }),
        () => this.fetchListOfTransactions(walletId, currencyCode)
      )
    }
  }

  _onSearchChange = () => {
    // this.props.dispatch(updateSearchResults(null))
    // console.log('this._onSearchChange executing')
  }

  _onPressSearch = () => {
    // this.props.transactionsSearchVisible()
  }

  _onSearchExit = () => {
    this.props.transactionsSearchHidden()
  }

  loadMoreTransactions = () => {
    // console.log('Transactions.ui->loadMoreTransactions being executed')
  }

  _onFocus = () => {
    this.setState({ focused: true })
    this._toggleCancelVisibility()
  }

  _onBlur = () => {
    this.setState({ focused: false })
    this._toggleCancelVisibility()
  }

  _toggleCancelVisibility = () => {
    let toOpacity, toWidth, toBalanceBoxHeight, toBalanceBoxOpacity
    if (this.state.focused) {
      toOpacity = 0
      toWidth = 0
      toBalanceBoxHeight = 200
      toBalanceBoxOpacity = 1.0
      this.setState({ balanceBoxVisible: true })

      Animated.parallel([
        Animated.sequence([
          Animated.timing(this.state.op, { toValue: toOpacity, duration: 200 }),
          Animated.timing(this.state.animation, { toValue: toWidth, duration: 200 })
        ]),
        Animated.sequence([
          Animated.timing(this.state.balanceBoxHeight, { toValue: toBalanceBoxHeight, duration: 400 }),
          Animated.timing(this.state.balanceBoxOpacity, { toValue: toBalanceBoxOpacity, duration: 400 })
        ])
      ]).start()
    } else {
      toOpacity = 1
      toWidth = 60
      toBalanceBoxHeight = 0
      toBalanceBoxOpacity = 0.0

      Animated.parallel([
        Animated.sequence([
          Animated.timing(this.state.animation, { toValue: toWidth, duration: 200 }),
          Animated.timing(this.state.op, { toValue: toOpacity, duration: 200 })
        ]),
        Animated.sequence([
          Animated.sequence([Animated.timing(this.state.balanceBoxOpacity, { toValue: toBalanceBoxOpacity, duration: 400 })]),
          Animated.timing(this.state.balanceBoxHeight, { toValue: toBalanceBoxHeight, duration: 400 })
        ])
      ]).start(() => this.setState({ balanceBoxVisible: false }))
    }
  }

  _onCancel = () => this.setState({ width: 0 })

  toggleShowBalance = () => this.setState({ showBalance: !this.state.showBalance })

  renderDropUp = () => {
    if (this.props.showToWalletModal) {
      return <WalletListModal topDisplacement={Constants.TRANSACTIONLIST_WALLET_DIALOG_TOP} type={Constants.FROM} />
    }
    return null
  }

  render () {
    const {
      loading,
      updatingBalance,
      uiWallet,
      selectedCurrencyCode,
      displayDenomination,
      balanceInCrypto,
      fiatSymbol,
      balanceInFiat,
      fiatCurrencyCode,
      isoFiatCurrencyCode
    } = this.props
    if (loading) {
      return <ActivityIndicator style={{ flex: 1, alignSelf: 'center' }} size={'large'} />
    }

    let logo

    if (uiWallet.currencyCode !== selectedCurrencyCode) {
      for (const metatoken of uiWallet.metaTokens) {
        if (metatoken.currencyCode === selectedCurrencyCode) {
          logo = metatoken.symbolImage
        }
      }
    } else {
      logo = uiWallet.symbolImage
    }

    const cryptoAmount: string = UTILS.convertNativeToDisplay(displayDenomination.multiplier)(balanceInCrypto) // convert to correct denomination
    const cryptoAmountString = cryptoAmount ? intl.formatNumber(UTILS.decimalOrZero(bns.toFixed(cryptoAmount, 0, 6), 6)) : '0' // limit decimals and check if infitesimal, also cut off trailing zeroes (to right of significant figures)

    // beginning of fiat balance
    let fiatBalanceString
    const receivedFiatSymbol = fiatSymbol ? UTILS.getFiatSymbol(isoFiatCurrencyCode) : ''
    if (receivedFiatSymbol.length !== 1) {
      fiatBalanceString = intl.formatNumber(balanceInFiat || 0, { toFixed: 2 }) + ' ' + fiatCurrencyCode
    } else {
      fiatBalanceString = receivedFiatSymbol + ' ' + intl.formatNumber(balanceInFiat || 0, { toFixed: 2 }) + ' ' + fiatCurrencyCode
    }
    // end of fiat balance

    return (
      <SafeAreaView>
        <View style={[{ width: '100%', height: PLATFORM.usableHeight + PLATFORM.toolbarHeight }, UTILS.border()]}>
          <Gradient style={styles.gradient} />
          <ScrollView style={[UTILS.border(), styles.scrollView]}>
            <View style={[styles.container, UTILS.border()]}>
              <Animated.View style={[{ height: this.state.balanceBoxHeight }, UTILS.border()]}>
                <Gradient style={[styles.currentBalanceBox, UTILS.border()]}>
                  {this.state.balanceBoxVisible && (
                    <Animated.View style={{ flex: 1, paddingTop: 10, paddingBottom: 20, opacity: this.state.balanceBoxOpacity }}>
                      {updatingBalance ? (
                        <View style={[styles.currentBalanceWrap]}>
                          <View style={[styles.updatingBalanceWrap]}>
                            <ActivityIndicator animating={updatingBalance} style={[styles.updatingBalance, { height: 40 }]} size="small" />
                          </View>
                        </View>
                      ) : (
                        <TouchableOpacity onPress={this.toggleShowBalance} style={[styles.currentBalanceWrap, UTILS.border()]}>
                          {this.state.showBalance ? (
                            <View style={styles.balanceShownContainer}>
                              <View style={[styles.iconWrap, UTILS.border()]}>
                                {logo ? (
                                  <Image style={[{ height: 28, width: 28, resizeMode: Image.resizeMode.contain }, UTILS.border()]} source={{ uri: logo }} />
                                ) : (
                                  <T style={[styles.request]}>{displayDenomination.symbol}</T>
                                )}
                              </View>
                              <View style={[styles.currentBalanceBoxBitsWrap, UTILS.border()]}>
                                <View style={{ flexDirection: 'row' }}>
                                  {displayDenomination.symbol ? (
                                    <T numberOfLines={1} style={[styles.currentBalanceBoxBits, styles.symbol]}>
                                      {displayDenomination.symbol + ' '}
                                    </T>
                                  ) : null}

                                  <T numberOfLines={1} style={styles.currentBalanceBoxBits}>
                                    {cryptoAmountString}
                                  </T>

                                  {!displayDenomination.symbol && (
                                    <T numberOfLines={1} style={styles.currentBalanceBoxBits}>
                                      {' ' + selectedCurrencyCode}
                                    </T>
                                  )}
                                </View>
                              </View>
                              <View style={[styles.currentBalanceBoxDollarsWrap, UTILS.border()]}>
                                <T numberOfLines={1} style={[styles.currentBalanceBoxDollars, UTILS.border()]}>
                                  {fiatBalanceString}
                                </T>
                              </View>
                            </View>
                          ) : (
                            <View style={[UTILS.border(), styles.balanceHiddenContainer]}>
                              <T style={[styles.balanceHiddenText]}>{SHOW_BALANCE_TEXT}</T>
                            </View>
                          )}
                        </TouchableOpacity>
                      )}
                      <View style={[styles.requestSendRow, UTILS.border()]}>
                        <TouchableHighlight style={[styles.requestBox, styles.button]} underlayColor={styleRaw.underlay.color} onPress={Actions.request}>
                          <View style={[styles.requestWrap]}>
                            <Image style={{ width: 25, height: 25 }} source={requestImage} />
                            <T style={[styles.request]}>{REQUEST_TEXT}</T>
                          </View>
                        </TouchableHighlight>

                        <TouchableHighlight style={[styles.sendBox, styles.button]} underlayColor={styleRaw.underlay.color} onPress={Actions.scan}>
                          <View style={[styles.sendWrap]}>
                            <Image style={{ width: 25, height: 25 }} source={sendImage} />
                            <T style={styles.send}>{SEND_TEXT}</T>
                          </View>
                        </TouchableHighlight>
                      </View>
                    </Animated.View>
                  )}
                </Gradient>
              </Animated.View>
              <View style={[styles.transactionsWrap]}>
                <SectionList
                  style={[styles.transactionsScrollWrap]}
                  sections={this.props.visibleTransactions}
                  renderItem={this.renderTx}
                  initialNumToRender={INITIAL_TRANSACTION_BATCH_NUMBER}
                  renderSectionHeader={({section}) => this.renderSectionHeader(section)}
                  stickySectionHeadersEnabled={true}
                  onEndReached={() => this.handleScrollEnd()}
                  onEndReachedThreshold={SCROLL_THRESHOLD}
                />
              </View>
            </View>
          </ScrollView>
          {this.renderDropUp()}
        </View>
      </SafeAreaView>
    )
  }

  _goToTxDetail = (abcTransaction, thumbnailPath) => {
    Actions.transactionDetails({ abcTransaction, thumbnailPath })
  }

  isReceivedTransaction (tx: TransactionListTx) {
    if (tx.nativeAmount) {
      return bns.gt(tx.nativeAmount, '0')
    }
  }

  isSentTransaction (tx: TransactionListTx) {
    return !this.isReceivedTransaction(tx)
  }

  renderTx = (transaction: TransactionListSection, completedTxList: Array<TransactionListTx>) => {
    const tx = transaction.item
    let txColorStyle, txImage, thumbnailPath, pendingTimeStyle, pendingTimeSyntax, transactionPartner
    let txName = ''

    let currencyName = this.props.uiWallet.currencyNames[this.props.selectedCurrencyCode]
    if (!currencyName) {
      currencyName = this.props.selectedCurrencyCode
    }
    if (this.isSentTransaction(tx)) {
      // XXX -paulvp Why is this hard coded here?
      txColorStyle = styles.accentRed
      txName = SENT_TEXT + currencyName
      txImage = sentTypeImage
    } else {
      txColorStyle = styles.accentGreen
      txName = RECEIVED_TEXT + currencyName
      txImage = receivedTypeImage
    }

    if (tx.metadata && tx.metadata.name) {
      if (this.props.contacts) {
        const contact = this.props.contacts.find(element => {
          const fullName = element.givenName && element.familyName ? element.givenName + ' ' + element.familyName : element.givenName
          const found = element.thumbnailPath && UTILS.unspacedLowercase(fullName) === UTILS.unspacedLowercase(tx.metadata.name)
          // if (found) console.log('element is: ', element)
          return found
        })
        if (contact) {
          thumbnailPath = contact.thumbnailPath
        }
      }
    }

    const stepOne = UTILS.convertNativeToDisplay(this.props.displayDenomination.multiplier)(bns.abs(tx.nativeAmount))

    const amountString = UTILS.decimalOrZero(UTILS.truncateDecimals(stepOne, 6), 6)
    const fiatSymbol = this.props.fiatSymbol ? UTILS.getFiatSymbol(this.props.isoFiatCurrencyCode) : ''
    let fiatAmountString
    if (tx.metadata && tx.metadata.amountFiat) {
      fiatAmountString = bns.abs(tx.metadata.amountFiat.toFixed(2))
      fiatAmountString = intl.formatNumber(bns.toFixed(fiatAmountString, 2, 2), { toFixed: 2 })
    } else {
      fiatAmountString = intl.formatNumber('0.00', { toFixed: 2 })
    }

    if (tx.blockHeight <= 0) {
      pendingTimeStyle = styles.transactionPending
      pendingTimeSyntax = UNCONFIRMED_TEXT
    } else {
      pendingTimeStyle = styles.transactionTime
      pendingTimeSyntax = tx.time
    }

    if (tx.metadata && tx.metadata.name) {
      transactionPartner = tx.metadata.name
    } else {
      transactionPartner = txName
    }

    return (
      <View style={[styles.singleTransactionWrap]}>
        <TouchableHighlight
          onPress={() => this._goToTxDetail(tx, thumbnailPath)}
          underlayColor={styleRaw.transactionUnderlay.color}
          style={[styles.singleTransaction]}
        >
          <View style={[styles.transactionInfoWrap]}>
            <View style={styles.transactionLeft}>
              {thumbnailPath ? (
                <Image style={[styles.transactionLogo]} source={{ uri: thumbnailPath }} />
              ) : (
                <Image style={styles.transactionLogo} source={txImage} />
              )}

              <View style={[styles.transactionLeftTextWrap]}>
                <T style={[styles.transactionPartner]}>{transactionPartner}</T>
                <T style={[styles.transactionTimePendingArea, pendingTimeStyle]}>{pendingTimeSyntax}</T>
              </View>
            </View>

            <View style={[styles.transactionRight]}>
              <T style={[styles.transactionBitAmount, txColorStyle, styles.symbol]}>
                {this.props.displayDenomination.symbol} {amountString}
              </T>
              <T style={[styles.transactionDollarAmount, txColorStyle]}>{fiatSymbol + ' ' + fiatAmountString}</T>
            </View>
          </View>
        </TouchableHighlight>
      </View>
    )
  }

  renderSectionHeader = (sectionData: {data: Array<any>, title: string}) => {
    return (
      <View style={styles.singleDateArea}>
        <View style={styles.leftDateArea}>
          <T style={styles.formattedDate}>{sectionData.title}</T>
        </View>
      </View>
    )
  }
}
