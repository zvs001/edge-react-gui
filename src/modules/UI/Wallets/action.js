// @flow

import * as UI_SELECTORS from '../selectors.js'
import * as CORE_SELECTORS from '../../Core/selectors.js'
import * as SETTINGS_SELECTORS from '../Settings/selectors'
import * as SETTINGS_API from '../../Core/Account/settings.js'
import {Actions} from 'react-native-router-flux'
import {
  updateSettings
} from '../Settings/action'
import {addTokenAsync} from '../scenes/AddToken/action'
import {displayErrorAlert} from '../../UI/components/ErrorAlert/actions'
import type {Dispatch, GetState} from '../../ReduxTypes'
import type {GuiWallet, CustomTokenInfo} from '../../../types.js'
import type {AbcCurrencyWallet} from 'airbitz-core-types'
import * as UTILS from '../../utils'
import * as WALLET_API from '../../Core/Wallets/api.js'
import _ from 'lodash'

export const PREFIX = 'UI/Wallets/'

export const UPSERT_WALLET = PREFIX + 'UPSERT_WALLET'

export const ACTIVATE_WALLET_ID = PREFIX + 'ACTIVATE_WALLET_ID'
export const ARCHIVE_WALLET_ID = PREFIX + 'ARCHIVE_WALLET_ID'

export const SELECT_WALLET = PREFIX + 'SELECT_WALLET'

export const MANAGE_TOKENS = 'MANAGE_TOKENS'
export const MANAGE_TOKENS_START = 'MANAGE_TOKENS_START'
export const MANAGE_TOKENS_SUCCESS = 'MANAGE_TOKENS_SUCCESS'
export const DELETE_CUSTOM_TOKEN_START = 'DELETE_CUSTOM_TOKEN_START'
export const DELETE_CUSTOM_TOKEN_SUCCESS = 'DELETE_CUSTOM_TOKEN_SUCCESS'
export const DELETE_CUSTOM_TOKEN_FAILURE = 'DELETE_CUSTOM_TOKEN_FAILURE'
export const UPDATE_WALLET_ENABLED_TOKENS = 'UPDATE_WALLET_ENABLED_TOKENS'
export const EDIT_CUSTOM_TOKEN_START = 'EDIT_CUSTOM_TOKEN_START'
export const EDIT_CUSTOM_TOKEN_SUCCESS = 'EDIT_CUSTOM_TOKEN_SUCCESS'
export const EDIT_CUSTOM_TOKEN_FAILURE = 'EDIT_CUSTOM_TOKEN_FAILURE'
export const UPDATE_EXISTING_TOKEN_SUCCESS = 'UPDATE_EXISTING_TOKEN_SUCCESS'
export const OVERWRITE_THEN_DELETE_TOKEN_SUCCESS = 'OVERWRITE_THEN_DELETE_TOKEN_SUCCESS'
export const ADD_NEW_TOKEN_THEN_DELETE_OLD_SUCCESS = 'ADD_NEW_TOKEN_THEN_DELETE_OLD_SUCCESS'

export const selectWallet = (walletId: string, currencyCode: string) => ({
  type: SELECT_WALLET,
  data: {walletId, currencyCode}
})

function dispatchUpsertWallet (dispatch, wallet, walletId) {
  dispatch(upsertWallet(wallet))
  refreshDetails[walletId].delayUpsert = false
  refreshDetails[walletId].lastUpsert = Date.now()
}

const refreshDetails = {}

export const refreshWallet = (walletId: string) => (dispatch: Dispatch, getState: GetState) => {
  const state = getState()
  const wallet = CORE_SELECTORS.getWallet(state, walletId)
  if (wallet) {
    if (!refreshDetails[walletId]) {
      refreshDetails[walletId] = {
        delayUpsert: false,
        lastUpsert: 0
      }
    }
    if (!refreshDetails[walletId].delayUpsert) {
      const now = Date.now()
      if (now - refreshDetails[walletId].lastUpsert > 3000) {
        dispatchUpsertWallet(dispatch, wallet, walletId)
      } else {
        console.log('refreshWallets setTimeout delay upsert id:' + walletId)
        refreshDetails[walletId].delayUpsert = true
        setTimeout(() => {
          dispatchUpsertWallet(dispatch, wallet, walletId)
        }, 3000)
      }
    } else {
      console.log('refreshWallets delayUpsert id:' + walletId)
    }
  } else {
    console.log('refreshWallets no wallet. id:' + walletId)
  }
}

export const upsertWallet = (wallet: AbcCurrencyWallet) => (dispatch: Dispatch, getState: GetState) => {
  const state = getState()
  const loginStatus = SETTINGS_SELECTORS.getLoginStatus(state)
  if (!loginStatus) {
    dispatch({type: 'LOGGED_OUT'})
    return
  }

  dispatch({
    type: UPSERT_WALLET,
    data: {wallet}
  })
}

// adds to core and enables in core
export const addCustomToken = (walletId: string, tokenObj: any) => (dispatch: Dispatch, getState: GetState) => {
  const state = getState()
  const wallet = CORE_SELECTORS.getWallet(state, walletId)
  WALLET_API.addCoreCustomToken(wallet, tokenObj)
  .catch((e) => dispatch(displayErrorAlert(e.message)))
}

export const setEnabledTokens = (walletId: string, enabledTokens: Array<string>, disabledTokens: Array<string>) => (dispatch: Dispatch, getState: GetState) => {
  // tell Redux that we are updating the enabledTokens list
  dispatch(setTokensStart())
  // get a snapshot of the state
  const state = getState()
  // get a copy of the relevant core wallet
  const wallet = CORE_SELECTORS.getWallet(state, walletId)
  // now actually tell the wallet to enable the token(s) in the core and save to file
  WALLET_API.setEnabledTokens(wallet, enabledTokens, disabledTokens)
  .then(() => {
    // let Redux know it was completed successfully
    dispatch(setTokensSuccess())
    dispatch(updateWalletEnabledTokens(walletId, enabledTokens))
    // refresh the wallet in Redux
    dispatch(refreshWallet(walletId))
  })
  .catch((e) => dispatch(displayErrorAlert(e.message)))
}

export const getEnabledTokens = (walletId: string) => async (dispatch: Dispatch, getState: GetState) => {
  // get a snapshot of the state
  const state = getState()
  // get the AbcWallet
  const wallet = CORE_SELECTORS.getWallet(state, walletId)
  const guiWallet = UI_SELECTORS.getWallet(state, walletId)

  // get token information from settings
  const customTokens: Array<CustomTokenInfo> = SETTINGS_SELECTORS.getCustomTokens(state)
  try {
    const enabledTokens = await WALLET_API.getEnabledTokensFromFile(wallet)
    const promiseArray = []
    const tokensToEnable = []

    // Add any enabledTokens that are custom tokens or in the currencyInfo
    for (const et of enabledTokens) {
      let found = guiWallet.metaTokens.find((element) => {
        return element.currencyCode === et
      })
      if (found) {
        tokensToEnable.push(et)
        continue
      }

      found = customTokens.find((element) => {
        return element.currencyCode === et
      })
      if (found) {
        tokensToEnable.push(et)
        promiseArray.push(wallet.addCustomToken(found))
      }
    }
    await Promise.all(promiseArray)
    // now reflect that change in Redux's version of the wallet
    dispatch(updateWalletEnabledTokens(walletId, tokensToEnable))
  } catch (e) {
    dispatch(displayErrorAlert(e.message))
  }
}

export const assembleCustomToken = (currencyName: string, currencyCode: string, contractAddress: string, denomination: string) => {
  // create modified object structure to match metaTokens
  const newTokenObj: CustomTokenInfo = {
    currencyName,
    currencyCode,
    contractAddress,
    denomination,
    multiplier: denomination,
    denominations: [{
      name: currencyCode,
      multiplier: denomination,
      symbol: ''
    }],
    isVisible: true
  }

  return newTokenObj
}

export const editCustomToken = (walletId: string, currencyName: string, currencyCode: string, contractAddress: string, denomination: string, oldCurrencyCode: string) => {
  return (dispatch: Dispatch, getState: GetState) => {
    dispatch(editCustomTokenStart())
    const state = getState()
    const settings = SETTINGS_SELECTORS.getSettings(state)
    const customTokens = settings.customTokens
    const guiWallet = UI_SELECTORS.getWallet(state, walletId)
    const allTokens = UTILS.mergeTokens(guiWallet.metaTokens, customTokens)
    const indexInAllTokens = _.findIndex(allTokens, (token) => token.currencyCode === currencyCode)
    const tokenObj = assembleCustomToken(currencyName, currencyCode, denomination, contractAddress)
    if (indexInAllTokens >= 0) { // currently exists in some form
      if (currencyCode === oldCurrencyCode) { // just updating same token, CASE 1
        addTokenAsync(walletId, currencyName, currencyCode, contractAddress, denomination, state)
        .then(() => {
          dispatch(updateExistingTokenSuccess(tokenObj))
          Actions.pop()
        })
        .catch((e) => {
          dispatch(displayErrorAlert(e.message))
          dispatch(editCustomTokenFailure())
        })
      } else { // replacing an existing but invisible token CASE 3
        addTokenAsync(walletId, currencyName, currencyCode, contractAddress, denomination, state) // update the receiving token
        .then(() => {
          deleteCustomTokenAsync(walletId, oldCurrencyCode, getState) // delete the sending token
          .then((coreWalletsToUpdate) => {
            dispatch(overwriteThenDeleteTokenSuccess(tokenObj, oldCurrencyCode, coreWalletsToUpdate))
            Actions.pop()
          })
        })
        .catch((e) => {
          dispatch(displayErrorAlert(e.message))
          dispatch(editCustomTokenFailure())
        })
      }
    } else { // does not yet exist. Create the new one then delete the old one, CASE 4
      addTokenAsync(walletId, currencyName, currencyCode, contractAddress, denomination, state)
      .then((addedTokenData) => {
        deleteCustomTokenAsync(walletId, oldCurrencyCode, getState)
        .then((coreWalletsToUpdate) => {
          tokenObj.isVisible = true
          dispatch(addNewTokenThenDeleteOldSuccess({
            walletId,
            tokenObj: addedTokenData.newTokenObj,
            setSettings: addedTokenData.setSettings,
            enabledTokensOnWallet: addedTokenData.enabledTokensOnWallet,
            oldCurrencyCode,
            coreWalletsToUpdate,
            code: tokenObj.currencyCode
          }))
          Actions.pop()
        })
      })
      .catch((e) => {
        dispatch(displayErrorAlert(e.message))
        dispatch(editCustomTokenFailure())
      })
    }
  }
}

export async function deleteCustomTokenAsync (walletId: string, currencyCode: string, getState: GetState) {
  const state = getState()
  const coreWallets = CORE_SELECTORS.getWallets(state)
  const guiWallets: Array<GuiWallet> = state.ui.wallets.byId
  const account = CORE_SELECTORS.getAccount(state)
  const coreWalletsToUpdate = []
  const receivedSyncSettings = await SETTINGS_API.getSyncedSettings(account)
  receivedSyncSettings[currencyCode].isVisible = false
  const syncedCustomTokens: Array<CustomTokenInfo> = [...receivedSyncSettings.customTokens]
  const indexOfSyncedToken: number = _.findIndex(syncedCustomTokens, (item) => item.currencyCode === currencyCode)
  syncedCustomTokens[indexOfSyncedToken].isVisible = false
  receivedSyncSettings.customTokens = syncedCustomTokens
  await SETTINGS_API.setSyncedSettingsAsync(account, receivedSyncSettings)
  const walletPromises = Object.values(guiWallets).map((wallet) => {
    // Flow is having issues here, need to fix
    // $FlowFixMe
    const temporaryWalletId = wallet.id
    const theCoreWallet = coreWallets[temporaryWalletId]
    // $FlowFixMe
    if (wallet.enabledTokens && wallet.enabledTokens.length > 0) { // if the wallet has some enabled tokens
      coreWalletsToUpdate.push(theCoreWallet)
      return WALLET_API.updateEnabledTokens(theCoreWallet, [], [currencyCode])
    }
    return Promise.resolve()
  })
  await Promise.all(walletPromises)
  return coreWalletsToUpdate
}

export const deleteCustomToken = (walletId: string, currencyCode: string) => (dispatch: any, getState: any) => {
  const state = getState()
  const coreWallets = CORE_SELECTORS.getWallets(state)
  const guiWallets = state.ui.wallets.byId
  const account = CORE_SELECTORS.getAccount(state)
  const localSettings = {
    ...SETTINGS_SELECTORS.getSettings(state)
  }
  const coreWalletsToUpdate = []
  dispatch(deleteCustomTokenStart())
  SETTINGS_API.getSyncedSettings(account)
  .then((settings) => {
    settings[currencyCode].isVisible = false // remove top-level property. We should migrate away from it eventually anyway
    localSettings[currencyCode].isVisible = false
    const customTokensOnFile = [...settings.customTokens] // should use '|| []' as catch-all or no?
    const customTokensOnLocal = [...localSettings.customTokens]
    const indexOfToken = _.findIndex(customTokensOnFile, (item) => item.currencyCode === currencyCode)
    const indexOfTokenOnLocal = _.findIndex(customTokensOnLocal, (item) => item.currencyCode === currencyCode)
    customTokensOnFile[indexOfToken].isVisible = false
    customTokensOnLocal[indexOfTokenOnLocal].isVisible = false
    settings.customTokens = customTokensOnFile
    localSettings.customTokens = customTokensOnLocal
    return settings
  })
  .then((adjustedSettings) => {
    return SETTINGS_API.setSyncedSettings(account, adjustedSettings)
  })
  .then(() => {
    const walletPromises = Object.values(guiWallets).map((wallet) => {
      // Flow is having issues here, need to fix
      // $FlowFixMe
      const temporaryWalletId = wallet.id
      const theCoreWallet = coreWallets[temporaryWalletId]
      // $FlowFixMe
      if (wallet.enabledTokens && wallet.enabledTokens.length > 0) {
        coreWalletsToUpdate.push(theCoreWallet)
        return WALLET_API.updateEnabledTokens(theCoreWallet, [], [currencyCode])
      }
      return Promise.resolve()
    })
    return Promise.all(walletPromises)
  })
  .then(() => {
    coreWalletsToUpdate.forEach((wallet) => {
      dispatch(upsertWallet(wallet))
      const newEnabledTokens = _.difference(guiWallets[wallet.id].enabledTokens, [currencyCode])
      dispatch(updateWalletEnabledTokens(wallet.id, newEnabledTokens))
    })
  })
  .then(() => {
    dispatch(updateSettings(localSettings))
    dispatch(deleteCustomTokenSuccess(currencyCode)) // need to remove modal and update settings
    Actions.pop()
  })
  .catch((e) => {
    dispatch(displayErrorAlert(e.message))
    dispatch(deleteCustomTokenFailure())
  })
}

export const deleteCustomTokenStart = () => ({
  type: DELETE_CUSTOM_TOKEN_START
})

export const deleteCustomTokenSuccess = (currencyCode: string) => ({
  type: DELETE_CUSTOM_TOKEN_SUCCESS,
  data: {currencyCode}
})

export const deleteCustomTokenFailure = () => ({
  type: DELETE_CUSTOM_TOKEN_FAILURE
})

export const setTokensStart = () => ({
  type: MANAGE_TOKENS_START
})

export const setTokensSuccess = () => ({
  type: MANAGE_TOKENS_SUCCESS
})

export const updateWalletEnabledTokens = (walletId: string, tokens: Array<string>) => ({
  type: UPDATE_WALLET_ENABLED_TOKENS,
  data: {walletId, tokens}
})

export const editCustomTokenStart = () => ({
  type: EDIT_CUSTOM_TOKEN_START
})

export const editCustomTokenSuccess = (currencyCode: string) => ({
  type: EDIT_CUSTOM_TOKEN_SUCCESS,
  data: {currencyCode}
})

export const editCustomTokenFailure = () => ({
  type: EDIT_CUSTOM_TOKEN_FAILURE
})

export function updateExistingTokenSuccess (tokenObj: CustomTokenInfo) {
  return {
    type: UPDATE_EXISTING_TOKEN_SUCCESS,
    data: {tokenObj}
  }
}

export function overwriteThenDeleteTokenSuccess (tokenObj: CustomTokenInfo, oldCurrencyCode: string, coreWalletsToUpdate: Array<AbcCurrencyWallet>) {
  return {
    type: OVERWRITE_THEN_DELETE_TOKEN_SUCCESS,
    data: {tokenObj, oldCurrencyCode, coreWalletsToUpdate}
  }
}

export function addNewTokenThenDeleteOldSuccess (data: any) {
  return {
    type: ADD_NEW_TOKEN_THEN_DELETE_OLD_SUCCESS,
    data
  }
}

export const CREATE_WALLET_START = PREFIX + 'CREATE_WALLET_START'
export const createWalletStart = () => ({
  type: CREATE_WALLET_START
})

export const CREATE_WALLET_SUCCESS = PREFIX + 'CREATE_WALLET_SUCCESS'
export const createWalletSuccess = () => ({
  type: CREATE_WALLET_SUCCESS
})

export const CREATE_WALLET_FAILURE = PREFIX + 'CREATE_WALLET_FAILURE'
export const createWalletFailure = () => ({
  type: CREATE_WALLET_FAILURE
})
