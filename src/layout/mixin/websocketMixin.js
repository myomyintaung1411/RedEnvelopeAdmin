import VueNativeSock from 'vue-native-websocket'

export const websocketMixin = {
  sockets: {
    connect: function () {
      console.log('WebSocket connected')
    },
    message: function (data) {
      console.log('WebSocket message received:', data)
    }
  },

  created() {
    const token = this.$store.getters['auth/token']

    this.$options.sockets = {
      url: 'ws://localhost:3000',
      query: {
        token: token
      }
    }
  },

  methods: {
    sendMessage(message) {
      this.$socket.send(message)
    }
  },

  destroyed() {
    this.$socket.close()
  }
}

Vue.mixin(websocketMixin)
