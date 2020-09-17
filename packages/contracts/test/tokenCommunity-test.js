/* global describe, before, it, after */

import { OWNER, DEV_NAME, testKeys } from './helpers/constants'
import TestHelper from './helpers'
import { assert } from 'chai'
import { createTokenCommunityState } from 'outpost-js'
import path from 'path'
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

const INITIAL_ADDRESS = 'some_eth_address'
const NEW_ADDRESS = 'new_eth_address_for_token'

describe('ERC20 Community', function () {
  let state
  let OTHER_ID

  let helper

  before(async function () {
    helper = new TestHelper(path.resolve(__dirname, '../build/ERC20Community.js'))
    const accounts = await helper.setupEnv(testKeys)
    OTHER_ID = accounts[0]

    const stateParams = {
      name: DEV_NAME,
      owner: OWNER,
      tokenAddress: INITIAL_ADDRESS
    }
    const initState = createTokenCommunityState(stateParams)

    state = Object.assign({}, initState)
  })

  after(async function () {
    await helper.stopIPFS()
  })

  it('has expected default state', function () {
    assert.equal(state.name, DEV_NAME)
    assert.equal(state.owner, OWNER)
    assert.equal(state.tokenAddress, INITIAL_ADDRESS)
  })

  it('calls set name successfully', async function () {
    const newName = 'dat new new'

    const interaction = {
      function: SET_NAME,
      name: newName
    }

    const res = await helper.packageNExecute(interaction, state, OWNER)
    assert.equal(res.state.name, newName)
  })

  it('transfers ownership', async function () {
    const interaction = {
      function: TRANSFER_OWNERSHIP,
      newOwner: OTHER_ID
    }

    let res = await helper.packageNExecute(interaction, state, OWNER)
    assert.equal(res.state.owner, OTHER_ID)
    state = res.state

    interaction.newOwner = OWNER
    res = await helper.packageNExecute(interaction, state, OTHER_ID)
    assert.equal(res.state.owner, OWNER)
    state = res.state
  })

  it('sets token address', async function () {
    const interaction = {
      function: SET_TOKEN_ADDRESS,
      tokenAddress: NEW_ADDRESS
    }

    const res = await helper.packageNExecute(interaction, state, OWNER)
    assert.equal(res.state.tokenAddress, NEW_ADDRESS)
  })

  it('sets default requirements', async function () {
    const interaction = {
      function: SET_DEFAULT_REQUIREMENTS,
      requirements: {
        read: 1000,
        comment: 1000
      }
    }

    const res = await helper.packageNExecute(interaction, state, OWNER)
    assert.equal(res.state.defaultRequirements.read, 1000)
  })

  it('sets image tx', async function () {
    const txId = 'some base64 hash'

    const interaction = {
      function: SET_IMAGE_TX,
      imageTxId: txId
    }

    const res = await helper.packageNExecute(interaction, state, OWNER)
    assert.equal(res.state.imageTxId, txId)
  })

  it('sets description', async function () {
    const description = 'really cool publication with awesome social token'

    const interaction = {
      function: SET_DESCRIPTION,
      description
    }

    const res = await helper.packageNExecute(interaction, state, OWNER)
    assert.equal(res.state.description, description)
  })

  it('upgrades contract', async function () {
    const newAddress = NEW_ADDRESS

    const interaction = {
      function: UPGRADE_CONTRACT,
      newAddress
    }

    const res = await helper.packageNExecute(interaction, state, OWNER)
    assert.equal(res.state.upgradedContract, newAddress)
  })

  it('adds and removes a new writer', async function () {
    const interaction = {
      function: ADD_WRITER,
      writer: OTHER_ID
    }

    let res = await helper.packageNExecute(interaction, state, OWNER)
    assert.equal(res.state.writers.includes(OTHER_ID), true)
    state = res.state

    interaction.function = REMOVE_WRITER
    res = await helper.packageNExecute(interaction, state, OWNER)
    assert.equal(res.state.writers.includes(OTHER_ID), false)
  })

  it('fails when not called by owner', async function () {
    const interaction = {
      function: ADD_WRITER,
      writer: OTHER_ID
    }

    const res = await helper.packageNExecute(interaction, state, OTHER_ID)
    assert.equal(res.result, 'Only the owner can call functions to this contract.')
  })

  it('fails when a jwt is reused', async function () {
    const interaction = {
      function: ADD_WRITER,
      writer: OTHER_ID
    }

    const interactionToRepeat = await helper.package(interaction, OWNER)
    let res = await helper.executeInteraction(interactionToRepeat, state)
    state = res.state

    res = await helper.executeInteraction(interactionToRepeat, state)
    assert.equal(res.result, 'Timestamp provided has been reused')
  })
})
