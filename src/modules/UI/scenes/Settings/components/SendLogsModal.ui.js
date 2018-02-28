import React, { Component } from 'react'
import { ActivityIndicator } from 'react-native'
import IonIcon from 'react-native-vector-icons/Ionicons'

import * as Constants from '../../../../../../src/constants/indexConstants'
import { FormField } from '../../../../../components/FormField.js'
import s from '../../../../../locales/strings.js'
import THEME, { colors } from '../../../../../theme/variables/airbitz'
import { PrimaryButton } from '../../../components/Buttons'
import StylizedModal from '../../../components/Modal/Modal.ui'
import ModalButtons from './ModalButtons.ui'
import styles from './styles'

export default class SendLogsModal extends Component {
  state = {
    text: ''
  }

  onDone = () => {
    this.props.onDone(this.state.text)
    this.setState({ text: '' })
  }

  onCancel = () => {
    this.props.onCancel()
    this.setState({ text: '' })
  }

  onChangeText = text => {
    this.setState({ text })
  }

  getModalHeaderText = () => {
    const status = this.props.sendLogsStatus
    const { SUCCESS, FAILURE, PENDING, LOADING } = Constants.REQUEST_STATUS

    switch (status) {
      case SUCCESS:
        return s.strings.settings_modal_send_logs_success
      case FAILURE:
        return s.strings.settings_modal_send_logs_failure
      case PENDING:
        return s.strings.settings_modal_send_logs_title
      case LOADING:
        return s.strings.settings_modal_send_logs_loading
      default:
        return null
    }
  }

  getModalMiddle = () => {
    const status = this.props.sendLogsStatus
    const { PENDING, LOADING } = Constants.REQUEST_STATUS

    switch (status) {
      case PENDING:
        return (
          <FormField style={styles.sendLogsModalInput} label="Type some text" value={this.state.text} onChangeText={this.onChangeText} returnKeyType="done" />
        )
      case LOADING:
        return <ActivityIndicator />
      default:
        return null
    }
  }

  getModalBotton = () => {
    const status = this.props.sendLogsStatus
    const { SUCCESS, FAILURE, PENDING } = Constants.REQUEST_STATUS

    switch (status) {
      case SUCCESS:
        return <PrimaryButton text={s.strings.string_ok} onPressFunction={this.onCancel} />
      case FAILURE:
        return <PrimaryButton text={s.strings.string_ok} onPressFunction={this.onCancel} />
      case PENDING:
        return <ModalButtons onDone={this.onDone} onCancel={this.onCancel} />
      default:
        return null
    }
  }

  render () {
    const icon = (
      <IonIcon
        name="ios-paper-plane-outline"
        size={24}
        color={colors.primary}
        style={[
          {
            backgroundColor: THEME.COLORS.TRANSPARENT,
            zIndex: 1015,
            elevation: 1015
          }
        ]}
      />
    )

    return (
      <StylizedModal
        visibilityBoolean={this.props.showModal}
        featuredIcon={icon}
        headerText={this.getModalHeaderText()}
        modalMiddle={this.getModalMiddle()}
        modalBottom={this.getModalBotton()}
        onExitButtonFxn={this.onCancel}
      />
    )
  }
}
