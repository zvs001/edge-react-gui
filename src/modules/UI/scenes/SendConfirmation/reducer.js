// @flow
import * as ACTION from './action'
import type {AbcTransaction, AbcSpendInfo} from 'airbitz-core-types'

export type SendConfirmationState = {
  transaction: AbcTransaction | null,
  error: Error | null,

  spendInfo: ?AbcSpendInfo,

  displayAmount: number,
  publicAddress: string,
  feeSatoshi: number,
  label: string,

  inputCurrencySelected: string,
  maxSatoshi: number,
  isPinEnabled: boolean,
  isSliderLocked: boolean,
  draftStatus: string,
  isKeyboardVisible: boolean,
  pending: boolean
}

export const initialState: SendConfirmationState = {
  transaction: null,
  error: null,

  spendInfo: null,

  displayAmount: 0,
  publicAddress: '',
  feeSatoshi: 0,
  label: '',

  inputCurrencySelected: 'fiat',
  maxSatoshi: 0,
  isPinEnabled: false,
  isSliderLocked: false,
  draftStatus: 'under',
  isKeyboardVisible: false,
  pending: false
}

const sendConfirmation = (state: SendConfirmationState = initialState, action: any) => {
  const {type, data = {} } = action
  switch (type) {
  case ACTION.UPDATE_TRANSACTION: {
    const transaction: AbcTransaction = data.transaction
    const error: Error = data.error
    const out: SendConfirmationState = {
      ...state,
      transaction,
      error
    }
    return out
  }
  case ACTION.UPDATE_DISPLAY_AMOUNT: {
    const {displayAmount} = data
    return {
      ...state,
      displayAmount
    }
  }
  case ACTION.UPDATE_SPEND_INFO: {
    const {spendInfo} = data
    return {
      ...state,
      spendInfo
    }
  }
  case ACTION.UPDATE_MAX_SATOSHI: {
    const {maxSatoshi} = data
    return {
      ...state,
      maxSatoshi
    }
  }
  case ACTION.USE_MAX_SATOSHI: {
    const {maxSatoshi} = data
    return {
      ...state,
      maxSatoshi
    }
  }
  case ACTION.UNLOCK_SLIDER: {
    const {isSliderLocked} = data
    return {
      ...state,
      isSliderLocked
    }
  }
  case ACTION.UPDATE_DRAFT_STATUS: {
    const {draftStatus} = data
    return {
      ...state,
      draftStatus
    }
  }
  case ACTION.UPDATE_IS_KEYBOARD_VISIBLE: {
    const {isKeyboardVisible} = data
    return {
      ...state,
      isKeyboardVisible
    }
  }
  case ACTION.UPDATE_SPEND_PENDING: {
    const {pending} = data
    return {
      ...state,
      pending
    }
  }
  case ACTION.RESET: {
    return initialState
  }
  default:
    return state
  }
}

export default sendConfirmation
