// @flow

import type { AbcAccount } from 'edge-login'
import React, { Component } from 'react'
import { Alert, ScrollView, Text, View } from 'react-native'
import { Actions } from 'react-native-router-flux'
import FAIcon from 'react-native-vector-icons/FontAwesome'
import IonIcon from 'react-native-vector-icons/Ionicons'
import SimpleIcon from 'react-native-vector-icons/SimpleLineIcons'

import * as Constants from '../../../../constants/indexConstants'
import s from '../../../../locales/strings'
import { ConfirmPasswordModalStyle } from '../../../../styles/indexStyles'
import { border as b, getTimeWithMeasurement } from '../../../utils'
import { PrimaryButton } from '../../components/Buttons'
import T from '../../components/FormattedText'
import Gradient from '../../components/Gradient/Gradient.ui'
import { Icon } from '../../components/Icon/Icon.ui'
import SafeAreaView from '../../components/SafeAreaView'
import AutoLogoutModal from './components/AutoLogoutModal.ui'
import ConfirmPasswordModal from './components/ConfirmPasswordModal.ui'
import RowModal from './components/RowModal.ui'
import RowRoute from './components/RowRoute.ui'
import RowSwitch from './components/RowSwitch.ui'
import SendLogsModal from './components/SendLogsModal.ui'
import styles from './style'

const DISABLE_TEXT = s.strings.string_disable

type Props = {
  defaultFiat: string,
  autoLogoutTimeInMinutes: number,
  username: string,
  account: AbcAccount,
  pinLoginEnabled: boolean,
  supportsTouchId: boolean,
  touchIdEnabled: boolean,
  lockButton: string,
  lockButtonIcon: string,
  isLocked: boolean,
  confirmPasswordError: string,
  sendLogsStatus: string,
  setAutoLogoutTimeInMinutes(number): void,
  confirmPassword(string): void,
  lockSettings(): void,
  dispatchUpdateEnableTouchIdEnable(boolean, AbcAccount): void,
  sendLogs(string): void,
  resetConfirmPasswordError(Object): void,
  resetSendLogsStatus(): void,
  onTogglePinLoginEnabled(enableLogin: boolean): void
}
type State = {
  showAutoLogoutModal: boolean,
  showSendLogsModal: boolean,
  showConfirmPasswordModal: boolean,
  autoLogoutTimeInMinutes: number
}

export default class SettingsOverview extends Component<Props, State> {
  optionModals: Array<Object>
  currencies: Array<Object>
  options: Object
  constructor (props: Props) {
    super(props)
    this.state = {
      showAutoLogoutModal: false,
      showSendLogsModal: false,
      showConfirmPasswordModal: false,
      autoLogoutTimeInMinutes: props.autoLogoutTimeInMinutes
    }

    const useTouchID = this.props.supportsTouchId
      ? {
        text: s.strings.settings_button_use_touchID,
        key: 'useTouchID',
        routeFunction: this._onToggleTouchIdOption,
        value: this.props.touchIdEnabled
      }
      : null
    if (useTouchID) {
      this.options = { useTouchID }
    } else {
      this.options = {}
    }

    this.optionModals = [
      {
        key: 'autoLogoff',
        text: s.strings.settings_title_auto_logoff
      }
    ]

    this.currencies = []
    for (const currencyKey in Constants.CURRENCY_SETTINGS) {
      const { pluginName } = Constants.CURRENCY_SETTINGS[currencyKey]
      this.currencies.push({
        text: pluginName.charAt(0).toUpperCase() + pluginName.slice(1),
        routeFunction: Actions[currencyKey]
      })
    }
  }
  componentWillReceiveProps (nextProps: Props) {
    if (nextProps.isLocked !== this.props.isLocked && this.state.showConfirmPasswordModal) {
      this.setState({ showConfirmPasswordModal: false })
      this.props.resetConfirmPasswordError({ confirmPasswordError: '' })
    }
  }
  _onPressDummyRouting = () => {}

  unlockSettingsAlert = () => Alert.alert(null, s.strings.settings_alert_unlock, [{ text: s.strings.string_ok }])
  _onPressChangePasswordRouting = () => {
    return this.props.isLocked ? this.unlockSettingsAlert() : Actions[Constants.CHANGE_PASSWORD]()
  }
  _onPressChangePinRouting = () => {
    return this.props.isLocked ? this.unlockSettingsAlert() : Actions[Constants.CHANGE_PIN]()
  }
  _onPressOtp = () => {
    return this.props.isLocked ? this.unlockSettingsAlert() : Actions[Constants.OTP_SETUP]()
  }
  _onPressRecoverPasswordRouting = () => {
    return this.props.isLocked ? this.unlockSettingsAlert() : Actions[Constants.RECOVER_PASSWORD]()
  }

  _onPressOpenLogoffTime = () => {}

  _onPressOpenDefaultCurrency = () => {}

  _onPressOpenChangeCategories = () => {}

  _onToggleTouchIdOption = (bool: boolean) => {
    this.props.dispatchUpdateEnableTouchIdEnable(bool, this.props.account)
    this.options.useTouchID.value = bool
  }

  _onPressDebug = () => {}

  onDoneAutoLogoutModal = (autoLogoutTimeInMinutes: number) => {
    this.setState({
      showAutoLogoutModal: false,
      autoLogoutTimeInMinutes
    })
    this.props.setAutoLogoutTimeInMinutes(autoLogoutTimeInMinutes)
  }

  onCancelAutoLogoutModal = () => {
    this.setState({ showAutoLogoutModal: false })
  }

  onDoneSendLogsModal = (text: string) => {
    this.props.sendLogs(text)
  }

  onCancelSendLogsModal = () => {
    this.setState({ showSendLogsModal: false })
    this.props.resetSendLogsStatus()
  }

  render () {
    const { measurement: autoLogoutMeasurement, value: autoLogoutValue } = getTimeWithMeasurement(this.state.autoLogoutTimeInMinutes)
    const autoLogoutRightText = autoLogoutValue === 0 ? DISABLE_TEXT : `${autoLogoutValue} ${s.strings['settings_' + autoLogoutMeasurement]}`

    return (
      <SafeAreaView>
        <Gradient style={styles.gradient} />
        <ScrollView style={styles.container}>
          <Gradient style={[styles.unlockRow]}>
            <View style={[styles.accountBoxHeaderTextWrap, b('yellow')]}>
              <View style={styles.leftArea}>
                <FAIcon style={[styles.icon, b('green')]} name={Constants.USER_O} />
                <T style={styles.accountBoxHeaderText}>
                  {s.strings.settings_account_title_cap}: {this.props.username}
                </T>
              </View>
            </View>
          </Gradient>
          <RowRoute
            leftText={s.strings[this.props.lockButton]}
            disabled={false}
            routeFunction={this.showConfirmPasswordModal}
            right={<Icon style={styles.settingsLocks} name={this.props.lockButtonIcon} size={24} type={Constants.ION_ICONS} />}
          />
          <RowRoute
            leftText={s.strings.settings_button_change_password}
            disabled={this.props.isLocked}
            routeFunction={this._onPressChangePasswordRouting}
            right={<SimpleIcon style={styles.settingsRowRightArrow} name="arrow-right" />}
          />
          <RowRoute
            leftText={s.strings.settings_button_pin}
            disabled={this.props.isLocked}
            routeFunction={this._onPressChangePinRouting}
            right={<SimpleIcon style={styles.settingsRowRightArrow} name="arrow-right" />}
          />
          <RowRoute
            leftText={s.strings.settings_button_setup_two_factor}
            disabled={this.props.isLocked}
            routeFunction={this._onPressOtp}
            right={<SimpleIcon style={styles.settingsRowRightArrow} name="arrow-right" />}
          />
          <RowRoute
            leftText={s.strings.settings_button_password_recovery}
            disabled={this.props.isLocked}
            routeFunction={this._onPressRecoverPasswordRouting}
            right={<SimpleIcon style={styles.settingsRowRightArrow} name="arrow-right" />}
          />

          <Gradient style={[styles.unlockRow]}>
            <View style={[styles.accountBoxHeaderTextWrap, b('yellow')]}>
              <View style={styles.leftArea}>
                <IonIcon name="ios-options" style={[styles.icon, b('green')]} />
                <T style={styles.accountBoxHeaderText}>{s.strings.settings_options_title_cap}</T>
              </View>
            </View>
          </Gradient>

          <View>
            <RowModal onPress={this.showAutoLogoutModal} leftText={s.strings.settings_title_auto_logoff} rightText={autoLogoutRightText} />

            <RowRoute
              disabled={false}
              leftText={s.strings.settings_title_currency}
              routeFunction={Actions.defaultFiatSetting}
              right={<Text>{this.props.defaultFiat.replace('iso:', '')}</Text>}
            />

            <RowSwitch
              leftText={s.strings.settings_title_pin_login}
              key="pinRelogin"
              onToggle={this.props.onTogglePinLoginEnabled}
              value={this.props.pinLoginEnabled}
            />

            {Object.keys(this.options)
              .filter(optionName => {
                if (!this.options[optionName]) return false
                const { text, key, routeFunction } = this.options[optionName]
                return text && key && routeFunction
              })
              .map(this.renderRowSwitch)}

            {this.currencies.map(this.renderRowRoute)}

            <RowRoute disabled={false} leftText={s.strings.settings_button_send_logs} scene={'changePassword'} routeFunction={this.showSendLogsModal} />

            <View style={[styles.debugArea, b('green')]}>
              <PrimaryButton text={s.strings.settings_button_debug} onPressFunction={this._onPressDebug} />
            </View>

            <View style={styles.emptyBottom} />
          </View>

          <AutoLogoutModal
            autoLogoutTimeInMinutes={this.state.autoLogoutTimeInMinutes}
            showModal={this.state.showAutoLogoutModal}
            onDone={this.onDoneAutoLogoutModal}
            onCancel={this.onCancelAutoLogoutModal}
          />
          <SendLogsModal
            showModal={this.state.showSendLogsModal}
            sendLogsStatus={this.props.sendLogsStatus}
            onDone={this.onDoneSendLogsModal}
            onCancel={this.onCancelSendLogsModal}
          />
          <ConfirmPasswordModal
            style={ConfirmPasswordModalStyle}
            headerText={''}
            error={this.props.confirmPasswordError}
            showModal={this.state.showConfirmPasswordModal}
            onDone={this.confirmPassword}
            onCancel={this.hideConfirmPasswordModal}
          />
        </ScrollView>
      </SafeAreaView>
    )
  }
  confirmPassword = (arg: string) => {
    // this.setState({showConfirmPasswordModal: false})
    this.props.confirmPassword(arg)
  }
  showConfirmPasswordModal = () => {
    if (!this.props.isLocked) {
      this.props.lockSettings()
      return
    }
    this.setState({ showConfirmPasswordModal: true })
  }

  hideConfirmPasswordModal = () => {
    this.props.resetConfirmPasswordError({ confirmPasswordError: '' })
    this.setState({ showConfirmPasswordModal: false })
  }
  showAutoLogoutModal = () => this.setState({ showAutoLogoutModal: true })
  showSendLogsModal = () => this.setState({ showSendLogsModal: true })
  renderRowRoute = (x: Object, i: number) => <RowRoute disabled={false} key={i} leftText={x.text} routeFunction={x.routeFunction} right={x.right} />
  renderRowSwitch = (x: string) => (
    <RowSwitch
      leftText={this.options[x] ? this.options[x].text : ''}
      key={this.options[x] ? this.options[x].key : ''}
      property={this.options[x] ? this.options[x].key : ''}
      onToggle={this.options[x] ? this.options[x].routeFunction : () => {}}
      value={this.options[x] ? this.options[x].value : false}
    />
  )
  renderRowModal = (x: Object) => <RowModal leftText={x.text} key={x.key} modal={x.key.toString()} />
}
