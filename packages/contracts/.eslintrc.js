module.exports = {
  root: true,
  extends: 'standard',
  env: {
    node: true,
    es6: true
  },
  globals: {
    ContractError: 'readonly',
    ContractAssert: 'readonly',
    SmartWeave: 'readonly',
    BigNumber: 'readonly'
  }
}
