import { profileApi, loginApi, logoutApi } from '@/api/user'
import { getToken, setToken, removeToken,getInfo,setInfo } from '@/utils/auth'
import { resetRouter } from '@/router'
import md5 from "js-md5";

// import Vue from 'vue'
// import VueNativeSock from 'vue-native-websocket'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    info: getInfo() || {},
    socket: null
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_INFO: (state, info) => {
    state.info = info
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  }
}
//, recaptcha: recaptcha
const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password , recaptcha } = userInfo
    return new Promise((resolve, reject) => {
      loginApi({ username: username, password: md5(password) }).then(response => {
        console.log(response,"hhhh")
        const { data } = response
        commit('SET_TOKEN', data.token)
        commit('SET_INFO', data)
        setInfo(data)
        setToken(data.token)
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      profileApi(state.token).then(response => {
        const { data } = response

        if (!data) {
          return reject('Verification failed, please Login again.')
        }
        console.log(this)
        // this.$socket.connect('ws://182.255.62.173:7878/websockets', {
        //   headers: {
        //     key: 'A91DFH88SDIASX',
        //     token: state.token
        //   },
        //   format: 'json',
        //   reconnection: true,
        //   reconnectionAttempts: 5,
        //   reconnectionDelay: 3000,
        // })
        // state.socket = new VueNativeSock('ws://182.255.62.173:7878/websockets', {
        //   headers: {
        //     key: 'A91DFH88SDIASX',
        //     token: state.token
        //   },
        //   format: 'json',
        //   reconnection: true,
        //   reconnectionAttempts: 5,
        //   reconnectionDelay: 3000,
        // })

        const { name, profile } = data
        commit('SET_INFO', data)
        commit('SET_NAME', name)
        commit('SET_AVATAR', profile)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    // return new Promise((resolve, reject) => {
    //   logoutApi().then(() => {
    //     removeToken() // must remove  token  first
    //     resetRouter()
    //     commit('RESET_STATE')
    //     resolve()
    //   }).catch(error => {
    //     reject(error)
    //   })

    // })
    return new Promise((resolve, reject) => {
      // Simulating asynchronous operations without actual API calls
      setTimeout(() => {
        // Remove the token (simulated async operation)
        // For this example, assume the token removal was successful
        const tokenRemoved = true;
  
        if (tokenRemoved) {
          // Assuming resetRouter and commit are synchronous operations
          removeToken()
          resetRouter();
          commit('RESET_STATE');
  
          resolve(); // Resolve the promise if everything succeeds
        } else {
          // If token removal fails, reject the promise with an error
          reject(new Error('Failed to remove the token.'));
        }
      }, 500); // Simulate a 1-second delay for the async operation
    });
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

