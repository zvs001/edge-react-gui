// @flow
import React, { Component } from 'react'
import { TouchableHighlight, View } from 'react-native'
import Ionicon from 'react-native-vector-icons/Ionicons'

import * as Constants from '../../../../../constants/indexConstants'
import s from '../../../../../locales/strings.js'
import THEME from '../../../../../theme/variables/airbitz'
import { border as b } from '../../../../utils'
import T from '../../../components/FormattedText'
import styles from '../style'

export default class WalletListModalHeader extends Component<any> {
  onSearchExit = this.props.disableWalletListModalVisibility

  render () {
    const whichMessage = this.props.whichWallet === Constants.FROM ? 'fragment_excahnge_wallet_from_header_title' : 'fragment_excahnge_wallet_to_header_title'
    const headerSyntax =
      this.props.type === Constants.FROM
        ? 'fragment_select_wallet_header_title'
        : this.props.type === Constants.CRYPTO_EXCHANGE ? whichMessage : 'fragment_send_other_wallet_header_title'
    return (
      <View style={[styles.rowContainer, styles.headerContainer]}>
        <View style={[styles.headerContent, b()]}>
          <View style={[styles.headerTextWrap, b()]}>
            <T style={[styles.headerText, { color: THEME.COLORS.WHITE }, b()]}>{s.strings[headerSyntax]}</T>
          </View>

          <TouchableHighlight style={[styles.modalCloseWrap, b()]} onPress={this.onSearchExit}>
            <Ionicon style={[styles.donebutton, b()]} name="ios-close" size={26} color={THEME.COLORS.WHITE} />
          </TouchableHighlight>
        </View>
      </View>
    )
  }
}
