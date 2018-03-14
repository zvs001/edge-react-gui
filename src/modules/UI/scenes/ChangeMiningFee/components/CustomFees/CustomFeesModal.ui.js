// @flow

import type { EdgeCurrencyWallet } from 'edge-core-js'
import React, { Component } from 'react'
import { View } from 'react-native'

import { FormField } from '../../../../../../components/FormField.js'
import * as Constants from '../../../../../../constants/indexConstants.js'
import s from '../../../../../../locales/strings.js'
import StylizedModal from '../../../../components/Modal/Modal.ui'
import OptionButtons from '../../../../components/OptionButtons/OptionButtons.ui.js'
import OptionIcon from '../../../../components/OptionIcon/OptionIcon.ui'
import styles from './style'

export type CustomFees = {
  [feeSetting: string]: string
}

export type CustomFeesModalStateProps = {
  customFeeSettings: Array<string>,
  customNetworkFee: Object,
  visibilityBoolean: boolean
}
export type CustomFeesModalDispatchProps = {
  onPositive: (customFees: CustomFees) => any,
  onDone: () => any
}
export type CustomFeesModalOwnProps = {
  handlePress: Function,
  sourceWallet: EdgeCurrencyWallet
}

type Props = CustomFeesModalOwnProps & CustomFeesModalDispatchProps & CustomFeesModalStateProps
type State = CustomFees

export default class CustomFeesModal extends Component<Props, State> {
  constructor (props: Props) {
    super(props)
    this.state = {}
  }

  componentWillMount = () => {
    this._initState()
  }

  _onFeeSettingInputChange = feeSetting => (input: string) => {
    let setting = '0'
    if (!isNaN(input) && input !== '') {
      setting = parseInt(input).toString()
    }
    this.setState({ [feeSetting]: setting })
  }

  _initState = () => {
    for (const feeSetting of this.props.customFeeSettings) {
      this.setState({
        [feeSetting]: this.props.customNetworkFee[feeSetting] || '0'
      })
    }
  }

  renderModalMiddle = () =>
    this.props.customFeeSettings.map(feeSetting => (
      <View style={[styles.feeInputWrap]} key={feeSetting}>
        <FormField
          keyboardType="numeric"
          style={[styles.feeInput]}
          onChangeText={this._onFeeSettingInputChange(feeSetting)}
          value={this.state[feeSetting]}
          label={s.strings[feeSetting] || feeSetting}
          autoFocus
        />
      </View>
    ))

  render () {
    const modalMiddle = this.renderModalMiddle()
    const height = 50 + (modalMiddle.length - 1) * 58
    return (
      <StylizedModal
        featuredIcon={<OptionIcon iconName={Constants.CUSTOM_FEES_ICON} />}
        headerText={s.strings.fragment_wallets_set_custom_fees}
        style={styles.modalBoxStyle}
        modalMiddle={modalMiddle}
        modalMiddleStyle={{ height, marginBottom: 10 }}
        modalBottom={
          <OptionButtons
            positiveText={s.strings.string_custom_fee}
            onPositive={() => {
              this.props.handlePress(Constants.CUSTOM_FEES, () => {
                this.props.onPositive(this.state)
              })
            }}
            onNegative={this.props.onDone}
          />
        }
        visibilityBoolean={this.props.visibilityBoolean}
        onExitButtonFxn={this.props.onDone}
      />
    )
  }
}
