/*
 * Remove cjs module lines that cause trouble for the SmartWeave SDK
 */

const fs = require('fs')
const path = require('path')

const CONTRACT_PATH = path.resolve(__dirname, '../../build/community.js')
const ERC20_CONTRACT = path.resolve(__dirname, '../../build/ERC20Community.js')

trim(CONTRACT_PATH)
trim(ERC20_CONTRACT)

function trim (path) {
  let contractSrc = fs.readFileSync(path, 'utf8')

  contractSrc = contractSrc.replace('Object.defineProperty(exports, \'__esModule\', { value: true });', '')
  contractSrc = contractSrc.replace('exports.handle = handle;', '')

  fs.writeFileSync(path, contractSrc)
}
