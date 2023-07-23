import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'
import stock from './modules/stock'
import websocket from './modules/websocket'
import wsuse from './modules/wsuse'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    settings,
    user,
    stock,
    websocket,
    wsuse
  },
  getters
})

export default store
