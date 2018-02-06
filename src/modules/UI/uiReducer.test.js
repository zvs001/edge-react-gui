/* globals test expect */

import { uiReducer } from './reducer.js'

test('initialState', () => {
  const expected = {
    'contacts': {
      'contactList': []
    },
    'errorAlert': {
      'displayAlert': false,
      'message': ''
    },
    'request': {
      'receiveAddress': {
        'amountSatoshi': 0,
        'metadata': {
          'amountFiat': 0,
          'bizId': null,
          'category': '',
          'miscJson': '',
          'notes': '',
          'payeeName': ''
        },
        'publicAddress': ''
      }
    },
    'scenes': {
      'ABAlert': {
        'syntax': {},
        'view': false},
      'controlPanel': {
        'selectedUser': null,
        'usersView': false},
      'createWallet': {
        'isCreatingWallet': false},
      'dimensions': {
        'keyboardHeight': 0},
      'editToken': {
        'deleteCustomTokenProcessing': false,
        'deleteTokenModalVisible': false,
        'editCustomTokenProcessing': false},
      'exchangeRate': {
        'exchangeRates': {}
      },
      'helpModal': false,
      'request': {
        'inputCurrencySelected': 'fiat',
        'receiveAddress': {
          'amountSatoshi': 0,
          'metadata': {
            'amountFiat': 0,
            'bizId': null,
            'category': '',
            'miscJson': '',
            'notes': '',
            'payeeName': ''
          },
          'publicAddress': ''
        }
      },
      'scan': {
        'addressModalVisible': false,
        'recipientAddress': '',
        'scanEnabled': false,
        'scanToWalletListModalVisibility': false,
        'selectedWalletListModalVisibility': false,
        'torchEnabled': false},
      'sendConfirmation': {
        'label': '',
        'pending': false,
        'isKeyboardVisible': false,
        'forceUpdateGuiCounter': 0,
        'transaction': {
          'txid': '',
          'date': 0,
          'currencyCode': '',
          'blockHeight': -1,
          'nativeAmount': '0',
          'networkFee': '',
          'ourReceiveAddresses': [],
          'signedTx': '',
          'metadata': {},
          'otherParams': {}
        },
        'parsedUri': {
          'networkFeeOption': 'standard',
          'customNetworkFee': {},
          'publicAddress': '',
          'nativeAmount': '0',
          'metadata': {
            'payeeName': '',
            'category': '',
            'notes': '',
            'amountFiat': 0,
            'bizId': 0,
            'miscJson': ''
          }
        },
        'error': null
      },
      'sideMenu': {
        'view': false},
      'transactionAlert': {
        'abcTransaction': '',
        'displayAlert': false},
      'transactionDetails': {
        'subcategories': []
      },
      'transactionList': {
        'contactsList': [],
        'searchVisible': false,
        'transactions': [],
        'transactionsWalletListModalVisibility': false,
        'updatingBalance': true},
      'walletList': {
        'deleteWalletModalVisible': false,
        'getSeedWalletModalVisible': false,
        'privateSeedUnlocked': false,
        'renameWalletInput': '',
        'renameWalletModalVisible': false,
        'resyncWalletModalVisible': false,
        'splitWalletModalVisible': false,
        'walletArchivesVisible': false,
        'walletId': '',
        'walletName': ''
      },
      'walletListModal': {
        'walletListModalVisible': false},
      'walletTransferList': {
        'walletListModalVisible': false,
        'walletTransferList': []
      }
    },
    'settings': {
      'BCH': {
        'denomination': '100000000'
      },
      'BTC': {
        'denomination': '100000000'
      },
      'DASH': {
        'denomination': '100000000'
      },
      'ETH': {
        'denomination': '1000000000000000000'
      },
      'LTC': {
        'denomination': '100000000'
      },
      'REP': {
        'denomination': '1000000000000000000'
      },
      'WINGS': {
        'denomination': '1000000000000000000'
      },
      'account': null,
      'autoLogoutTimeInSeconds': 3600,
      'bluetoothMode': false,
      'changesLocked': true,
      'customTokens': [],
      'defaultFiat': 'USD',
      'isOtpEnabled': false,
      'isTouchEnabled': false,
      'isTouchSupported': false,
      'loginStatus': null,
      'merchantMode': false,
      'otpKey': null,
      'otpMode': false,
      'otpResetDate': null,
      'pinMode': false,
      'plugins': {
        'arrayPlugins': [],
        'supportedWalletTypes': []
      }
    },
    'transactionAlert': {
      'abcTransaction': '',
      'displayAlert': false},
    'wallets': {
      'activeWalletIds': [],
      'addTokenPending': false,
      'archivedWalletIds': [],
      'byId': {},
      'manageTokensPending': false,
      'selectedCurrencyCode': '',
      'selectedWalletId': ''
    }
  }
  const actual = uiReducer(undefined, {})

  expect(actual).toEqual(expected)
})
