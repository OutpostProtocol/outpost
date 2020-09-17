/* global ContractAssert, ContractError */

import checkRoleOps, { hasAdminPrivileges } from './roles'
import { getPayload, checkPayload, isNotPreviousChild, setTimestamp } from './utils'
import {
  SET_ACCESS,
  ADD_CHILD,
  REMOVE_CHILD,
  SET_NAME,
  SET_GUIDELINES
} from 'outpost-js/functionTypes'

export async function handle (state, action) {
  const payload = await getPayload(action.input, action.ipfs)

  // ensure the payload has the correct nonce and contract id. This prevents reusing a signature.
  checkPayload(state, payload)

  setTimestamp(state, payload)

  const op = checkRoleOps(state, payload)
  if (op.isRoleOp) return { state: op.state }

  const { input } = payload

  if (input.function === SET_ACCESS) {
    ContractAssert(hasAdminPrivileges(payload.iss, state), 'Must have admin privileges to set access')

    state.isOpen = input.isOpen
    return { state }
  }

  if (input.function === ADD_CHILD) {
    // can be called by anyone if the community has not previously been removed
    // otherwise must be called by admin
    ContractAssert(isNotPreviousChild(input.communityId, state) || hasAdminPrivileges(payload.iss, state),
      'A community that has been removed can only be added back with admin privileges')

    state.children[input.communityId] = true

    return { state }
  }

  if (input.function === REMOVE_CHILD) {
    ContractAssert(hasAdminPrivileges(payload.iss, state), 'Caller must have admin privileges to remove a community')

    state.children[input.communityId] = false

    return { state }
  }

  if (input.function === SET_NAME) {
    ContractAssert(hasAdminPrivileges(payload.iss, state), 'Caller must have admin privileges to set the name of a community')

    state.name = input.name

    return { state }
  }

  if (input.function === SET_GUIDELINES) {
    ContractAssert(hasAdminPrivileges(payload.iss, state), 'Caller must have admin privileges to set the guidelines of a community')

    state.guidelines = input.guidelines

    return { state }
  }

  throw new ContractError(`No function supplied or function not recognised: "${input.function}"`)
}
