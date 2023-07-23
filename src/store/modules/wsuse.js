const state = {
  websocket: null,
  connected: false,
  rcount: '',
  wcount: '',
  audioUrl: require('@/assets/req_sound.mp3'),
}

const mutations = {
  setWebsocket(state, websocket) {
    state.websocket = websocket
  },
  setConnected(state, connected) {
    state.connected = connected
  },
  SET_RC_COUNT: (state, config) => {
    if (state.rcount != config && state.rcount < config) {
      const audio = new Audio(state.audioUrl)
      audio.play()
    }
    state.rcount = config == 0 ? '' : config
  },
  SET_WD_COUNT: (state, config) => {
    if (state.wcount != config && state.wcount < config) {
      const audio = new Audio(state.audioUrl)
      audio.play()
    }
    state.wcount = config == 0 ? '' : config
  },
}

const actions = {
  connect({ commit, dispatch }, url) {
    const websocket = new WebSocket(url)
    websocket.onopen = () => {
      commit('setConnected', true)
    }
    websocket.onmessage = (data) => {
      console.log('onmessage ============ ', data)
      if (!data.data) { return; }
      let res = JSON.parse(data.data);
      console.log('res ', res)
      //端返回成功信息
      if (res.type == 'user-recharge') {
        // this.setSocketMessage(data.data)
        commit('SET_RC_COUNT', res?.data?.count || 0)
      }
      if (res.type == 'user-withdrawal' || res.type == 'user-withdraw') {
        // this.setSocketMessage(data.data)
        commit('SET_WD_COUNT', res?.data?.count || 0)
      }
    }
    websocket.onclose = (reason) => {
      console.log('ws close reason: ', reason)
      commit('setConnected', false)
      // dispatch('reconnect')
    }
    commit('setWebsocket', websocket)
  },
  reconnect({ state, dispatch }) {
    setTimeout(() => {
      dispatch('connect', state.websocket.url)
    }, 5000)
  },
  sendMessage({ state }, message) {
    state.websocket.send(JSON.stringify(message))
  },
}

const getters = {
  websocket: (state) => state.websocket,
  connected: (state) => state.connected,
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
}