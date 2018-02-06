// @flow

import type { AbcCurrencyPlugin } from 'edge-login'
import _ from 'lodash'

import * as ACTION from './action.js'
import * as Constants from '../../../constants/indexConstants.js'
import * as ADD_TOKEN_ACTION from '../scenes/AddToken/action.js'
import * as WALLET_ACTION from '../Wallets/action'
import { SYNCED_ACCOUNT_DEFAULTS, LOCAL_ACCOUNT_DEFAULTS, CORE_DEFAULTS } from '../../Core/Account/settings.js'

import type { Action } from '../../ReduxTypes'
import type { CustomTokenInfo } from '../../../types'

const initialState = {
  ...SYNCED_ACCOUNT_DEFAULTS,
  ...LOCAL_ACCOUNT_DEFAULTS,
  ...CORE_DEFAULTS,
  changesLocked: true,
  plugins: {
    arrayPlugins: [],
    supportedWalletTypes: []
  },
  account: null,
  loginStatus: null,
  isTouchSupported: false,
  isTouchEnabled: false,
  isOtpEnabled: false,
  otpKey: null,
  otpResetDate: null
}

type SettingsState = {
  BCH: {
    denomination: string
  },
  BTC: {
    denomination: string
  },
  DASH: {
    denomination: string
  },
  ETH: {
    denomination: string
  },
  LTC: {
    denomination: string
  },
  REP: {
    denomination: string
  },
  WINGS: {
    denomination: string
  },
  account: ?Object,
  autoLogoutTimeInSeconds: number,
  bluetoothMode: boolean,
  changesLocked: any,
  customTokens: Array<CustomTokenInfo>,
  defaultFiat: string,
  isOtpEnabled: boolean,
  isTouchEnabled: any,
  isTouchSupported: boolean,
  loginStatus: null,
  merchantMode: boolean,
  otpKey: null,
  otpMode: boolean,
  pinMode: boolean,
  otpResetDate: ?string,
  plugins: {
    arrayPlugins: Array<AbcCurrencyPlugin>,
    supportedWalletTypes: Array<string>
  }
}

const currencyPLuginUtil = (state, payloadData) => {
  const { plugins } = state
  const { supportedWalletTypes } = plugins
  const { arrayPlugins } = plugins
  const { pluginName, plugin, walletTypes } = payloadData
  const currencyInfo = plugin.currencyInfo
  // Build up object with all the information for the parent currency, accesible by the currencyCode
  const defaultParentCurrencyInfo = state[currencyInfo.currencyCode]
  const parentCurrencyInfo = {
    [currencyInfo.currencyCode]: {
      ...defaultParentCurrencyInfo,
      currencyName: currencyInfo.currencyName,
      currencyCode: currencyInfo.currencyCode,
      denominations: currencyInfo.denominations,
      symbolImage: currencyInfo.symbolImage,
      symbolImageDarkMono: currencyInfo.symbolImageDarkMono
    }
  }

  // Build up object with all the information for each metatoken, accessible by the token currencyCode
  const metatokenCurrencyInfos = currencyInfo.metaTokens.reduce((acc, metatoken) => {
    const defaultMetatokenInfo = state[metatoken.currencyCode]
    return {
      ...acc,
      [metatoken.currencyCode]: {
        ...defaultMetatokenInfo,
        currencyName: metatoken.currencyName,
        currencyCode: metatoken.currencyCode,
        denominations: metatoken.denominations,
        symbolImage: metatoken.symbolImage,
        symbolImageDarkMono: metatoken.symbolImageDarkMono
      }
    }
  }, {})

  // Build up object with all the currency information for each currency supported by the plugin, accessible by the currencyCode
  const currencyInfos = {
    ...parentCurrencyInfo,
    ...metatokenCurrencyInfos
  }

  return {
    ...state,
    ...currencyInfos,
    plugins: {
      ...plugins,
      [pluginName]: plugin,
      arrayPlugins: [...arrayPlugins, plugin],
      supportedWalletTypes: [...supportedWalletTypes, ...walletTypes]
    }
  }
}

export const settings = (state: SettingsState = initialState, action: Action) => {
  const { type, data = {} } = action

  switch (type) {
    case Constants.ACCOUNT_INIT_COMPLETE: {
      const {
        account,
        loginStatus,
        otpInfo,
        currencyPlugins,
        autoLogoutTimeInSeconds,
        defaultFiat,
        merchantMode,
        customTokens,
        bluetoothMode,
        pinMode,
        otpMode,
        denominationKeys,
        customTokensSettings
       } = data
      let newState = {
        ...state,
        loginStatus,
        isOtpEnabled: otpInfo.enabled,
        otpKey: otpInfo.otpKey,
        autoLogoutTimeInSeconds,
        defaultFiat,
        merchantMode,
        customTokens,
        bluetoothMode,
        pinMode,
        otpMode,
        otpResetDate: account.otpResetDate
      }
      denominationKeys.forEach((key) => {
        const currencyCode = key.currencyCode
        const denomination = key.denominationKey
        const currencyState = newState[currencyCode]
        newState = {
          ...newState,
          [currencyCode]: {
            ...currencyState,
            denomination
          }
        }
      })
      currencyPlugins.forEach((key) => {
        console.log(key)
        newState = currencyPLuginUtil(newState, key)
      })
      customTokensSettings.forEach((key) => {
        const { currencyCode } = key
        newState = {
          ...newState,
          [currencyCode]: key
        }
      })
      return newState
    }
    case ACTION.SET_LOGIN_STATUS: {
      const { loginStatus } = data
      return {
        ...state,
        loginStatus
      }
    }

    case ACTION.SET_CUSTOM_TOKENS: {
      const { customTokens } = data
      return {
        ...state,
        customTokens
      }
    }

    case WALLET_ACTION.UPDATE_EXISTING_TOKEN_SUCCESS: {
      const { tokenObj } = data
      const customTokenSettings = state.customTokens
      const newCustomTokenSettings = customTokenSettings.map(item => {
        if (item.currencyCode === tokenObj.currencyCode) return { ...item, ...tokenObj }
        return item
      })
      const updatedSettings = {
        ...state,
        [tokenObj.currencyCode]: {
          ...state[tokenObj.currencyCode],
          ...tokenObj
        },
        customTokens: newCustomTokenSettings
      }
      return updatedSettings
    }

    case WALLET_ACTION.OVERWRITE_THEN_DELETE_TOKEN_SUCCESS: {
      // where oldCurrencyCode is the sender, and tokenObj.currencyCode is the receiver (new code)
      const receiverCode = data.tokenObj.currencyCode
      const senderCode = data.oldCurrencyCode
      const { tokenObj } = data
      const customTokenSettings = state.customTokens
      const tokenSettingsWithUpdatedToken = customTokenSettings.map(item => {
        // overwrite receiver token
        if (item.currencyCode === receiverCode) return { ...item, ...tokenObj, isVisible: true }
        return item
      })
      const tokenSettingsWithUpdatedAndDeleted = tokenSettingsWithUpdatedToken.map(item => {
        // make sender token invisible
        if (item.currencyCode === senderCode) return { ...item, isVisible: false }
        return item
      })
      const updatedSettings = {
        ...state,
        [receiverCode]: {
          ...state[receiverCode],
          ...tokenObj,
          isVisible: true
        },
        [senderCode]: {
          ...state[senderCode],
          isVisible: false
        },
        customTokens: tokenSettingsWithUpdatedAndDeleted
      }
      return updatedSettings
    }

    case WALLET_ACTION.DELETE_CUSTOM_TOKEN_SUCCESS: {
      const { currencyCode } = data
      const customTokenSettings = state.customTokens
      const newCustomTokenSettings = customTokenSettings.map(item => {
        if (item.currencyCode === currencyCode) return { ...item, isVisible: false }
        return item
      })
      return {
        ...state,
        [currencyCode]: {
          ...state[currencyCode],
          isVisible: false
        },
        customTokens: newCustomTokenSettings
      }
    }

    case ADD_TOKEN_ACTION.SET_TOKEN_SETTINGS: {
      const { currencyCode } = data
      return {
        ...state,
        [currencyCode]: data
      }
    }

    case ADD_TOKEN_ACTION.ADD_NEW_CUSTOM_TOKEN_SUCCESS: {
      const { tokenObj, newCurrencyCode, settings } = data
      const customTokens = settings.customTokens
      return {
        ...state,
        [newCurrencyCode]: tokenObj,
        customTokens
      }
    }

    case WALLET_ACTION.ADD_NEW_TOKEN_THEN_DELETE_OLD_SUCCESS: {
      const { tokenObj, code, setSettings, oldCurrencyCode } = data
      const customTokens = setSettings.customTokens
      const oldCurrencyCodeIndex = _.findIndex(customTokens, item => item.currencyCode === oldCurrencyCode)
      customTokens[oldCurrencyCodeIndex] = {
        ...state.customTokens[oldCurrencyCodeIndex],
        isVisible: false
      }
      return {
        ...state,
        [code]: tokenObj,
        [oldCurrencyCode]: {
          ...state[oldCurrencyCode],
          isVisible: false
        },
        customTokens
      }
    }

    case ACTION.SET_DENOMINATION_KEY: {
      const currencyCode = data.currencyCode
      const denomination = data.denominationKey
      const currencyState = state[currencyCode]
      return {
        ...state,
        [currencyCode]: {
          ...currencyState,
          denomination
        }
      }
    }
    case Constants.DISABLE_OTP_RESET: {
      return {
        ...state,
        otpResetDate: null
      }
    }
    case ACTION.UPDATE_SETTINGS: {
      const { settings } = data
      return settings
    }

    case ACTION.LOAD_SETTINGS: {
      const { settings } = data
      return settings
    }

    case ACTION.SET_PIN_MODE: {
      const { pinMode } = data
      return {
        ...state,
        pinMode
      }
    }

    case ACTION.SET_OTP_MODE: {
      const { otpMode } = data
      return {
        ...state,
        otpMode
      }
    }

    case ACTION.SET_AUTO_LOGOUT_TIME: {
      const { autoLogoutTimeInSeconds } = data
      return {
        ...state,
        autoLogoutTimeInSeconds
      }
    }

    case ACTION.SET_DEFAULT_FIAT: {
      const { defaultFiat } = data
      return {
        ...state,
        defaultFiat
      }
    }

    case ACTION.SET_MERCHANT_MODE: {
      const { merchantMode } = data
      return {
        ...state,
        merchantMode
      }
    }

    case ACTION.SET_BLUETOOTH_MODE: {
      const { bluetoothMode } = data
      return {
        ...state,
        bluetoothMode
      }
    }

    case ACTION.SET_BITCOIN_OVERRIDE_SERVER: {
      const { overrideServer } = data
      const BTC = state['BTC']
      return {
        ...state,
        BTC: {
          ...BTC,
          overrideServer
        }
      }
    }

    case ACTION.SET_SETTINGS_LOCK: {
      return {
        ...state,
        changesLocked: data
      }
    }

    case ACTION.OTP_SETTINGS: {
      return {
        ...state,
        isOtpEnabled: data.enabled,
        otpKey: data.otpKey
      }
    }

    case ACTION.TOUCH_ID_SETTINGS: {
      if (data) {
        return {
          ...state,
          isTouchSupported: data.isTouchSupported,
          isTouchEnabled: data.isTouchEnabled
        }
      } else {
        return {
          ...state,
          isTouchSupported: false,
          isTouchEnabled: false
        }
      }
    }

    case ACTION.CHANGE_TOUCH_ID_SETTINGS: {
      return {
        ...state,
        isTouchEnabled: data
      }
    }

    case ACTION.ADD_CURRENCY_PLUGIN: {
      return currencyPLuginUtil(state, data)
    }

    default:
      return state
  }
}
