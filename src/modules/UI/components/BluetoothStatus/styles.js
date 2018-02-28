// @flow

import {StyleSheet} from 'react-native'
import THEME from '../../../../theme/variables/airbitz'

const styles = StyleSheet.create({
  container: {
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: THEME.COLORS.SECONDARY,
    alignItems: 'center',
    backgroundColor: THEME.COLORS.GRAY_4
  },
  view: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME.COLORS.TRANSPARENT,
    width: '80%'
  },
  text: {
    color: THEME.COLORS.WHITE,
    margin: 10
  },
  bluetoothContainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: THEME.COLORS.TRANSPARENT,
    alignSelf: 'flex-end',
    justifyContent: 'center',
    minHeight: 50,
    maxHeight: 50,
    flexDirection: 'row'
  },
  image: {
    height: 50,
    width: 50
  }
})

export default styles
