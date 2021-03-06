import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  View,
  TouchableHighlight
} from 'react-native'
import {Actions} from 'react-native-router-flux'
import styles, {styles as styleRaw} from '../../style'

import T from '../../../../components/FormattedText'

import * as UTILS from '../../../../../utils'

export default class WalletListTokenRow extends Component {
  selectWallet = () => {
    const {parentId: walletId, currencyCode} = this.props
    this.props.selectWallet(walletId, currencyCode)
    Actions.transactionList({params: 'walletList'})
  }

  render () {
    return (
      <TouchableHighlight style={[
        styles.tokenRowContainer,
        (this.props.active && styles.activeOpacity)
      ]}
        underlayColor={styleRaw.tokenRowUnderlay.color}
        delayLongPress={500}
        onPress={this.selectWallet}
        {...this.props.sortHandlers}>

        <View style={[styles.tokenRowContent]}>
          <View style={[styles.tokenRowNameTextWrap]}>
            <T style={[styles.tokenRowText]}>
              {this.props.currencyCode}
            </T>
          </View>

          <View style={[styles.tokenRowBalanceTextWrap]}>
            <T style={[styles.tokenRowText]}>
              {UTILS.convertNativeToDisplay(this.props.displayDenomination.multiplier)(this.props.balance) || '0'}
            </T>
          </View>
        </View>

      </TouchableHighlight>
    )
  }
}

WalletListTokenRow.propTypes = {
  currencyCode: PropTypes.string,
  balance: PropTypes.string
}
