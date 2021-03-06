export const OWNER = 'did:3:bafyreiewjn5bc7ntxy4ug4a6fhwynjir4vqhb4fdoqfztfbvju5ooguofu'
export const OTHER_COMMUNITY = 'gvqSWUdeCAub91VKJ6_1yVIvqIAVOgVJXv68ozhFawc' // 'RaSbcDvwLwkauh_1O2BBzyBZ-Onu_LzGzcB7p-7GGXs'

export const DID_PINNING_ADDR = '/dnsaddr/ipfs.3box.io/tcp/443/wss/ipfs/QmZvxEpiVNjmNbEKyQGvFzAY1BwmGuuvdUTmcTstQPhyVC'

export const PROD_NAME = 'Outpost'
export const PROD_OWNER = 'did:3:bafyreiagk6hlbhdnu5glvllprgflwxib3xz4l35lb74ictkwhicgbnvf6e'

export const DEV_NAME = 'Dev-Testing'
export const NEW_NAME = 'NEW-DEV-NAME'
export const UPDATED_GUIDELINES_ADDR = {
  image: 'PHklvhennSoQNpEg5tEmz06DjvdF7A-2t9OyMUxaj1I',
  url: 'https://someurl.com',
  description: 'foo foo foo'
}
export const IS_OPEN = true

export const fullState = {
  name: 'Dev-Testing',
  isOpen: true,
  guidelines: null,
  owner:
   OWNER,
  admins:
   {
     OWNER: true,
     'did:3:bafyreiemia3l2kswmdntoq6uk47nckhsb6fgttz5jjbzjcbvmcp3hwdmre': true
   },
  moderators:
   {
     OWNER: true,
     'did:3:bafyreih2biuj37p367i3sxebqivykdpehn27zplojoirj3wni4tgauonby': true
   },
  members:
   {
     OWNER: true,
     'did:3:bafyreibz7ewyabj4xdaik4mn2xot6bmnyvmjsgdm4ldacpg7k7ji2hpjhm': true,
     'did:3:bafyreifmak4zyruqtfkythxx3nvclphzftcyaq2kjhjzchjink5xjxrnii': true
   },
  children: {},
  timestamps: {}
}

export const testKeys = [
  '0x2f03bbd84a197aac98e0e15c6b41ce0135725a02a30e07e2355e27ecf95bf91d',
  '0x900c8bf6d4848f99dc8fb2c65954c786478fbbe9a3a0ab0e4d3843e787761463',
  '0x945acd117f27c8c75184ba74a49186c39c44b4cf296c969ff8384ce32967c00b',
  '0xb4dc42f2b339a688ab2a335ef6d4d7c67de019a4023a87295f7baff7e329c060',
  '0x53e45087bb8ba4a52aea2df4be0986e0065f70bdb99fc138e086de4a66a144ff',
  '0x6e88827f409751df108d2047076a41c99654f682c5dc75ceacbed157d0ca83e8',
  '0xec6caf23a637fe5db8addb2cb10573fc883e91e8fdf334bb7d5f8cfb415a0ef3',
  '0xbb878e72f775890580dd02a8f3fe81d2908152acf4f8f57996708d57059ce089',
  '0x5cf6d7f3910f18d720c1d900c7913b9e7d6676299ee1379feb0451b55d65e43b',
  '0xad60a821491cff10c77cc096c5bc3874d24944b7880a7b8e10fca1f9f4180ecd'
]
