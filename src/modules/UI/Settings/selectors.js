// @flow

import type { AbcCurrencyPlugin, AbcDenomination } from 'edge-core-js'

import type { State } from '../../ReduxTypes'
import isoFiatDenominations from './IsoFiatDenominations.js'

const emptyAbcDenom: AbcDenomination = {
  name: '',
  multiplier: '',
  symbol: ''
}

export const getSettings = (state: State) => {
  const settings = state.ui.settings
  return settings
}

export const getIsTouchIdSupported = (state: State) => {
  const settings = getSettings(state)
  return settings.isTouchSupported
}
export const getIsTouchIdEnabled = (state: State) => {
  const settings = getSettings(state)
  return settings.isTouchEnabled
}

export const getLoginStatus = (state: State): boolean => {
  const settings = getSettings(state)
  const loginStatus: boolean = settings.loginStatus
  return loginStatus
}

export const getCurrencySettings = (state: State, currencyCode: string) => {
  const settings = getSettings(state)
  const currencySettings = settings[currencyCode] || isoFiatDenominations[currencyCode]
  return currencySettings
}

export const getDenominations = (state: State, currencyCode: string) => {
  const currencySettings = getCurrencySettings(state, currencyCode)
  const denominations = currencySettings.denominations
  return denominations
}

export const getDisplayDenominationKey = (state: State, currencyCode: string) => {
  const settings = getSettings(state)
  const currencySettings = settings[currencyCode]
  const selectedDenominationKey = currencySettings.denomination
  return selectedDenominationKey
}

export const getDisplayDenominationFromSettings = (settings: any, currencyCode: string) => {
  const currencySettings = settings[currencyCode] || isoFiatDenominations[currencyCode]
  const selectedDenominationKey = currencySettings.denomination
  const denominations = currencySettings.denominations
  const selectedDenomination = denominations.find(denomination => denomination.multiplier === selectedDenominationKey)
  return selectedDenomination
}

export const getDisplayDenominationFull = (state: State, currencyCode: string) => {
  const settings = state.ui.settings
  const currencySettings = settings[currencyCode]
  const selectedDenominationKey = currencySettings.denomination
  const denominations = currencySettings.denominations
  const selectedDenomination = denominations.find(denomination => denomination.multiplier === selectedDenominationKey)
  return selectedDenomination
}

export const getDisplayDenomination = (state: State, currencyCode: string): AbcDenomination => {
  const selectedDenominationKey = getDisplayDenominationKey(state, currencyCode)
  const denominations = getDenominations(state, currencyCode)
  let selectedDenomination: AbcDenomination = emptyAbcDenom
  for (const d of denominations) {
    if (d.multiplier === selectedDenominationKey) {
      selectedDenomination = d
    }
  }
  return selectedDenomination
}

export const getExchangeDenomination = (state: State, currencyCode: string) => {
  const denominations = getDenominations(state, currencyCode)
  const exchangeDenomination = denominations.find(denomination => denomination.name === currencyCode)
  return exchangeDenomination
}

export const getCustomTokens = (state: State) => {
  const settings = getSettings(state)
  return settings.customTokens
}

export const getPlugins = (state: State) => {
  const settings = getSettings(state)
  const plugins = settings.plugins
  return plugins
}

export const getPlugin = (state: State, type: string): AbcCurrencyPlugin => {
  const plugins = getPlugins(state)
  const plugin: AbcCurrencyPlugin = plugins[type.toLowerCase()]
  return plugin
}

export const getBitcoinPlugin = (state: State): AbcCurrencyPlugin => {
  const bitcoinPlugin: AbcCurrencyPlugin = getPlugin(state, 'bitcoin')
  return bitcoinPlugin
}

export const getEthereumPlugin = (state: State): AbcCurrencyPlugin => {
  const ethereumPlugin: AbcCurrencyPlugin = getPlugin(state, 'ethereum')
  return ethereumPlugin
}

export const getSupportedWalletTypes = (state: State) => {
  const plugins = getPlugins(state).arrayPlugins

  const supportedWalletTypes = []
  for (const plugin of plugins) {
    if (plugin.currencyInfo.pluginName === 'bitcoin') {
      supportedWalletTypes.push({
        label: 'Bitcoin (Segwit)',
        value: 'wallet:bitcoin-bip49',
        symbolImage: plugin.currencyInfo.symbolImage,
        symbolImageDarkMono: plugin.currencyInfo.symbolImageDarkMono,
        currencyCode: plugin.currencyInfo.currencyCode
      })
      supportedWalletTypes.push({
        label: 'Bitcoin (no Segwit)',
        value: 'wallet:bitcoin-bip44',
        symbolImage: plugin.currencyInfo.symbolImage,
        symbolImageDarkMono: plugin.currencyInfo.symbolImageDarkMono,
        currencyCode: plugin.currencyInfo.currencyCode
      })
    } else {
      supportedWalletTypes.push({
        label: plugin.currencyInfo.currencyName,
        value: plugin.currencyInfo.walletTypes[0],
        symbolImage: plugin.currencyInfo.symbolImage,
        symbolImageDarkMono: plugin.currencyInfo.symbolImageDarkMono,
        currencyCode: plugin.currencyInfo.currencyCode
      })
    }
  }

  return supportedWalletTypes
}

export const getSettingsLock = (state: State) => {
  const settings = getSettings(state)
  return settings.changesLocked
}
export const getAutoLogoutTimeInSeconds = (state: State): number => {
  const settings = getSettings(state)
  const autoLogoutTimeInSeconds: number = settings.autoLogoutTimeInSeconds
  return autoLogoutTimeInSeconds
}

export const getAutoLogoutTimeInMinutes = (state: State) => {
  const autoLogoutTimeInSeconds = getAutoLogoutTimeInSeconds(state)
  const autoLogoutTimeInMinutes = autoLogoutTimeInSeconds / 60
  return autoLogoutTimeInMinutes
}

export const getDefaultFiat = (state: State) => {
  const settings = getSettings(state)
  const defaultFiat: string = settings.defaultFiat
  return defaultFiat
}

export const getIsOtpEnabled = (state: State) => {
  const settings = getSettings(state)
  const enabled: boolean = settings.isOtpEnabled
  return enabled
}
export const getOtpKey = (state: State) => {
  const settings = getSettings(state)
  const otpKey: string = settings.otpKey
  return otpKey
}

export const getOtpResetDate = (state: State) => {
  const settings = getSettings(state)
  const otpResetDate = settings.otpResetDate
  return otpResetDate
}

export const getConfirmPasswordErrorMessage = (state: State) => {
  const settings = getSettings(state)
  return settings.confirmPasswordError
}

export const getSendLogsStatus = (state: State) => {
  const settings = getSettings(state)
  const sendLogsStatus = settings.sendLogsStatus
  return sendLogsStatus
}

export const getPinLoginEnabled = (state: State) => {
  const settings = getSettings(state)
  const pinLoginEnabled = settings.pinLoginEnabled
  return pinLoginEnabled
}

export const getOtpResetPending = (state: State) => {
  const settings = getSettings(state)
  const otpResetPending = settings.otpResetPending
  return otpResetPending
}
