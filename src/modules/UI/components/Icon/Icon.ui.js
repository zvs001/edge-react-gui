// @flow

import React from 'react'
import Entypo from 'react-native-vector-icons/Entypo'
import FAIcon from 'react-native-vector-icons/FontAwesome'
import IonIcon from 'react-native-vector-icons/Ionicons'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import SimpleIcon from 'react-native-vector-icons/SimpleLineIcons'

import * as Constants from '../../../../constants/indexConstants'

type Props = {
  style: any,
  name: string,
  size: number,
  type: string
}

const Icon = ({ style, name, size, type }: Props) => {
  switch (type) {
    case Constants.ENTYPO:
      return <Entypo style={style} name={name} size={size} />
    case Constants.MATERIAL_ICONS:
      return <MaterialIcon style={style} name={name} size={size} />
    case Constants.FONT_AWESOME:
      return <FAIcon style={style} name={name} size={size} />
    case Constants.ION_ICONS:
      return <IonIcon style={style} name={name} size={size} />
    case Constants.SIMPLE_ICONS:
      return <SimpleIcon style={style} name={name} size={size} />
  }
  return null
}

export { Icon }
