/* globals describe test expect beforeEach jest */
/* eslint-disable import/first */
import {intl, setIntlLocale} from './intl'
import { truncateDecimals } from '../../src/modules/utils'

jest.mock('intl-locales-supported', () => () => (true))

const EN_US_LOCALE = {
  'localeIdentifier': 'en_US',
  'decimalSeparator': '.',
  'quotationBeginDelimiterKey': '“',
  'quotationEndDelimiterKey': '”',
  'currencySymbol': '$',
  'currencyCode': 'USD',
  'groupingSeparator': ','
}
const DE_DE_LOCALE = {
  'localeIdentifier': 'de_DE',
  'decimalSeparator': ',',
  'quotationBeginDelimiterKey': '“',
  'quotationEndDelimiterKey': '”',
  'currencySymbol': 'DKK',
  'currencyCode': 'DKK',
  'groupingSeparator': '.'
}

describe('Intl numbers', function () {
  describe('isValidInput', function () {
    describe('when input is valid', function () {
      beforeEach(function () {
        setIntlLocale(EN_US_LOCALE)
      })
      test('1 => true', function () {
        const validInput = '1'
        const expected = true
        const actual = intl.isValidInput(validInput)
        expect(actual).toBe(expected)
      })

      test('. => true', function () {
        const validInput = '.'
        const expected = true
        const actual = intl.isValidInput(validInput)
        expect(actual).toBe(expected)
      })

      test('.0 => true', function () {
        const validInput = '.'
        const expected = true
        const actual = intl.isValidInput(validInput)
        expect(actual).toBe(expected)
      })

      test('0.0 => true', function () {
        const validInput = '.'
        const expected = true
        const actual = intl.isValidInput(validInput)
        expect(actual).toBe(expected)
      })

      test('0.01 => true', function () {
        const validInput = '.'
        const expected = true
        const actual = intl.isValidInput(validInput)
        expect(actual).toBe(expected)
      })

      test('0 => true', function () {
        const validInput = '.'
        const expected = true
        const actual = intl.isValidInput(validInput)
        expect(actual).toBe(expected)
      })
    })

    describe('when input is invalid', function () {
      beforeEach(function () {
        setIntlLocale(EN_US_LOCALE)
      })
      test('R => false', function () {
        const invalidInput = 'R'
        const expected = false
        const actual = intl.isValidInput(invalidInput)
        expect(actual).toBe(expected)
      })

      test('0R => false', function () {
        const invalidInput = '0R'
        const expected = false
        const actual = intl.isValidInput(invalidInput)
        expect(actual).toBe(expected)
      })

      test('0.R => false', function () {
        const invalidInput = '0.R'
        const expected = false
        const actual = intl.isValidInput(invalidInput)
        expect(actual).toBe(expected)
      })

      test('0.0. => false', function () {
        const invalidInput = '0.0.'
        const expected = false
        const actual = intl.isValidInput(invalidInput)
        expect(actual).toBe(expected)
      })

      test('0.123q => false', function () {
        const invalidInput = '0.123q'
        const expected = false
        const actual = intl.isValidInput(invalidInput)
        expect(actual).toBe(expected)
      })
    })

    describe('en-Us', function () {
      beforeEach(function () {
        setIntlLocale(EN_US_LOCALE)
      })

      test('en .', function () {
        expect(intl.isValidInput('.')).toBe(true)
      })
      test('en 1.', function () {
        expect(intl.isValidInput('1.')).toBe(true)
      })
      test('1,000', function () {
        expect(intl.isValidInput('1,000')).toBe(true)
      })
      test('1,000.12', function () {
        expect(intl.isValidInput('1,000.12')).toBe(true)
      })
      test('test => false', function () {
        expect(intl.isValidInput('test')).toBe(false)
      })
    })

    describe('de-DE', function () {
      beforeEach(() => {
        setIntlLocale(DE_DE_LOCALE)
      })
      test(',', function () {
        expect(intl.isValidInput(',')).toBe(true)
      })
      test('de 1,', function () {
        expect(intl.isValidInput('1,')).toBe(true)
      })
      test('1.000', function () {
        expect(intl.isValidInput('1.000')).toBe(true)
      })
      test('1.000,12', function () {
        expect(intl.isValidInput('1.000,12')).toBe(true)
      })
      test('test => false', function () {
        expect(intl.isValidInput('test')).toBe(false)
      })
    })

    describe('en-US should fail', function () {
      beforeEach(() => {
        setIntlLocale(EN_US_LOCALE)
      })
      test(',', function () {
        expect(intl.isValidInput(',')).toBe(false)
      })
      test('de 1,', function () {
        expect(intl.isValidInput('1,')).toBe(false)
      })
    })
  })

  describe('formatNumberInput => prettifyNumber', function () {
    describe('en-EN', function () {
      beforeEach(function () {
        setIntlLocale(EN_US_LOCALE)
      })
      test('. => 0.', function () {
        const input = '.'
        const expected = '0.'
        const actual = intl.prettifyNumber(input)
        expect(actual).toBe(expected)
      })
    })
  })

  describe('prettifyNumber', function () {
    describe('en-EN', function () {
      beforeEach(function () {
        setIntlLocale(EN_US_LOCALE)
      })
      test('. => 0.', function () {
        const input = '.'
        const expected = '0.'
        const actual = intl.prettifyNumber(input)
        expect(actual).toBe(expected)
      })
    })
  })
})

describe('Integration with functionality', function () {
  describe('truncateDecimals', function () {
    beforeEach(function () {
      setIntlLocale(EN_US_LOCALE)
    })
    test('', function () {
      const input = '1'
      const precision = 0
      const expected = '1'
      const actual = truncateDecimals(input, precision)
      expect(actual).toBe(expected)
      expect(intl.truncateDecimals(input, precision)).toBe(expected)
    })
    test('1 => 1', function () {
      const input = '1'
      const precision = 8
      const expected = '1'
      const actual = truncateDecimals(input, precision)
      expect(actual).toBe(expected)
      expect(intl.truncateDecimals(input, precision)).toBe(expected)
    })

    test('1.0 => 1', function () {
      const input = '1.0'
      const precision = 1
      const expected = '1.0'
      const actual = truncateDecimals(input, precision)
      expect(actual).toBe(expected)
      expect(intl.truncateDecimals(input, precision)).toBe(expected)
    })

    test('1.123456789 => 1.0', function () {
      const input = '1.123456789'
      const precision = 1
      const expected = '1.1'
      const actual = truncateDecimals(input, precision)
      expect(actual).toBe(expected)
      expect(intl.truncateDecimals(input, precision)).toBe(expected)
    })

    test('1.19 => 1.0', function () {
      const input = '1.19'
      const precision = 1
      const expected = '1.1'
      const actual = truncateDecimals(input, precision)
      expect(actual).toBe(expected)
      expect(intl.truncateDecimals(input, precision)).toBe(expected)
    })

    test('allowBlank=true \'\' => \'\'', function () {
      const input = ''
      const precision = 1
      const expected = ''
      const allowBlank = true
      const actual = truncateDecimals(input, precision, allowBlank)
      expect(actual).toBe(expected)
      expect(intl.truncateDecimals(input, precision, allowBlank)).toBe(expected)
    })
    test('allowBlank=false \'\' => 0', function () {
      const input = ''
      const precision = 1
      const expected = '0'
      const allowBlank = false
      const actual = truncateDecimals(input, precision, allowBlank)
      expect(actual).toBe(expected)
      expect(intl.truncateDecimals(input, precision, allowBlank)).toBe(expected)
    })
  })
})

describe('Integration with default numbers formatting', function () {
  describe('formatNumberInput de_DE', function () {
    beforeEach(function () {
      setIntlLocale(DE_DE_LOCALE)
    })
    test('1. => 1,', function () {
      const input = '1.'
      const expected = '1,'
      const actual = intl.formatNumberInput(input)
      expect(actual).toBe(expected)
    })
  })
  describe('formatNumberInput en_US', function () {
    beforeEach(function () {
      setIntlLocale(EN_US_LOCALE)
    })
    test('Should save zero in decimal: 12.0 => 12.0', function () {
      const input = '12.0'
      const expected = '12.0'
      const actual = intl.formatNumberInput(input)
      expect(actual).toBe(expected)
    })
    test('12.0000 => 12.0000', function () {
      const input = '12.0000'
      const expected = '12.0000'
      const actual = intl.formatNumberInput(input)
      expect(actual).toBe(expected)
    })
  })

  describe('truncateDecimals should be idempotent', function () {
    beforeEach(function () {
      setIntlLocale(EN_US_LOCALE)
    })
    test('0.1 => 0.1', function () {
      const input = '0.1'
      const expected = '0.1'
      const actual = intl.formatNumberInput(intl.formatNumberInput(input))
      expect(actual).toBe(expected)
    })
  })
})

describe('formatNumber', function () {
  describe('en_US', function () {
    beforeEach(function () {
      setIntlLocale(EN_US_LOCALE)
    })
    test('1.2', function () {
      const input = '1.2'
      const expected = '1.2'
      const actual = intl.formatNumber(input)
      expect(actual).toBe(expected)
    })
    test('toFixed option 1.237 => 1.24', function () {
      const input = '1.237'
      const options = {toFixed: 2}
      const expected = '1.24'
      const actual = intl.formatNumber(input, options)
      expect(actual).toBe(expected)
    })
    test('toFixed option 1 => 1.00', function () {
      const input = '1'
      const options = {toFixed: 2}
      const expected = '1.00'
      const actual = intl.formatNumber(input, options)
      expect(actual).toBe(expected)
    })
  })
})
