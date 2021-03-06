// @flow

export const LOGIN = 'login'
export const CHANGE_PASSWORD = 'changePassword'
export const CHANGE_PIN = 'changePin'
export const OTP_SETUP = 'otpSetup'
export const RECOVER_PASSWORD = 'passwordRecovery'
export const EDGE = 'edge'
export const EXCHANGE = 'exchange'
export const EDGE_LOGIN = 'edgeLogin'
export const WALLET_LIST = 'walletList'
export const WALLET_LIST_SCENE = 'walletListScene' // distinguished as actual scene vs. stack
export const CREATE_WALLET_NAME = 'createWalletName'
export const CREATE_WALLET_SELECT_CRYPTO = 'createWalletSelectCrypto'
export const CREATE_WALLET_SELECT_FIAT = 'createWalletSelectFiat'
export const CREATE_WALLET_REVIEW = 'createWalletReview'
export const MANAGE_TOKENS = 'manageTokens'
export const ADD_TOKEN = 'addToken'
export const EDIT_TOKEN = 'editToken'
export const TRANSACTION_LIST = 'transactionList'
export const TRANSACTION_DETAILS = 'transactionDetails'
export const SCAN = 'scan'
export const SEND_CONFIRMATION = 'sendConfirmation'
export const CHANGE_MINING_FEE_SEND_CONFIRMATION = 'changeMiningFeeSendConfirmation'
export const CHANGE_MINING_FEE_EXCHANGE = 'changeMiningFeeExchange'
export const REQUEST = 'request'
export const SETTINGS_OVERVIEW = 'settingsOverview'
export const CURRENCY_SETTINGS = {
  'btcSettings': {
    pluginName: 'bitcoin',
    currencyCode: 'BTC'
  },
  'bchSettings': {
    pluginName: 'bitcoinCash',
    currencyCode: 'BCH'
  },
  'ethSettings': {
    pluginName: 'ethereum',
    currencyCode: 'ETH'
  },
  'ltcSettings': {
    pluginName: 'litecoin',
    currencyCode: 'LTC'
  },
  'dashSettings': {
    pluginName: 'dash',
    currencyCode: 'DASH'
  }
}
