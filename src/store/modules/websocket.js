import Vue from 'vue'
// import VueNativeSock from 'vue-native-websocket'
import { getToken } from '@/utils/auth'

const state = {
  ws: null,
  isConnected: false
}

const mutations = {
  SET_WEBSOCKET(state, value) {
    state.ws = value
  },
  SET_IS_CONNECTED(state, value) {
    state.isConnected = value
  }
}

const actions = {
  connectWebSocket({ commit }) {
    const token = encodeURI(getToken())
    const ws = new VueNativeSock(`wss://api.stockxsms.shop/websockets?key=A91DFH88SDIASX&token=${token}`, {
      format: 'json',
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 3000
    })

    ws.onopen = () => {
      commit('SET_IS_CONNECTED', true)
    }

    ws.onclose = () => {
      commit('SET_IS_CONNECTED', false)
    }

    commit('SET_WEBSOCKET', ws)
  },
  sendMessage({ state }, message) {
    if (state.isConnected) {
      state.ws.send(message)
    } else {
      console.log('WebSocket is not connected!')
    }
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
