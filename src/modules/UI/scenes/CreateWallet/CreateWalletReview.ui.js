// @flow

import React, { Component } from 'react'
import { ActivityIndicator, Keyboard, View } from 'react-native'
import { Actions } from 'react-native-router-flux'

import s from '../../../../locales/strings.js'
import type { GuiFiatType, GuiWalletType } from '../../../../types'
import { fixFiatCurrencyCode } from '../../../utils'
import { PrimaryButton, SecondaryButton } from '../../components/Buttons'
import Text from '../../components/FormattedText'
import Gradient from '../../components/Gradient/Gradient.ui'
import SafeAreaView from '../../components/SafeAreaView'
import styles from './style.js'

export type CreateWalletReviewOwnProps = {
  walletName: string,
  selectedFiat: GuiFiatType,
  selectedWalletType: GuiWalletType,
  isCreatingWallet: boolean,
  supportedWalletTypes: Array<GuiWalletType>,
  supportedFiats: Array<GuiFiatType>
}

export type CreateWalletReviewDispatchProps = {
  createCurrencyWallet: (walletName: string, walletType: string, fiatCurrencyCode: string) => void
}

export type CreateWalletReviewProps = CreateWalletReviewOwnProps & CreateWalletReviewDispatchProps

export class CreateWalletReview extends Component<CreateWalletReviewProps> {
  componentDidMount () {
    Keyboard.dismiss()
  }

  onSubmit = () => {
    const { walletName, selectedWalletType, selectedFiat } = this.props
    this.props.createCurrencyWallet(walletName, selectedWalletType.value, fixFiatCurrencyCode(selectedFiat.value))
  }

  onBack = () => {
    Actions.pop()
  }

  render () {
    const { isCreatingWallet } = this.props
    return (
      <SafeAreaView>
        <View style={styles.scene}>
          <Gradient style={styles.gradient} />
          <View style={styles.view}>
            <View style={styles.instructionalArea}>
              <Text style={styles.instructionalText}>{s.strings.create_wallet_top_instructions}</Text>
            </View>
            <View style={styles.reviewArea}>
              <Text style={styles.reviewAreaText}>
                {s.strings.create_wallet_crypto_type_label} {this.props.selectedWalletType.label} - {this.props.selectedWalletType.currencyCode}
              </Text>
              <Text style={styles.reviewAreaText}>
                {s.strings.create_wallet_fiat_type_label} {this.props.selectedFiat.label}
              </Text>
              <Text style={styles.reviewAreaText}>
                {s.strings.create_wallet_name_label} {this.props.walletName}
              </Text>
            </View>
            <View style={[styles.buttons]}>
              <SecondaryButton style={[styles.cancel]} onPressFunction={this.onBack} text={s.strings.title_back} />

              <PrimaryButton
                onPressFunction={this.onSubmit}
                text={s.strings.fragment_create_wallet_create_wallet}
                processingFlag={isCreatingWallet}
                processingElement={<ActivityIndicator />}
              />
            </View>
          </View>
        </View>
      </SafeAreaView>
    )
  }
}
