import * as functionTypes from 'outpost-js/functionTypes'
import { OTHER_COMMUNITY, NEW_NAME, UPDATED_GUIDELINES_ADDR } from '../helpers/constants'

const interactions = {
  access: {
    close: {
      function: functionTypes.SET_ACCESS,
      isOpen: false
    },
    open: {
      function: functionTypes.SET_ACCESS,
      isOpen: true
    }
  },
  children: {
    add: {
      function: functionTypes.ADD_CHILD,
      communityId: OTHER_COMMUNITY
    },
    remove: {
      function: functionTypes.REMOVE_CHILD,
      communityId: OTHER_COMMUNITY
    }
  },
  ownership: {
    function: functionTypes.TRANSFER_OWNERSHIP // must specifiy did in test
  },
  admins: {
    add: {
      function: functionTypes.ADMIN_ADD
    },
    remove: {
      function: functionTypes.ADMIN_REMOVE
    }
  },
  moderators: {
    add: {
      function: functionTypes.MOD_ADD
    },
    remove: {
      function: functionTypes.MOD_REMOVE
    }
  },
  members: {
    add: {
      function: functionTypes.MEMBER_ADD
    },
    remove: {
      function: functionTypes.MEMBER_REMOVE
    }
  },
  setName: {
    function: functionTypes.SET_NAME,
    name: NEW_NAME
  },
  setGuidelines: {
    function: functionTypes.SET_GUIDELINES,
    guidelines: UPDATED_GUIDELINES_ADDR
  }
}

export default interactions
