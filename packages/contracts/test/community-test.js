/* global describe, it, before, after */

import {
  fullState, OWNER, testKeys, OTHER_COMMUNITY, NEW_NAME, UPDATED_GUIDELINES_ADDR
} from './helpers/constants'
import TestHelper from './helpers'
import { assert } from 'chai'
import interactions from './helpers/interactions'
import path from 'path'

describe('Miscellaneous functions', function () {
  let state
  let ADMIN
  let MOD
  let MEMBER

  let helper

  let interactionToRepeat

  before(async function () {
    helper = new TestHelper(path.resolve(__dirname, '../build/community.js'))
    const accounts = await helper.setupEnv(testKeys)
    ADMIN = accounts[0]
    MOD = accounts[1]
    MEMBER = accounts[2]

    state = Object.assign({}, fullState)
  })

  after(async function () {
    await helper.stopIPFS()
  })

  describe('test set access of the community', function () {
    let close
    let open

    before(function () {
      close = interactions.access.close
      open = interactions.access.open
    })

    it('owner can change access', async function () {
      const res = await helper.packageNExecute(close, state, OWNER)
      state = res.state
      assert.equal(state.isOpen, false)
    })

    it('admin can change access', async function () {
      const res = await helper.packageNExecute(open, state, ADMIN)
      state = res.state
      assert.equal(state.isOpen, true)
    })

    it('moderator attempt to change access fails', async function () {
      const res = await helper.packageNExecute(open, state, MOD)
      assert.equal(res.result, 'Must have admin privileges to set access')
    })
  })

  describe('Test child community functions', function () {
    let addInteraction
    let removeInteraction

    before(function () {
      addInteraction = interactions.children.add
      removeInteraction = interactions.children.remove
    })

    it('anyone can add a child community initially', async function () {
      const res = await helper.packageNExecute(addInteraction, state, MEMBER)
      state = res.state
      assert.equal(state.children[OTHER_COMMUNITY], true)
    })

    it('fails when someone without admin privileges tries to remove a community', async function () {
      const res = await helper.packageNExecute(removeInteraction, state, MOD)
      assert.equal(res.result, 'Caller must have admin privileges to remove a community')
    })

    it('admin can remove a community', async function () {
      const res = await helper.packageNExecute(removeInteraction, state, ADMIN)
      state = res.state
      assert.equal(state.children[OTHER_COMMUNITY], false)
    })

    it('fails to add a community that has been previously removed', async function () {
      const res = await helper.packageNExecute(addInteraction, state, MOD)
      assert.equal(res.result, 'A community that has been removed can only be added back with admin privileges')
    })

    it('allows admin to add back a community', async function () {
      interactionToRepeat = await helper.package(addInteraction, ADMIN)
      const res = await helper.executeInteraction(interactionToRepeat, state)
      state = res.state
      assert.equal(state.children[OTHER_COMMUNITY], true)
    })
  })

  describe('fails when jwt is reused', function () {
    it('fails to run', async function () {
      const res = await helper.executeInteraction(interactionToRepeat, state)
      assert.equal(res.result, 'Timestamp provided has been reused')
    })
  })

  describe('sets community name and guidelines', function () {
    it('allows admin to set name of community', async function () {
      const res = await helper.packageNExecute(interactions.setName, state, ADMIN)
      state = res.state
      assert.equal(state.name, NEW_NAME)
    })

    it('allows admin to set the guidelines of the community', async function () {
      const res = await helper.packageNExecute(interactions.setGuidelines, state, ADMIN)
      state = res.state
      assert.equal(state.guidelines.image, UPDATED_GUIDELINES_ADDR.image)
      assert.equal(state.guidelines.url, UPDATED_GUIDELINES_ADDR.url)
      assert.equal(state.guidelines.description, UPDATED_GUIDELINES_ADDR.description)
    })
  })
})
