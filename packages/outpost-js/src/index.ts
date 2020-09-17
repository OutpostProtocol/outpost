export const CONTRACT_SRC = 'a3vdjXrmSyF6zrSOO-ddeXuGuWpJ-3SCfOWkh9ms4cY'
export const PROD_CONTRACT_ID = 'BXCEBKTv-Fvan0m82aEi7njdnRsFDluFkfN8vrWG5FI'
export const DEV_CONTRACT_ID = 'tynArDso6PKe7h1uRfu8jS7XHhTYRJQhqVRExAi0bqU'

interface InitialState {
  name: string
  owner: string
  tokenAddress: string
  defaultRequirements?: Partial<requirements>
  imageTxId?: string
  description?: string
}

interface requirements {
  read: number
  comment: number
  post: number
}

export function createInitState (defaults: InitialState) {
  const initState = {
    name: defaults.name,
    owner: defaults.owner,
    tokenAddress: defaults.tokenAddress,
    defaultRequirements: defaults.defaultRequirements || {},
    imageTxId: defaults.imageTxId || null,
    description: defaults.description || null,
    upgradedContract: null,
    timestamps: {}
  }

  return initState
}
