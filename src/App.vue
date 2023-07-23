<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
export default {
  name: 'App',
  mounted() {
    // this.initWebSocket()
  },
  methods: {
    ...mapMutations('ws', ['setSocketMessage']),
    // 初始化weosocket
    initWebSocket() {
      this.$socket.onopen = this.websocketonopen;//连接成功方法
      this.$socket.onerror = this.websocketonerror;//报错方法
      this.$socket.onmessage = this.websocketonmessage;// 接收端返回或推送信息的方法
      this.$socket.onclose = this.websocketclose;//关闭
      console.log('this.socket ', this.$socket)
    },
    // 链接ws服务器，e.target.readyState = 0/1/2/3   0 CONNECTING ,1 OPEN, 2 CLOSING, 3 CLOSED
    websocketonopen(e) {
      console.log('WebSocket连接成功,app.vue', e);
    },
    // 接收端发送过来的信息，整个项目接收信息的唯一入口
    websocketonmessage(e) {
      console.log('onmessage ============ ', e)
      if (!e.data) { return; }
      let res = JSON.parse(e.data);
      // if (res.error && res.error.code) { //返回失败信息
      //   this.$message.error({
      //     type: 'error',
      //     message: getTipCode(Number(res.error.code)),//匹配失败code的提示文案
      //   });
      // }
      //端返回成功信息
      if (res.type) {
        this.setSocketMessage(e.data)
        // switch (res.type) {
        //   case 'user-recharge':
        //     console.log("返回的客户端信息", res.data)
        //     break;
        //   case 'user-withdraw':
        //     console.log("返回的客户端信息", res.data)
        //     break;
        //   default:
        //     this.setSocketMessage(e.data);//把信息存到vuex里面，再分发到对应页面
        //     break;
        // }
      }
      //端主动发起的
      // if (res.method) {
      //   switch (res.method) {
      //     case 'loginOut':
      //       console.log("接收到消息，执行退出登录操作")
      //       break;
      //     case 'msgCenter':
      //       console.log("接收到消息，打开消息中心")
      //       this.$router.push('/noticeCenter');
      //       break;
      //     default:
      //       break;
      //   }
      // }
    }
  }
}
</script>
