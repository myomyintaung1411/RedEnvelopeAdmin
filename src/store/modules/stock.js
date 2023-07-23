
const state = {
  imageBase: 'https://stockxsms.oss-ap-southeast-1.aliyuncs.com',
  dashboard: {},
  showd: true,
  audioUrl: require('@/assets/req_sound.mp3'),
  rcount: '',
  wcount: '',
  configList: [],
  bannerList: [],
  levelList: [],
  productList: {products: [], meta: {page: 1, perPage: 10, total: 0, totalPage: 0}},
  logList: {logs: [], meta: {page: 1, perPage: 10, total: 0, totalPage: 0}},
  logFilter: { model: [], type: [] },
  transactionList: {logs: [], meta: {page: 1, perPage: 10, total: 0, totalPage: 0}},
  transactionListWithdraw: {logs: [], meta: {page: 1, perPage: 10, total: 0, totalPage: 0}},
  transactionList004: {logs: [], meta: {page: 1, perPage: 10, total: 0, totalPage: 0}},
  transactionList005: {logs: [], meta: {page: 1, perPage: 10, total: 0, totalPage: 0}},
  transactionFilter: { recharge_type: [], status: [], type: [], withdraw_type: [] },
  rewardList: { rewards: [], meta: {page: 1, perPage: 10, total: 0, totalPage: 0}},
  messageList: { messages: [], meta: {page: 1, perPage: 10, total: 0, totalPage: 0}},
  userList: { users: [], meta: {page: 1, perPage: 10, total: 0, totalPage: 0}},
  orderList: { orders: [], meta: {page: 1, perPage: 10, total: 0, totalPage: 0}},
}

const mutations = {
  SET_RC_COUNT: (state, config) => {
    if (state.rcount != config) {
      const audio = new Audio(state.audioUrl)
      audio.play()
    }
    state.rcount = config == 0 ? '' : config
  },
  SET_WD_COUNT: (state, config) => {
    if (state.wcount != config) {
      const audio = new Audio(state.audioUrl)
      audio.play()
    }
    state.wcount = config == 0 ? '' : config
  },
  SET_DASHBOARD: (state, config) => {
    state.dashboard = config
  },
  SET_CONFIG_LIST: (state, config) => {
    state.configList = config
  },
  SET_BANNER_LIST: (state, config) => {
    state.bannerList = config
  },
  SET_LEVEL_LIST: (state, config) => {
    state.levelList = config
  },
  SET_PRODUCT_LIST: (state, config) => {
    state.productList = config
  },
  SET_LOG_LIST: (state, config) => {
    state.logList = config
  },
  SET_LOGFILTER_LIST: (state, config) => {
    state.logFilter = config
  },
  SET_TRANSACTION_LIST: (state, config) => {
    state.transactionList = config
  },
  SET_TRANSACTION_LIST_W: (state, config) => {
    state.transactionListWithdraw = config
  },
  SET_TRANSACTION_LIST_004: (state, config) => {
    state.transactionList004 = config
  },
  SET_TRANSACTION_LIST_005: (state, config) => {
    state.transactionList005 = config
  },
  SET_TRANSACTIONFILTER_LIST: (state, config) => {
    state.transactionFilter = config
  },
  SET_REWARD_LIST: (state, config) => {
    state.rewardList.rewards = config
  },
  SET_MESSAGE_LIST: (state, config) => {
    state.messageList = config
  },
  SET_USER_LIST: (state, config) => {
    state.userList = config
  },
  SET_ORDER_LIST: (state, config) => {
    state.orderList = config
  },
}

const actions = {
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
