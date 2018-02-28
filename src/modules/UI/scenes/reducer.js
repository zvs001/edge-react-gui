// @flow

import { combineReducers } from 'redux'

import ABAlert from '../components/ABAlert/reducer'
import controlPanel from '../components/ControlPanel/reducer.js'
import exchangeRate from '../components/ExchangeRate/reducer.js'
import { helpModal } from '../components/HelpModal/reducer.js'
import sideMenu from '../components/SideMenu/reducer'
import transactionAlert from '../components/TransactionAlert/reducer.js'
import walletListModal from '../components/WalletListModal/reducer'
import dimensions from '../dimensions/reducer'
import changeMiningFee from './ChangeMiningFee/reducer'
import createWallet from './CreateWallet/reducer'
import editToken from './EditToken/reducer'
import request from './Request/reducer.js'
import scan from './Scan/reducer'
import sendConfirmation from './SendConfirmation/reducer'
import transactionDetails from './TransactionDetails/reducer'
import transactionList from './TransactionList/reducer'
import walletList from './WalletList/reducer'
import { walletTransferListReducer as walletTransferList } from './WalletTransferList/reducer'

export const scenes = combineReducers({
  scan,
  sendConfirmation,
  changeMiningFee,
  transactionList,
  transactionDetails,
  controlPanel,
  walletList,
  walletTransferList,
  walletListModal,
  sideMenu,
  createWallet,
  editToken,
  request,
  dimensions,
  helpModal,
  transactionAlert,
  exchangeRate,
  ABAlert
})
