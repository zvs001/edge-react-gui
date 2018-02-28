/* globals test expect */

import { changeMiningFee as changeMiningFeeReducer } from './reducer.js'

test('initialState', () => {
  const expected = {
    isCustomFeeVisible: false
  }
  const actual = changeMiningFeeReducer(undefined, {})

  expect(actual).toEqual(expected)
})
