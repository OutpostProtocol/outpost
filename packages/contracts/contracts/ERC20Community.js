/*
STATE:

name
owner
token address
default requirements:
  - read
  - comment

**** writers - can only be added by owner

imageTxId
description
timestamps

METHODS:

upgradeContract             X
setName
transferOwnership
setTokenAddress             X
setTokenRequirement         X
setImageTxId                X
setDescription              X

addWriter                   X
removeWriter                X
*/

import { getPayload, checkPayload, setTimestamp } from './utils'
import {
  SET_NAME,
  TRANSFER_OWNERSHIP,
  SET_TOKEN_ADDRESS,
  SET_DEFAULT_REQUIREMENTS,
  SET_IMAGE_TX,
  SET_DESCRIPTION,
  UPGRADE_CONTRACT
} from 'outpost-protocol/functionTypes'

export async function handle (state, action) {
  const payload = await getPayload(action.input, action.ipfs)

  // ensure the payload has the correct nonce and contract id. This prevents reusing a signature.
  checkPayload(state, payload)

  setTimestamp(state, payload)

  ContractAssert(payload.iss === state.owner, 'Only the owner can call functions to this contract.')

  const { input } = payload

  if (input.function === SET_NAME) {
    state.name = input.name
    return { state }
  }

  if (input.function === TRANSFER_OWNERSHIP) {
    state.owner = input.newOwner
    return { state }
  }

  if (input.function === SET_TOKEN_ADDRESS) {
    state.tokenAddress = input.tokenAddress
    return { state }
  }

  if (input.function === SET_DEFAULT_REQUIREMENTS) {}

  if (input.function === SET_IMAGE_TX) {}

  if (input.function === SET_DESCRIPTION) {}

  // ADD A VARIABLE IN STATE FOR UPGRADED CONTRACT?
  if (input.function === UPGRADE_CONTRACT) {}

  throw new ContractError(`No function supplied or function not recognised: "${input.function}"`)
}
