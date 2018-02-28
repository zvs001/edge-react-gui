// @flow

import { StyleSheet } from 'react-native'

import THEME from '../theme/variables/airbitz.js'

export const stylesRaw = {
  mainMenuContext: {
    flex: 1
  },
  titleStyle: {
    alignSelf: 'center',
    fontSize: 20,
    color: THEME.COLORS.WHITE,
    fontFamily: THEME.FONTS.DEFAULT
  },
  helpModal: {
    flex: 1
  },
  footerTabStyles: {
    height: THEME.FOOTER_TABS_HEIGHT
  }
}

export const styles = StyleSheet.create(stylesRaw)
