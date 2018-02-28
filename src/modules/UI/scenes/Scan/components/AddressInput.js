import React, { Component } from 'react'
import { View } from 'react-native'

import { FormField } from '../../../../../components/FormField.js'
import s from '../../../../../locales/strings.js'
import { TertiaryButton } from '../../../components/Buttons'
import styles from '../style.js'

export class AddressInput extends Component {
  // this component is for the input area of the Recipient Address Modal
  render () {
    return (
      <View>
        <View style={[styles.addressInputWrap]}>
          <FormField
            style={[styles.addressInput]}
            value={this.props.uri}
            onChangeText={this.props.onChangeText}
            autoCapitalize={'none'}
            autoFocus
            label={s.strings.fragment_send_send_to_hint}
            returnKeyType={'done'}
            autoCorrect={false}
            onSubmitEditing={this.props.onSubmit}
          />
        </View>
        {this.props.copyMessage && (
          <View style={styles.pasteButtonRow}>
            <TertiaryButton text={this.props.copyMessage} ellipsizeMode={'middle'} onPressFunction={this.props.onPaste} numberOfLines={1} />
          </View>
        )}
      </View>
    )
  }
}
