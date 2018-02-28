import { StyleSheet } from 'react-native'

import THEME from '../../../../../theme/variables/airbitz'

export const styles = {
  stylizedButtonText: {
    color: THEME.COLORS.WHITE,
    fontSize: 16
  },
  cancelButtonWrap: {
    backgroundColor: THEME.COLORS.GRAY_2,
    alignSelf: 'flex-start'
  },
  cancelButton: {
    color: THEME.COLORS.PRIMARY
  },
  doneButtonWrap: {
    backgroundColor: THEME.COLORS.SECONDARY,
    alignSelf: 'flex-end',
    marginLeft: 4
  },
  doneButton: {
    color: THEME.COLORS.PRIMARY
  },
  rowContainer: {
    height: 44,
    borderBottomWidth: 1,
    borderBottomColor: THEME.COLORS.GRAY_3,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 15,
    paddingBottom: 15,
    justifyContent: 'space-around'
  },
  rowTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  rowLeftContainer: {
    justifyContent: 'center'
  },
  rowLeftText: {
    color: THEME.COLORS.GRAY_1,
    fontSize: 16
  },
  radioButton: {
    height: 24,
    color: THEME.COLORS.SECONDARY,
    fontSize: 24
  },
  radioButtonSelected: {
    color: THEME.COLORS.GRAY_1
  },
  sendLogsModalInput: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderColor: THEME.COLORS.GRAY_4,
    color: THEME.COLORS.GRAY_1,
    height: 50,
    padding: 5
  },
  icon: {
    color: THEME.COLORS.PRIMARY,
    backgroundColor: THEME.COLORS.TRANSPARENT,
    zIndex: 1015,
    elevation: 1015
  },
  underlay: {
    color: THEME.COLORS.GRAY_4
  },
  autoLogoutMiddleContainer: {
    flexDirection: 'row'
  },
  autoLogoutDialogTitle: {
    color: THEME.COLORS.PRIMARY
  },
  autoLogoutPickerContainer: {
    flex: 1,
    margin: 4
  }
}

export default StyleSheet.create(styles)
