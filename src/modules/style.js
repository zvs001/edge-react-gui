// @flow

import {StyleSheet} from 'react-native'

import THEME from '../theme/variables/airbitz.js'

export const stylesRaw = {
  main: {
    backgroundColor: THEME.COLORS.WHITE
  },
  titleStyle: {
    alignSelf: 'center',
    fontSize: 24,
    color: THEME.COLORS.WHITE,
    fontFamily: THEME.FONTS.DEFAULT,
  }
}

export const styles = StyleSheet.create(stylesRaw)
