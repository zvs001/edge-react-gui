/* globals test expect */

import { editToken as editTokenReducer } from './reducer.js'

test('initialState', () => {
  const expected = {
    deleteCustomTokenProcessing: false,
    deleteTokenModalVisible: false,
    editCustomTokenProcessing: false
  }
  const actual = editTokenReducer(undefined, {})

  expect(actual).toEqual(expected)
})
