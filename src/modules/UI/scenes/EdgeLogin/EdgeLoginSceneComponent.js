import type { AbcLobby } from 'edge-login'
// @flow
import React, { Component } from 'react'
import { ActivityIndicator, Image, Text, View } from 'react-native'

import s from '../../../../locales/strings.js'
import { PrimaryButton, SecondaryButton } from '../../components/Buttons/index'
import Gradient from '../../components/Gradient/Gradient.ui'
import SafeAreaView from '../../components/SafeAreaView'

type EdgeLoginSceneProps = {
  style: Object,
  lobby?: AbcLobby,
  error?: string,
  isProcessing: boolean,
  accept(): void,
  decline(): void
}

export default class EdgeLoginScene extends Component<EdgeLoginSceneProps> {
  renderBody (style: Object) {
    let message = this.props.error
    if (!this.props.error) {
      message = s.strings.edge_description
    }
    return (
      <View style={style.body}>
        <Text style={style.bodyText}>{message}</Text>
      </View>
    )
  }
  renderButtons (style: Object) {
    if (this.props.isProcessing) {
      return (
        <View style={style.buttonsProcessing}>
          <ActivityIndicator />
        </View>
      )
    }
    if (this.props.error) {
      return (
        <View style={style.buttonContainer}>
          <View style={style.buttons}>
            <SecondaryButton style={style.cancelSolo} onPressFunction={this.props.decline} text={s.strings.string_cancel_cap} />
          </View>
        </View>
      )
    }
    return (
      <View style={style.buttonContainer}>
        <View style={style.buttons}>
          <SecondaryButton style={style.cancel} onPressFunction={this.props.decline} text={s.strings.string_cancel_cap} />
          <PrimaryButton style={style.submit} onPressFunction={this.props.accept} text={s.strings.accept_button_text} />
        </View>
      </View>
    )
  }
  renderImage (style: Object) {
    if (this.props.lobby && this.props.lobby.loginRequest && this.props.lobby.loginRequest.displayImageUrl) {
      return <Image style={style.image} resizeMode={'contain'} source={{ uri: this.props.lobby.loginRequest.displayImageUrl }} />
    }
    return null
  }
  renderHeader (style: Object) {
    let title = ''
    if (this.props.lobby && this.props.lobby.loginRequest) {
      title = this.props.lobby.loginRequest.displayName ? this.props.lobby.loginRequest.displayName : ''
    }
    if (this.props.lobby) {
      return (
        <View style={style.header}>
          <View style={style.headerTopShim} />
          <View style={style.headerImageContainer}>{this.renderImage(style)}</View>
          <View style={style.headerTopShim} />
          <View style={style.headerTextRow}>
            <Text style={style.bodyText}>{title}</Text>
          </View>
          <View style={style.headerBottomShim} />
        </View>
      )
    }
    return <View style={style.header} />
  }
  render () {
    const Style = this.props.style
    if (!this.props.lobby && !this.props.error) {
      return (
        <View style={Style.spinnerContainer}>
          <ActivityIndicator />
        </View>
      )
    }
    return (
      <SafeAreaView>
        <Gradient style={Style.gradient} />
        <View style={Style.container}>
          {this.renderHeader(Style)}
          {this.renderBody(Style)}
          {this.renderButtons(Style)}
        </View>
      </SafeAreaView>
    )
  }
}
