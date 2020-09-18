const fs = require('fs')
const path = require('path')
const Arweave = require('arweave/node')
const { createTokenCommunityState } = require('outpost-js')
const smartweave = require('smartweave')

require('dotenv').config()

const devWalletPath = path.resolve(__dirname, `../${process.env.DEV_WALLET}`)
const rawWallet = fs.readFileSync(devWalletPath)
const wallet = JSON.parse(rawWallet)

const srcPath = path.resolve(__dirname, '../build/ERC20Community.js')
const contractSrc = fs.readFileSync(srcPath)

const stateParams = {
  name: 'Jamm Session',
  description: 'Weekly newsletter on the intersection of creators and crypto',
  tokenAddress: '0x56687cf29Ac9751Ce2a4E764680B6aD7E668942e',
  owner: 'did:3:bafyreifwguegezv5kqnk3oym5e4mldwmfz6jmlb5yok2iglijs3urmze5a',
  imageTxId: 'RTkO3LLAPdghrgAtOBxvfxvxhfYWl0ek5tZgY2aXFds',
  defaultRequirements: {
    read: 1000,
    comment: 1000
  }
}

const initState = createTokenCommunityState(stateParams)

const initStateString = JSON.stringify(initState)

const arweave = Arweave.init({
  host: 'arweave.net',
  port: 443,
  protocol: 'https'
})

smartweave.createContract(arweave, wallet, contractSrc, initStateString).then((contractID) => {
  console.log('Contract created in TX: ' + contractID)
})
