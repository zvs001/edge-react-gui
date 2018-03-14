// @flow

import { connect } from 'react-redux'

import type { State, Dispatch } from '../../../ReduxTypes.js'

import type {GuiContact} from '../../../../types.js'
import { ContactsLoader } from './ContactsLoader.ui.js'
import { fetchContacts } from './indexContactsLoader.js'
import { loadContactsStart, loadContactsSuccess } from '../../../../reducers/contacts/actions.js'
import { displayErrorAlert } from '../ErrorAlert/actions.js'

export const mapStateToProps = (state: State) => ({
  contactsPermission: state.permissions.contacts
})
export const mapDispatchToProps = (dispatch: Dispatch) => ({
  fetchContacts,
  loadContactsStart: () => dispatch(loadContactsStart()),
  loadContactsSuccess: (contacts: Array<GuiContact>) => dispatch(loadContactsSuccess(contacts)),
  loadContactsFail: (error: Error) => dispatch(displayErrorAlert(error.message))
})

export default connect(mapStateToProps, mapDispatchToProps)(ContactsLoader)
