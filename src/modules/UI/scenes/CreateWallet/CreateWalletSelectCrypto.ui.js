// @flow

import React, { Component } from 'react'
import { Alert, Image, Keyboard, TouchableHighlight, View } from 'react-native'
import { Actions } from 'react-native-router-flux'

import { FormField } from '../../../../components/FormField.js'
import * as Constants from '../../../../constants/indexConstants.js'
import s from '../../../../locales/strings.js'
import type { DeviceDimensions, FlatListItem, GuiWalletType } from '../../../../types'
import * as UTILS from '../../../utils'
import Text from '../../components/FormattedText'
import Gradient from '../../components/Gradient/Gradient.ui'
import SafeAreaView from '../../components/SafeAreaView'
import SearchResults from '../../components/SearchResults'
import styles, { styles as stylesRaw } from './style.js'

export type CreateWalletSelectCryptoOwnProps = {
  dimensions: DeviceDimensions,
  supportedWalletTypes: Array<GuiWalletType>
}
export type CreateWalletSelectCryptoStateProps = {
  supportedWalletTypes: Array<GuiWalletType>,
  dimensions: DeviceDimensions
}
type Props = CreateWalletSelectCryptoOwnProps & CreateWalletSelectCryptoStateProps
type State = {
  selectedWalletType: string,
  searchTerm: string
}

export class CreateWalletSelectCrypto extends Component<Props, State> {
  constructor (props: Props) {
    super(props)
    this.state = {
      selectedWalletType: '',
      searchTerm: ''
    }
  }

  isValidWalletType = () => {
    const { selectedWalletType } = this.state
    const { supportedWalletTypes } = this.props
    const walletTypeValue = supportedWalletTypes.findIndex(walletType => walletType.value === selectedWalletType)

    const isValid: boolean = walletTypeValue >= 0
    return isValid
  }

  getWalletType = (walletTypeValue: string): GuiWalletType => {
    const { supportedWalletTypes } = this.props
    const foundValueIndex = supportedWalletTypes.findIndex(walletType => walletType.value === walletTypeValue)
    const foundValue = supportedWalletTypes[foundValueIndex]

    return foundValue
  }

  onNext = () => {
    if (this.isValidWalletType()) {
      Actions[Constants.CREATE_WALLET_SELECT_FIAT]({
        selectedWalletType: this.getWalletType(this.state.selectedWalletType)
      })
    } else {
      Alert.alert(s.strings.create_wallet_invalid_input, s.strings.create_wallet_select_valid_crypto)
    }
  }

  onBack = () => {
    Keyboard.dismiss()
    Actions.pop() // redirect to the list of wallets
  }

  handleSearchTermChange = (searchTerm: string): void => {
    this.setState({
      searchTerm
    })
  }

  handleSelectWalletType = (item: GuiWalletType): void => {
    const selectedWalletType = this.props.supportedWalletTypes.find(type => type.value === item.value)
    if (selectedWalletType) {
      this.setState(
        {
          selectedWalletType: selectedWalletType.value,
          searchTerm: selectedWalletType.label
        },
        this.onNext
      )
    }
  }

  handleOnFocus = () => {
    UTILS.noOp()
  }

  handleOnBlur = () => {
    UTILS.noOp()
  }

  render () {
    const filteredArray = this.props.supportedWalletTypes.filter(entry => {
      return (
        entry.label.toLowerCase().indexOf(this.state.searchTerm.toLowerCase()) >= 0 ||
        entry.currencyCode.toLowerCase().indexOf(this.state.searchTerm.toLowerCase()) >= 0
      )
    })
    const keyboardHeight = this.props.dimensions.keyboardHeight || 0
    const searchResultsHeight = stylesRaw.usableHeight - keyboardHeight - 36 // substract button area height and FormField height
    return (
      <SafeAreaView>
        <View style={styles.scene}>
          <Gradient style={styles.gradient} />
          <View style={styles.view}>
            <FormField
              autoFocus
              style={styles.picker}
              clearButtonMode={'while-editing'}
              onFocus={this.handleOnFocus}
              onBlur={this.handleOnBlur}
              autoCorrect={false}
              autoCapitalize={'words'}
              onChangeText={this.handleSearchTermChange}
              value={this.state.searchTerm}
              label={s.strings.create_wallet_choose_crypto}
              returnKeyType={'search'}
            />
            <SearchResults
              renderRegularResultFxn={this.renderWalletTypeResult}
              onRegularSelectFxn={this.handleSelectWalletType}
              regularArray={filteredArray}
              style={[styles.SearchResults]}
              containerStyle={[styles.searchContainer, { height: searchResultsHeight }]}
              keyExtractor={this.keyExtractor}
            />
          </View>
        </View>
      </SafeAreaView>
    )
  }

  renderWalletTypeResult = (data: FlatListItem, onRegularSelect: Function) => {
    return (
      <View style={[styles.singleCryptoTypeWrap, data.item.value === this.state.selectedWalletType && styles.selectedItem]}>
        <TouchableHighlight style={[styles.singleCryptoType]} onPress={() => onRegularSelect(data.item)} underlayColor={stylesRaw.underlayColor.color}>
          <View style={[styles.cryptoTypeInfoWrap]}>
            <View style={styles.cryptoTypeLeft}>
              <View style={[styles.cryptoTypeLogo]}>
                {data.item.symbolImageDarkMono ? (
                  <Image source={{ uri: data.item.symbolImageDarkMono }} style={[styles.cryptoTypeLogo, { borderRadius: 20 }]} />
                ) : (
                  <View style={styles.cryptoTypeLogo} />
                )}
              </View>
              <View style={[styles.cryptoTypeLeftTextWrap]}>
                <Text style={[styles.cryptoTypeName]}>
                  {data.item.label} - {data.item.currencyCode}
                </Text>
              </View>
            </View>
          </View>
        </TouchableHighlight>
      </View>
    )
  }

  keyExtractor = (item: GuiWalletType, index: number): number => index
}
