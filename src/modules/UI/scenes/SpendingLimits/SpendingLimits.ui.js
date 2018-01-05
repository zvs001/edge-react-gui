// @flow

import React, {Component} from 'react'
import {View} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import Gradient from '../../components/Gradient/Gradient.ui'
import styles, {stylesRaw} from './styles'

import {PrimaryButton}  from '../../components/Buttons'
import RowSwitch from '../Settings/components/RowSwitch.ui'
import T from '../../components/FormattedText/FormattedText.ui'
import {FormField} from '../../../../components/FormField.js'
import s from '../../../../locales/strings.js'

const PER_DAY_SPENDING_LIMITS_TEXT             = s.strings.per_day_spending_limit
const PER_DAY_SPENDING_LIMITS_DESCRIPTION_TEXT = s.strings.per_day_spending_limit_description
const PER_TRANSACTION_SPENDING_LIMITS_TEXT     = s.strings.per_transaction_spending_limit
const PER_TRANSACTION_SPENDING_LIMITS_DESCRIPTION_TEXT = s.strings.per_transaction_spending_limit_description
const ENTER_YOUR_PASSWORD_TEXT                 = s.strings.enter_your_password

import THEME from '../../../../theme/variables/airbitz'

type Props = {
  pluginName: string,
  currencyCode: string,
  dailySpendingLimitNativeAmount: string,
  isDailySpendingLimitEnabled: boolean,
  transactionSpendingLimitNativeAmount: string,
  isTransactionSpendingLimitEnabled: boolean,
  updateDailySpendingLimit: (currencyCode: string, isEnabled: boolean, dailySpendingLimit: string) => void,
  updateTransactionSpendingLimit: (currencyCode: string, isEnabled: boolean, dailySpendingLimit: string) => void
}
type State = {
  isTransactionSpendingLimitEnabled: boolean,
  transactionSpendingLimitNativeAmount: string,
  dailySpendingLimitNativeAmount: string,
  isDailySpendingLimitEnabled: boolean
}
export default class SpendingLimits extends Component<Props, State> {
  constructor (props: Props) {
    super(props)
    this.state = {
      isTransactionSpendingLimitEnabled: props.isTransactionSpendingLimitEnabled,
      transactionSpendingLimitNativeAmount: props.transactionSpendingLimitNativeAmount,
      dailySpendingLimitNativeAmount: props.dailySpendingLimitNativeAmount,
      isDailySpendingLimitEnabled: props.isDailySpendingLimitEnabled
    }
  }

  render () {
    return <View>
      <Gradient style={styles.gradient}/>
      <KeyboardAwareScrollView>

      <T key={1} style={styles.header}>
        {`Set Spending Limits for ${s.strings[this.props.pluginName]}`}
      </T>

      <View style={styles.form}>
        <View style={styles.formSection}>
          <FormField
            style={{borderWidth: 0, marginTop: 0, paddingTop: 0}}
            returnKeyType={'done'}
            label={ENTER_YOUR_PASSWORD_TEXT}
            autoCorrect={false}
            autoFocus={false} />
        </View>

        <View style={styles.formSection}>
          {this.renderDailySpendingLimitRow()}
          <FormField
            onChangeText={this.updateDailySpendingLimitNativeAmount}
            value={this.state.dailySpendingLimitNativeAmount || ''}
            returnKeyType={'done'}
            keyboardType={'numeric'}
            autoCorrect={false}
            label={PER_DAY_SPENDING_LIMITS_TEXT} />
        </View>

        <View style={styles.formSection}>
          {this.renderTxSpendingLimitRow()}
          <FormField
            onChangeText={this.updateTransactionSpendingLimitNativeAmount}
            value={this.state.transactionSpendingLimitNativeAmount || ''}
            returnKeyType={'done'}
            autoCorrect={false}
            keyboardType={'numeric'}
            label={PER_TRANSACTION_SPENDING_LIMITS_TEXT} />
        </View>
      </View>

      <PrimaryButton text={'Save'} style={styles.submitButton} />
    </KeyboardAwareScrollView>
  </View>
  }

  renderDailySpendingLimitRow () {
    const left = <View>
      <T key={1} style={{fontSize: 16, color: THEME.COLORS.GRAY_1, marginLeft: -18}}>{PER_DAY_SPENDING_LIMITS_TEXT}</T>
      <T key={2} style={{fontSize: 14, color: THEME.COLORS.GRAY_1, marginLeft: -18}}>{PER_DAY_SPENDING_LIMITS_DESCRIPTION_TEXT}</T>
    </View>

    return <RowSwitch style={stylesRaw.rowSwitch}
      onToggle={this.updateIsDailySpendingLimitEnabled} value={this.state.isDailySpendingLimitEnabled} leftText={left} />
  }

  renderTxSpendingLimitRow () {
    const left = <View>
      <T key={1} style={{fontSize: 16, color: THEME.COLORS.GRAY_1, marginLeft: -18}}>{PER_TRANSACTION_SPENDING_LIMITS_TEXT}</T>
      <T key={2} style={{fontSize: 14, color: THEME.COLORS.GRAY_1, marginLeft: -18}}>{PER_TRANSACTION_SPENDING_LIMITS_DESCRIPTION_TEXT}</T>
    </View>

    return <RowSwitch style={stylesRaw.rowSwitch}
      onToggle={this.updateIsTransactionSpendingLimitEnabled}
      value={this.state.isTransactionSpendingLimitEnabled} leftText={left} />
  }

  updateIsTransactionSpendingLimitEnabled = (isEnabled: boolean) => {
    return this.setState({isTransactionSpendingLimitEnabled: isEnabled})
  }

  updateTransactionSpendingLimitNativeAmount = (transactionSpendingLimitNativeAmount: string) => {
    return this.setState({transactionSpendingLimitNativeAmount})
  }

  updateIsDailySpendingLimitEnabled = (isEnabled: boolean) => {
    return this.setState({isDailySpendingLimitEnabled: isEnabled})
  }

  updateDailySpendingLimitNativeAmount = (dailySpendingLimitNativeAmount: string) => {
    return this.setState({dailySpendingLimitNativeAmount})
  }

  onSubmit = () => {
    console.log('onSubmit')
    console.log('dailySpendingLimitNativeAmount', this.state.dailySpendingLimitNativeAmount)
    console.log('isDdailySpendingLimitEnabled', this.state.isDailySpendingLimitEnabled)
    console.log('transactionSpendingLimitNativeAmount', this.state.transactionSpendingLimitNativeAmount)
    console.log('isTransactionSpendingLimitEnabled', this.state.isTransactionSpendingLimitEnabled)
  }
}
