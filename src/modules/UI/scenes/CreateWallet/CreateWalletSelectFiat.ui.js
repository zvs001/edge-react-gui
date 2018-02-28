// @flow

import React, { Component } from 'react'
import { Alert, TouchableHighlight, View } from 'react-native'
import { Actions } from 'react-native-router-flux'

import { FormField } from '../../../../components/FormField.js'
import * as Constants from '../../../../constants/indexConstants.js'
import s from '../../../../locales/strings.js'
import type { DeviceDimensions, FlatListItem, GuiFiatType } from '../../../../types'
import * as UTILS from '../../../utils'
import Text from '../../components/FormattedText'
import Gradient from '../../components/Gradient/Gradient.ui.js'
import SafeAreaView from '../../components/SafeAreaView'
import SearchResults from '../../components/SearchResults'
import styles, { styles as stylesRaw } from './style.js'

export type CreateWalletSelectFiatOwnProps = {
  selectedWalletType: string,
  supportedFiats: Array<GuiFiatType>,
  dimensions: DeviceDimensions
}

type State = {
  searchTerm: string,
  selectedFiat: string
}

export type CreateWalletSelectFiatStateProps = {
  dimensions: DeviceDimensions,
  supportedFiats: Array<GuiFiatType>
}

export type CreateWalletSelectFiatProps = CreateWalletSelectFiatOwnProps & CreateWalletSelectFiatStateProps

export class CreateWalletSelectFiat extends Component<CreateWalletSelectFiatProps, State> {
  constructor (props: CreateWalletSelectFiatProps & State) {
    super(props)
    this.state = {
      searchTerm: '',
      selectedFiat: ''
    }
  }

  isValidFiatType = (): boolean => {
    const { selectedFiat } = this.state
    const fiatTypeIndex = this.props.supportedFiats.findIndex(fiatType => fiatType.value === selectedFiat)
    const isValid = fiatTypeIndex >= 0
    return isValid
  }

  getFiatType = (fiatKey: string): GuiFiatType => {
    const fiatTypeIndex = this.props.supportedFiats.findIndex(fiatType => fiatType.value === fiatKey)

    return this.props.supportedFiats[fiatTypeIndex]
  }

  onNext = (): void => {
    if (this.isValidFiatType()) {
      Actions[Constants.CREATE_WALLET_NAME]({
        selectedWalletType: this.props.selectedWalletType,
        selectedFiat: this.getFiatType(this.state.selectedFiat)
      })
    } else {
      Alert.alert(s.strings.create_wallet_invalid_input, s.strings.create_wallet_select_valid_fiat)
    }
  }

  handleSearchTermChange = (searchTerm: string): void => {
    this.setState({
      searchTerm
    })
  }

  handleSelectFiatType = (item: GuiFiatType): void => {
    const selectedFiat = this.props.supportedFiats.find(type => type.value === item.value)

    if (selectedFiat) {
      this.setState(
        {
          selectedFiat: selectedFiat.value,
          searchTerm: selectedFiat.label
        },
        this.onNext
      )
    }
  }

  handleOnFocus = (): void => {
    UTILS.noOp()
  }

  handleOnBlur = (): void => {
    UTILS.noOp()
  }

  render () {
    const filteredArray = this.props.supportedFiats.filter(entry => {
      return entry.label.toLowerCase().indexOf(this.state.searchTerm.toLowerCase()) >= 0
    })
    const keyboardHeight = this.props.dimensions.keyboardHeight || 0
    const searchResultsHeight = stylesRaw.usableHeight - keyboardHeight - 36 // substract button area height and FormField height
    return (
      <SafeAreaView>
        <View style={styles.scene}>
          <Gradient style={styles.gradient} />
          <View style={styles.view}>
            <FormField
              style={styles.picker}
              autoFocus
              clearButtonMode={'while-editing'}
              onFocus={this.handleOnFocus}
              onBlur={this.handleOnBlur}
              autoCorrect={false}
              autoCapitalize={'words'}
              onChangeText={this.handleSearchTermChange}
              value={this.state.searchTerm}
              label={s.strings.fragment_wallets_addwallet_fiat_hint}
              returnKeyType={'search'}
            />
            <SearchResults
              renderRegularResultFxn={this.renderFiatTypeResult}
              onRegularSelectFxn={this.handleSelectFiatType}
              regularArray={filteredArray}
              style={[styles.SearchResults]}
              containerStyle={[styles.searchContainer, { height: searchResultsHeight }]}
              keyExtractor={this.keyExtractor}
              initialNumToRender={30}
              scrollRenderAheadDistance={1600}
            />
          </View>
        </View>
      </SafeAreaView>
    )
  }

  renderFiatTypeResult = (data: FlatListItem, onRegularSelect: Function) => {
    return (
      <View style={[styles.singleCryptoTypeWrap, data.item.value === this.state.selectedFiat && styles.selectedItem]}>
        <TouchableHighlight style={[styles.singleCryptoType]} onPress={() => onRegularSelect(data.item)} underlayColor={stylesRaw.underlayColor.color}>
          <View style={[styles.cryptoTypeInfoWrap]}>
            <View style={styles.cryptoTypeLeft}>
              <View style={[styles.cryptoTypeLeftTextWrap]}>
                <Text style={[styles.cryptoTypeName]}>{data.item.label}</Text>
              </View>
            </View>
          </View>
        </TouchableHighlight>
      </View>
    )
  }

  keyExtractor = (item: GuiFiatType, index: string) => index
}
