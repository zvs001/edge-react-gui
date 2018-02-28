import React from 'react'
import { Text, View } from 'react-native'
import { connect } from 'react-redux'

import s from '../../../../locales/strings.js'
import { border as b } from '../../../utils.js'
import T from '../FormattedText/'
import styles from './styles'

const REMAINING_TEXT = s.strings.bitcoin_remaining
const RECEIVED_TEXT = s.strings.bitcoin_received

const RequestStatus = props => {
  const amountRequestedInCrypto = props.amountSatoshi
  const amountReceivedInCrypto = props.amountSatoshi
  const requestAddress = props.requestAddress

  const hasReceivedPartialPayment = () => {
    const hasReceivedPartialPayment = hasReceivedPayment() && !isPaymentSufficient()

    return hasReceivedPartialPayment
  }

  const hasReceivedPayment = () => {
    const hasReceivedPayment = !!amountReceivedInCrypto

    return hasReceivedPayment
  }

  const isPaymentSufficient = () => {
    const isPaymentSufficient = amountReceivedInCrypto >= amountRequestedInCrypto

    return isPaymentSufficient
  }

  const getOutstandingDebtInCrypto = () => {
    const outstandingDebtInCrypto = amountRequestedInCrypto - amountReceivedInCrypto

    return outstandingDebtInCrypto
  }

  const getDisplayRequestStatus = () => {
    const waitingForPayment = (
      <View style={styles.view}>
        <T numberOfLines={1} ellipsizeMode="middle" style={[b(), styles.text]}>
          {requestAddress}
        </T>
      </View>
    )

    const partialPaymentReceived = (
      <View style={styles.view}>
        <Text style={styles.text}>{amountReceivedInCrypto + RECEIVED_TEXT}</Text>

        <Text style={styles.text}>{getOutstandingDebtInCrypto() + REMAINING_TEXT}</Text>

        <Text style={styles.text}>{requestAddress}</Text>
      </View>
    )

    const displayStatus = hasReceivedPartialPayment() ? partialPaymentReceived : waitingForPayment

    return displayStatus
  }

  return <View style={styles.view}>{getDisplayRequestStatus()}</View>
}

const mapStateToProps = state => ({
  request: state.request
})

export default connect(mapStateToProps)(RequestStatus)
