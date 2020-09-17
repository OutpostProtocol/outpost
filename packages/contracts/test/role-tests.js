/* global describe, before, it, after, beforeEach */

import { DEV_NAME, IS_OPEN, OWNER, testKeys } from './helpers/constants'
import TestHelper from './helpers'
import { assert } from 'chai'
import interactions from './helpers/interactions'
import { createInitState } from 'outpost-protocol'

describe('Community Roles', function () {
  let state
  let ADMIN
  let MOD
  let MEMBER
  let MEMBER2
  let NEW_OWNER

  let helper

  before(async function () {
    helper = new TestHelper()
    const accounts = await helper.setupEnv(testKeys)
    ADMIN = accounts[0]
    MOD = accounts[1]
    MEMBER = accounts[2]
    MEMBER2 = accounts[3]
    NEW_OWNER = accounts[4]

    const initState = createInitState(OWNER, DEV_NAME, IS_OPEN)

    state = Object.assign({}, initState)
  })

  after(async function () {
    await helper.stopIPFS()
  })

  describe('Transfer Ownership', function () {
    let interaction

    beforeEach(function () {
      interaction = interactions.ownership
      interaction.newOwner = NEW_OWNER
    })

    it('successfully transfers ownership', async function () {
      const res = await helper.packageNExecute(interaction, state, OWNER)
      assert.equal(res.type, 'ok')
      assert.equal(res.state.owner, NEW_OWNER)

      interaction.newOwner = OWNER
      const res2 = await helper.packageNExecute(interaction, res.state, NEW_OWNER)
      assert.equal(res2.type, 'ok')
    })

    it('fails transfer if callerDID is not owner', async function () {
      const res = await helper.packageNExecute(interaction, state, ADMIN)
      assert.equal(res.result, 'Must be owner to transfer ownership')
    })

    it('fails when new owner is not a valid 3ID', async function () {
      interaction.newOwner = 'not a did'

      const res = await helper.packageNExecute(interaction, state, OWNER)
      assert.equal(res.result, '\'not a did\' not recognized as a valid 3ID')
    })
  })

  describe('add and remove admin', function () {
    let addInteraction
    let removeInteraction

    before(function () {
      addInteraction = interactions.admins.add
      addInteraction.admin = ADMIN

      removeInteraction = interactions.admins.remove
      removeInteraction.admin = ADMIN
    })

    it('add and remove an admin', async function () {
      let res
      async function testAdd () {
        res = await helper.packageNExecute(addInteraction, state, OWNER)
        state = res.state
        assert.equal(state.admins[ADMIN], true)
      }

      await testAdd()

      res = await helper.packageNExecute(removeInteraction, state, OWNER)
      state = res.state
      assert.equal(state.admins[ADMIN], false)

      await testAdd()
    })

    it('fails when not called by owner', async function () {
      const res = await helper.packageNExecute(addInteraction, state, ADMIN)
      assert.equal(res.result, 'Must be owner to add an admin')
    })
  })

  describe('add and remove moderator', function () {
    let addInteraction
    let removeInteraction

    before(function () {
      addInteraction = interactions.moderators.add
      addInteraction.moderator = MOD

      removeInteraction = interactions.moderators.remove
      removeInteraction.moderator = MOD
    })

    async function testAdd (caller = OWNER) {
      const res = await helper.packageNExecute(addInteraction, state, caller)
      state = res.state
      assert.equal(state.moderators[MOD], true)
    }

    it('add moderator by owner', async function () {
      await testAdd()
    })

    it('remove mod by owner', async function () {
      const res = await helper.packageNExecute(removeInteraction, state, OWNER)
      state = res.state
      assert.equal(state.moderators[MOD], false)
    })

    it('add mod by admin', async function () {
      await testAdd(ADMIN)
    })

    it('moderator can remove themself', async function () {
      const res = await helper.packageNExecute(removeInteraction, state, MOD)
      state = res.state
      assert.equal(state.moderators[MOD], false)
    })

    it('test add again for later testing', async function () {
      await testAdd(ADMIN) // for later testing
    })

    it('add without admin privileges fails', async function () {
      const res = await helper.packageNExecute(addInteraction, state, MOD)
      assert.equal(res.result, 'Must be owner or admin to add a moderator')
    })
  })

  describe('test add member', function () {
    let addInteraction
    let removeInteraction

    before(function () {
      addInteraction = interactions.members.add
      addInteraction.member = MEMBER

      removeInteraction = interactions.members.remove
      removeInteraction.member = MEMBER
    })

    it('adds anyone to open community', async function () {
      const res = await helper.packageNExecute(addInteraction, state, MEMBER)
      state = res.state
      assert.equal(state.members[MEMBER], true)
    })

    it('moderators and above can remove', async function () {
      const res = await helper.packageNExecute(removeInteraction, state, MOD)
      state = res.state
      assert.equal(state.members[MEMBER], false)
    })

    it('members cannot remove', async function () {
      state = (await helper.packageNExecute(addInteraction, state, MEMBER)).state
      addInteraction.member = MEMBER2
      let res = await helper.packageNExecute(addInteraction, state, MEMBER2)
      state = res.state

      removeInteraction.member = MEMBER2
      res = await helper.packageNExecute(removeInteraction, state, MEMBER)
      state = res.state
      assert.equal(res.result, 'Caller must have moderator privileges to remove a member')
    })

    it('members can remove themselves', async function () {
      const res = await helper.packageNExecute(removeInteraction, state, MEMBER2)
      state = res.state

      assert.equal(state.members[MEMBER2], false)
    })

    it('close community and add fails', async function () {
      const closeCom = interactions.access.close

      let res = await helper.packageNExecute(closeCom, state, OWNER)
      state = res.state
      assert.equal(state.isOpen, false)

      res = await helper.packageNExecute(addInteraction, state, MEMBER2)
      assert.equal(res.result, 'Caller must have moderator privileges to add a member')
    })
  })
})
