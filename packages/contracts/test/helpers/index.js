import fs from 'fs'
import Arweave from 'arweave/node'
import { execute } from 'smartweave/lib/contract-step'
import DidTestHelper from '3id-test-helper'
import IPFS from 'ipfs'
import wallet from './test-wallet'
import { createContractExecutionEnvironment } from 'smartweave/lib/contract-load'

require('dotenv').config()

const LOCAL_CONTRACT_ID = 'random id for testing'

const arweave = Arweave.init({
  host: 'arweave.net',
  port: 443,
  protocol: 'https'
})

let didHelper
let handler
let swGlobal

export default class TestHelper {
  constructor (contractPath) {
    const contractBuffer = fs.readFileSync(contractPath)
    this.contractSrc = contractBuffer.toString()

    this.contractId = LOCAL_CONTRACT_ID
  }

  async setupEnv (testKeys, ipfs) {
    const contractInfo = createContractExecutionEnvironment(arweave, this.contractSrc, this.contractId)

    swGlobal = contractInfo.swGlobal
    handler = contractInfo.handler

    if (ipfs) {
      this.ipfs = ipfs
    } else {
      this.ipfs = await IPFS.create()
    }

    didHelper = new DidTestHelper(this.ipfs)

    const accounts = await didHelper.generateAccounts(testKeys)
    await didHelper.getOwner() // sets the signer for the owner DID

    return accounts
  }

  getArweave () {
    return arweave
  }

  async package (input, caller) {
    const interaction = {
      input,
      contractId: this.contractId
    }

    return await didHelper.createJWTFromDID(caller, interaction)
  }

  async executeInteraction (jwt, state) {
    swGlobal._activeTx = await this.getInteractionTx(jwt)

    const res = await execute(handler, { input: jwt, ipfs: this.ipfs }, state)

    return res
  }

  async packageNExecute (input, state, caller) {
    const jwt = await this.package(input, caller)

    return await this.executeInteraction(jwt, state)
  }

  // code taken mainly from interactWrite in contract-interact
  async getInteractionTx (input) {
    const interactionTx = await arweave.createTransaction(
      {
        data: Math.random()
          .toString()
          .slice(-4)
      },
      wallet
    )

    if (!input) {
      throw new Error(`Input should be a truthy value: ${JSON.stringify(input)}`)
    }

    interactionTx.addTag('App-Name', 'SmartWeaveAction')
    interactionTx.addTag('App-Version', '0.3.0')
    interactionTx.addTag('Contract', this.contractId)
    interactionTx.addTag('Input', JSON.stringify(input))

    await arweave.transactions.sign(interactionTx, wallet)

    // interaction Tx needs to satisfy InteractionTx interface
    const fullTx = this.fillUnusedTxValues(interactionTx)
    return fullTx
  }

  fillUnusedTxValues (tx) {
    return {
      tx,
      info: {
        status: 200,
        confirmed: {
          block_indep_hash: 'some hash',
          block_height: 1,
          number_of_confirmations: 10
        }
      },
      id: '',
      sortKey: '',
      from: ''
    }
  }

  async stopIPFS () {
    await this.ipfs.stop()
  }
}
