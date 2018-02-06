// @flow

import React, { Component } from 'react'
import { View, Image, WebView, Text, Linking, Platform } from 'react-native'
import DeviceInfo from 'react-native-device-info'

import s from '../../../../locales/strings.js'
import styles from './style.js'
import StylizedModal from '../Modal/index.js'
import THEME from '../../../../theme/variables/airbitz.js'
import helpImage from '../../../../assets/images/modal/help.png'

const buildNumber = DeviceInfo.getBuildNumber()
const versionNumber = DeviceInfo.getVersion()
const CONTENT_URI = 'https://edgesecure.co/info.html'
const contentScaling = Platform.OS !== 'ios'

type Props = {
  modal: any,
  closeModal: () => void
}
type State = {}

export default class HelpModal extends Component<Props, State> {
  render () {
    return (
      <StylizedModal
        visibilityBoolean={this.props.modal}
        onExitButtonFxn={this.props.closeModal}
        headerText={s.strings.help_modal_title}
        modalMiddle={<WebView
          // $FlowFixMe
          ref={(ref) => { this.webview = ref }}
          scalesPageToFit={contentScaling}
          style={styles.webView}
          source={{uri: CONTENT_URI}}
          onNavigationStateChange={(event) => {
            if (!event.url.includes('info.html')) {
              // if NOT initial URL
              // $FlowFixMe
              this.webview.stopLoading() // do not load in WebView
              Linking.openURL(event.url) // load externally
              this.props.closeModal()
            }
          }}
        />}
        style={styles.stylizedModal}
        modalHeaderIcon={styles.modalHeaderIcon}
        modalBodyStyle={styles.modalBodyStyle}
        modalVisibleStyle={styles.modalVisibleStyle}
        modalBoxStyle={styles.modalBoxStyle}
        modalContentStyle={styles.modalContentStyle}
        modalMiddleStyle={styles.modalMiddleWebView}
        modalBottom={
          <View style={[styles.modalBottomContainer]}>
            <Text style={styles.modalBottomText}>
              {s.strings.help_version} {versionNumber}
            </Text>
            <Text style={styles.modalBottomText}>
              {s.strings.help_build} {buildNumber}
            </Text>
          </View>
        }
        featuredIcon={<Image source={helpImage} color={THEME.COLORS.SECONDARY} size={20} />}
      />
    )
  }
}
