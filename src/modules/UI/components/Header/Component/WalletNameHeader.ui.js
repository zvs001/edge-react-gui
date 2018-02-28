// @flow
import React from 'react'
import { Text, View } from 'react-native'

import style from '../style'

type Props = {
  styles: {
    textStyles: Array<{}>
  },
  name: string,
  denomination: string
}

class WalletNameHeader extends React.Component<Props> {
  render () {
    const { styles = {} } = this.props
    const textStyles = styles.textStyles || []
    const name = this.props.name
    const denomination = this.props.denomination

    return (
      <View style={style.headerNameContainer}>
        <Text style={textStyles} ellipsizeMode={'middle'} numberOfLines={1}>
          {name}:
          <Text style={[style.cCode, ...textStyles]}>{denomination}</Text>
        </Text>
      </View>
    )
  }
}
export { WalletNameHeader }
