import { abs, sub } from 'biggystring'
import React, { Component } from 'react'
import { Keyboard, Linking, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import Picker from 'react-native-picker'
import { sprintf } from 'sprintf-js'

import s from '../../../../locales/strings.js'
import THEME from '../../../../theme/variables/airbitz'
import * as UTILS from '../../../utils'
import { PrimaryButton } from '../../components/Buttons'
import FormattedText from '../../components/FormattedText'
import styles from './style'

const categories = ['income', 'expense', 'exchange', 'transfer']

const pickerValues = []

categories.map(key => {
  return pickerValues.push(s.strings['fragment_transaction_' + key])
})

class AmountArea extends Component {
  constructor (props) {
    super(props)
    this.state = {
      color: ''
    }
    Picker.init({
      pickerData: pickerValues,
      onPickerConfirm: data => {
        const categoryIndex = pickerValues.indexOf(data[0])
        const categoryKey = categories[categoryIndex]
        this.props.onSelectCategory(categoryKey)
        this.Picker.hide()
      },
      onPickerCancel: () => {
        this.Picker.hide()
      },
      pickerTitleText: s.strings.tx_detail_picker_title,
      pickerConfirmBtnText: s.strings.string_confirm,
      pickerCancelBtnText: s.strings.string_cancel_cap,
      pickerFontSize: 22
    })
    this.Picker = Picker
  }

  handleClick = () => {
    Linking.canOpenURL(this.props.txExplorerUrl).then(supported => {
      if (supported) {
        Linking.openURL(this.props.txExplorerUrl)
      } else {
        console.log('Do not know how to open URI: ' + this.props.txExplorerUrl)
      }
    })
  }

  onEnterCategories = () => {
    this.props.onEnterCategories()
    this.Picker.show()
  }

  onPickerSelect = input => {
    this.props.selectCategory(input)
  }

  render () {
    let feeSyntax, leftData, convertedAmount, amountString, symbolString

    const absoluteAmount = abs(this.props.abcTransaction.nativeAmount)

    if (this.props.direction === 'receive') {
      convertedAmount = UTILS.convertNativeToDisplay(this.props.walletDefaultDenomProps.multiplier)(absoluteAmount) // convert to correct denomiation
      amountString = UTILS.decimalOrZero(UTILS.truncateDecimals(convertedAmount, 6), 6) // limit to 6 decimals, check if infinitesimal, and remove unnecessary trailing zeroes
      feeSyntax = ''
      leftData = {
        color: THEME.COLORS.ACCENT_GREEN,
        syntax: s.strings.fragment_transaction_income
      }
    } else {
      // send tx
      if (this.props.abcTransaction.networkFee) {
        // stub, check BTC vs. ETH (parent currency)
        convertedAmount = UTILS.convertNativeToDisplay(this.props.walletDefaultDenomProps.multiplier)(absoluteAmount) // convert the native amount to correct *denomination*
        const convertedFee = UTILS.convertNativeToDisplay(this.props.walletDefaultDenomProps.multiplier)(this.props.abcTransaction.networkFee) // convert fee to correct denomination
        const amountMinusFee = sub(convertedAmount, convertedFee) // for outgoing tx substract fee from total amount
        const amountTruncatedDecimals = UTILS.truncateDecimals(amountMinusFee.toString(), 6) // limit to 6 decimals, at most
        amountString = UTILS.decimalOrZero(amountTruncatedDecimals, 6) // change infinitesimal values to zero, otherwise cut off insignificant zeroes (at end of decimal)
        const feeString = abs(UTILS.truncateDecimals(convertedFee, 6)) // fee should never be negative
        feeSyntax = sprintf(s.strings.fragment_tx_detail_mining_fee, feeString)
        leftData = {
          color: THEME.COLORS.ACCENT_RED,
          syntax: s.strings.fragment_transaction_expense
        }
      } else {
        // do not show fee, because token
        amountString = absoluteAmount
        feeSyntax = ''
        leftData = {
          color: THEME.COLORS.ACCENT_RED,
          syntax: s.strings.fragment_transaction_expense
        }
      }
    }

    let notes = this.props.abcTransaction.metadata ? this.props.abcTransaction.metadata.notes : ''
    if (UTILS.isCryptoParentCurrency(this.props.guiWallet, this.props.abcTransaction.currencyCode)) {
      // if it is the parent crypto
      symbolString = this.props.walletDefaultDenomProps.symbol ? this.props.walletDefaultDenomProps.symbol + ' ' : ''
    } else {
      symbolString = ''
    }

    if (!notes) notes = ''

    return (
      <View style={[styles.amountAreaContainer]}>
        <View style={[styles.amountAreaCryptoRow]}>
          <View style={[styles.amountAreaLeft]}>
            <FormattedText style={[styles.amountAreaLeftText, { color: leftData.color }]}>
              {s.strings['fragment_transaction_' + this.props.direction + '_past']}
            </FormattedText>
          </View>
          <View style={[styles.amountAreaMiddle]}>
            <View style={[styles.amountAreaMiddleTop, { flexDirection: 'row' }]}>
              <FormattedText style={[styles.amountAreaMiddleTopText, styles.symbol]}>{symbolString}</FormattedText>
              <FormattedText style={[styles.amountAreaMiddleTopText]}>{amountString}</FormattedText>
            </View>
            <View style={[styles.amountAreaMiddleBottom]}>
              <FormattedText style={[styles.amountAreaMiddleBottomText]}>{feeSyntax}</FormattedText>
            </View>
          </View>
          <View style={[styles.amountAreaRight]}>
            <FormattedText style={[styles.amountAreaRightText]}>{this.props.cryptoCurrencyCode}</FormattedText>
          </View>
        </View>
        <View style={[styles.editableFiatRow]}>
          <View style={[styles.editableFiatLeft]}>
            <FormattedText style={[styles.editableFiatLeftText]} />
          </View>
          <View style={[styles.editableFiatArea]}>
            <FormattedText style={styles.fiatSymbol}>{this.props.fiatCurrencySymbol}</FormattedText>
            <TextInput
              underlineColorAndroid={'transparent'}
              returnKeyType="done"
              autoCapitalize="none"
              autoCorrect={false}
              onFocus={this.props.onFocusFiatAmount}
              onChangeText={this.props.onChangeFiatFxn}
              style={[styles.editableFiat, UTILS.inputBottomPadding()]}
              keyboardType="numeric"
              placeholder={''}
              value={UTILS.truncateDecimals(this.props.fiatAmount.toString().replace('-', ''), 2, true)}
              defaultValue={''}
              onBlur={this.props.onBlurFiatFxn}
              blurOnSubmit={true}
            />
          </View>
          <View style={[styles.editableFiatRight]}>
            <FormattedText style={[styles.editableFiatRightText]}>{this.props.fiatCurrencyCode}</FormattedText>
          </View>
        </View>
        <View style={[styles.categoryRow]}>
          <TouchableOpacity
            style={[styles.categoryLeft, { borderColor: this.props.color }]}
            onPress={this.onEnterCategories}
            disabled={this.props.subCategorySelectVisibility}
          >
            <FormattedText style={[{ color: this.props.color }, styles.categoryLeftText]}>{this.props.type.syntax}</FormattedText>
          </TouchableOpacity>
          <View style={[styles.categoryInputArea]}>
            <TextInput
              underlineColorAndroid={'transparent'}
              blurOnSubmit
              autoCapitalize="words"
              placeholderTextColor={THEME.COLORS.GRAY_}
              onFocus={this.props.onEnterSubcategories}
              onChangeText={this.props.onChangeSubcategoryFxn}
              onSubmitEditing={this.props.onSubcategoryKeyboardReturn}
              style={[styles.categoryInput, UTILS.inputBottomPadding()]}
              defaultValue={this.props.subCategory || ''}
              placeholder={s.strings.transaction_details_category_title}
              autoCorrect={false}
            />
          </View>
        </View>
        <View style={[styles.notesRow]}>
          <View style={[styles.notesInputWrap]}>
            <TextInput
              underlineColorAndroid={'transparent'}
              onChangeText={this.props.onChangeNotesFxn}
              multiline
              numberOfLines={3}
              defaultValue={notes}
              style={[styles.notesInput, UTILS.inputBottomPadding()]}
              placeholderTextColor={THEME.COLORS.GRAY_}
              placeholder={s.strings.transaction_details_notes_title}
              autoCapitalize="sentences"
              autoCorrect={false}
              onFocus={this.props.onFocusNotes}
              onBlur={this.props.onBlurNotes}
              // onSubmitEditing={this.props.onBlurNotes}
              blurOnSubmit={false}
              onScroll={() => Keyboard.dismiss()}
            />
          </View>
        </View>
        <View style={[styles.footerArea]}>
          <View style={[styles.buttonArea]}>
            <PrimaryButton text={s.strings.string_save} style={[styles.saveButton]} onPressFunction={this.props.onPressFxn} />
          </View>
          {this.props.txExplorerUrl ? (
            <TouchableWithoutFeedback onPress={() => this.handleClick()} style={[styles.advancedTxArea]}>
              <FormattedText style={[styles.advancedTxText]}>{s.strings.transaction_details_view_advanced_data}</FormattedText>
            </TouchableWithoutFeedback>
          ) : null}
        </View>
      </View>
    )
  }
}
export default AmountArea
