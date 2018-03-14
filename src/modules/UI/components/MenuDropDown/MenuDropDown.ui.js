// @flow
import React, {Component} from 'react'
import {View, Text} from 'react-native'
import Menu, {MenuOptions, MenuOption, MenuTrigger} from 'react-native-popup-menu'
import {Icon} from '../Icon/Icon.ui'
import * as Constants from '../../../../constants/indexConstants'

type Props = {
  style: any,
  data: any,
  icon: string,
  iconType: string,
  onSelect: Function
}

type State = {
  height: number,
  pageY: number
}

class MenuDropDown extends Component<Props, State> {
  static defaultProps = {
    iconType: Constants.ENTYPO,
    icon: Constants.THREE_DOT_MENU
  }

  constructor (props: Props) {
    super(props)
    this.state = {
      height: 0,
      pageY: 0
    }
  }

  renderMenuOptions (style: any) {
    const items = this.props.data.map(item => (
      <MenuOption style={style.menuOption} value={item.value} key={'ld' + (item.key || item.value)}>
        <View style={[style.menuOptionItem]}>
          <Text style={[style.optionText]}>{item.label}</Text>
        </View>
      </MenuOption>
    ))
    return items
  }

  render () {
    const style = this.props.style

    return (
      <View style={[style.container]}>
        <Menu style={[style.menuButton]} onSelect={(value) => this.props.onSelect(value)}>
          <MenuTrigger customStyles={style.menuTrigger}>
            {this.renderMenuIcon(style)}
          </MenuTrigger>
          <MenuOptions customStyles={style.menuOptions}>
            {this.renderMenuOptions(style)}
          </MenuOptions>
        </Menu>
      </View>
    )
  }
  renderMenuIcon = (style: any) => {
    if (this.props.icon) {
      return (
        <View style={style.menuIconWrap}>
          <Icon style={style.icon} name={this.props.icon} size={style.icon.fontSize} type={this.props.iconType} />
        </View>
      )
    }
  }
}
export { MenuDropDown }
