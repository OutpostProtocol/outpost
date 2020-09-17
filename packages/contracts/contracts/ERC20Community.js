import { getPayload, checkPayload, setTimestamp, is3ID } from './utils'
import {
  SET_NAME,
  TRANSFER_OWNERSHIP,
  SET_TOKEN_ADDRESS,
  SET_DEFAULT_REQUIREMENTS,
  SET_IMAGE_TX,
  SET_DESCRIPTION,
  UPGRADE_CONTRACT,
  ADD_WRITER,
  REMOVE_WRITER
} from 'outpost-js/functionTypes'

export async function handle (state, action) {
  const payload = await getPayload(action.input, action.ipfs)

  // ensure the payload has the correct nonce and contract id. This prevents reusing a signature.
  checkPayload(state, payload)

  setTimestamp(state, payload)

  ContractAssert(payload.iss === state.owner, 'Only the owner can call functions to this contract.')

  const { input } = payload

  if (input.function === SET_NAME) {
    ContractAssert(typeof input.name === 'string', `$'${input.name}' not recognized as a string.`)

    state.name = input.name
    return { state }
  }

  if (input.function === TRANSFER_OWNERSHIP) {
    ContractAssert(is3ID(input.writer), `'${input.writer}' not recognized as a valid 3ID`)

    state.owner = input.newOwner
    return { state }
  }

  if (input.function === SET_TOKEN_ADDRESS) {
    ContractAssert(typeof input.tokenAddress === 'string', `$'${input.tokenAddress}' not recognized as a string.`)

    state.tokenAddress = input.tokenAddress
    return { state }
  }

  if (input.function === SET_DEFAULT_REQUIREMENTS) {
    ContractAssert(typeof input.requirements === 'object', `$'${input.requirements}' not recognized as an object.`)

    state.defaultRequirements = input.requirements
    return { state }
  }

  if (input.function === SET_IMAGE_TX) {
    ContractAssert(typeof input.imageTxId === 'string', `$'${input.imageTxId}' not recognized as a string.`)

    state.imageTxId = input.imageTxId
    return { state }
  }

  if (input.function === SET_DESCRIPTION) {
    ContractAssert(typeof input.description === 'string', `$'${input.description}' not recognized as a string.`)

    state.description = input.description
    return { state }
  }

  // ADD A VARIABLE IN STATE FOR UPGRADED CONTRACT?
  if (input.function === UPGRADE_CONTRACT) {
    ContractAssert(typeof input.newAddress === 'string', `$'${input.newAddress}' not recognized as a string.`)

    state.upgradedContract = input.newAddress
    return { state }
  }

  if (input.function === ADD_WRITER) {
    ContractAssert(is3ID(input.writer), `'${input.writer}' not recognized as a valid 3ID`)

    state.writers.push(input.writer)
    return { state }
  }

  if (input.function === REMOVE_WRITER) {
    ContractAssert(is3ID(input.writer), `'${input.writer}' not recognized as a valid 3ID`)

    state.writers = state.writers.filter(w => w !== input.writer)
    return { state }
  }

  throw new ContractError(`No function supplied or function not recognised: "${input.function}"`)
}
