
const state = {
  websocketMessage: "", // 端返回的信息
  socketTimestamp: new Date().getTime(), // 时间戳去监听数据的改变
  count: 0,
  audioUrl: require('@/assets/req_sound.mp3')
}

const mutations = {
  //websocket
  setSocketMessage(state, data) { // 一旦获取到端端返回的信息，就改变时间戳
    console.log('socket data mutation ', data)
    state.count = 1
    const audio = new Audio(state.audioUrl)
    audio.play()
    // state.websocketMessage = data
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
