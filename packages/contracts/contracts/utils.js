/* global SmartWeave, ContractAssert, ContractError */

import { verifyJWT } from 'did-jwt'
import { Resolver } from 'did-resolver'
import { getResolver } from '3id-resolver'

const DID_3_PREFIX = 'did:3:'

export function is3ID (did) {
  return did.startsWith(DID_3_PREFIX)
}

export function checkPayload (state, payload) {
  const caller = payload.iss
  const callerTimestamps = state.timestamps[caller]
  ContractAssert(!callerTimestamps || !callerTimestamps.includes(payload.iat), 'Timestamp provided has been reused')

  const contractId = SmartWeave.contract.id

  ContractAssert(contractId, 'No contract ID provided.')
  ContractAssert(contractId === payload.contractId, 'The contract ID provided is invalid.')
}

export function isNotPreviousChild (communityId, state) {
  return typeof state.children[communityId] === 'undefined'
}

export function setTimestamp (state, payload) {
  if (!state.timestamps[payload.iss]) {
    state.timestamps[payload.iss] = []
    state.timestamps[payload.iss].push(payload.iat)
  } else {
    state.timestamps[payload.iss].push(payload.iat)
  }
}

export async function getPayload (jwt, ipfs) {
  const threeIdResolver = getResolver(ipfs)
  const resolverWrapper = new Resolver(threeIdResolver)

  let verifiedJWT
  try {
    verifiedJWT = await verifyJWT(jwt, { resolver: resolverWrapper })
  } catch (e) {
    throw new ContractError(`JWT verification failed: ${e}`)
  }

  return verifiedJWT.payload
}
