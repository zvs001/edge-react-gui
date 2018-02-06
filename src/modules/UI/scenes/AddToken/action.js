// @flow

import {Actions} from 'react-native-router-flux'

import * as UTILS from '../../../utils.js'
import * as SETTINGS_API from '../../../Core/Account/settings.js'
import * as WALLET_API from '../../../Core/Wallets/api.js'
import * as CORE_SELECTORS from '../../../Core/selectors.js'
import * as WALLET_ACTIONS from '../../Wallets/action.js'
import * as UI_WALLET_SELECTORS from '../../selectors.js'
import type {Dispatch, State, GetState} from '../../../ReduxTypes'
import type {CustomTokenInfo} from '../../../../types.js'

import {displayErrorAlert} from '../../components/ErrorAlert/actions'

export const ADD_TOKEN = 'ADD_TOKEN'
export const ADD_TOKEN_START = 'ADD_TOKEN_START'
export const ADD_TOKEN_SUCCESS = 'ADD_TOKEN_SUCCESS'
export const SET_TOKEN_SETTINGS = 'SET_TOKEN_SETTINGS'
export const ADD_NEW_CUSTOM_TOKEN_SUCCESS = 'ADD_NEW_CUSTOM_TOKEN_SUCCESS'
export const ADD_NEW_CUSTOM_TOKEN_FAILURE = 'ADD_NEW_CUSTOM_TOKEN_FAILURE'

export const addNewToken = (walletId: string, currencyName: string, currencyCode: string, contractAddress: string, denomination: string) => {
  return (dispatch: Dispatch, getState: GetState) => {
    dispatch(addTokenStart())
    const state = getState()
    addTokenAsync(walletId, currencyName, currencyCode, contractAddress, denomination, state)
    .then((addedWalletInfo) => {
      const {walletId, newTokenObj, setSettings, enabledTokensOnWallet} = addedWalletInfo
      dispatch(addNewTokenSuccess(walletId, newTokenObj, setSettings, enabledTokensOnWallet))
      dispatch(WALLET_ACTIONS.refreshWallet(walletId))
      Actions.pop()
    })
    .catch((e) => {
      dispatch(addNewTokenFailure(e.message))
      dispatch(displayErrorAlert(e.message))
    })
  }
}

export async function addTokenAsync (walletId: string, currencyName: string, currencyCode: string, contractAddress: string, denomination: string, state: State) {
  // create modified object structure to match metaTokens
  const newTokenObj: CustomTokenInfo = WALLET_ACTIONS.assembleCustomToken(currencyName, currencyCode, contractAddress, denomination)
  const account = CORE_SELECTORS.getAccount(state)
  const uiWallet = UI_WALLET_SELECTORS.getWallet(state, walletId)
  const coreWallet = CORE_SELECTORS.getWallet(state, walletId)
  await coreWallet.addCustomToken(newTokenObj)
  coreWallet.enableTokens([currencyCode])
  const settingsOnFile = await SETTINGS_API.getSyncedSettingsAsync(account)

  const setSettings = settingsOnFile
  const customTokens = settingsOnFile.customTokens
  let newCustomTokens = []
  if (!customTokens || customTokens.length === 0) { // if customTokens array is empty
    newCustomTokens = [newTokenObj]
  } else {
    newCustomTokens = UTILS.mergeTokens([newTokenObj], customTokens) // otherwise merge metaTokens and customTokens
  }
  settingsOnFile.customTokens = newCustomTokens
  settingsOnFile[currencyCode] = newTokenObj
  await SETTINGS_API.setSyncedSettingsAsync(account, settingsOnFile)
  const newEnabledTokens = uiWallet.enabledTokens
  if (uiWallet.enabledTokens.indexOf(newTokenObj.currencyCode) === -1) {
    newEnabledTokens.push(newTokenObj.currencyCode)
  }
  await WALLET_API.setEnabledTokens(coreWallet, newEnabledTokens)
  return {walletId, newTokenObj, setSettings, enabledTokensOnWallet: newEnabledTokens}
}

export const addTokenStart = () => ({
  type: ADD_TOKEN_START
})

export const addTokenSuccess = () => ({
  type: ADD_TOKEN_SUCCESS
})

export function addNewTokenSuccess (walletId: string, tokenObj: CustomTokenInfo, settings: any, enabledTokens: Array<string>) {
  const data = {walletId, tokenObj, settings, enabledTokens, newCurrencyCode: tokenObj.currencyCode}
  return {
    type: ADD_NEW_CUSTOM_TOKEN_SUCCESS,
    data
  }
}

export function addNewTokenFailure (errorMessage: string) {
  const data = {errorMessage}
  return {
    type: ADD_NEW_CUSTOM_TOKEN_FAILURE,
    data
  }
}

export function setTokenSettings (tokenObj: CustomTokenInfo) {
  const data = tokenObj
  return {
    type: SET_TOKEN_SETTINGS,
    data
  }
}
