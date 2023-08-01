
const state = {
  imageBase: 'https://stockxsms.oss-ap-southeast-1.aliyuncs.com',
  dashboard: {
    member_count: 0,
    today_add: 0,
    yesterday_redpack_count: 0,
    today_redpack_count: 0,
    all_redpack_count: 0,
    referral_score: 0,
    real_name_count: 0
  },
  showd: true,
  audioUrl: require('@/assets/req_sound.mp3'),
  rcount: '',
  wcount: '',
  userList: { record: [], count: 0 },
  funList: { record: [], count: 0 },
  loginList: { record: [], count: 0 },
  carouselList: { record: [], count: 0 },
  articleList: { record: [], count: 0 },
  optionList: { record: [], count: 0 },
  withdrawList: { list: [], total: 0 },
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
  SET_USER_LIST: (state, config) => {
    state.userList = config
  },
  SET_FUN_LIST: (state, config) => {
    state.funList = config
  },
  SET_LOGIN_LIST: (state, config) => {
    state.loginList = config
  },
  SET_CAROUSEL_LIST: (state, config) => {
    state.carouselList = config
  },
  SET_ARTICAL_LIST: (state, config) => {
    state.articleList = config
  },
  SET_OPTION_LIST: (state, config) => {
    state.optionList = config
  },
  SET_WITHDRAW_LIST: (state, config) => {
    state.withdrawList = config
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
