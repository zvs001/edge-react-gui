/* globals test expect */

import { core, cryptoExchange, exchangeRates, permissions, rootReducer, ui, contacts } from './rootReducer.js'

test('initialState', () => {
  const expected = {
    core: core(undefined, {}),
    ui: ui(undefined, {}),
    cryptoExchange: cryptoExchange(undefined, {}),
    exchangeRates: exchangeRates(undefined, {}),
    permissions: permissions(undefined, {}),
    contacts: contacts(undefined, {})
  }
  const actual = rootReducer(undefined, {})

  expect(actual).toEqual(expected)
})
