<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" />
<!-- 
    <el-badge :value="rcount" style="margin-top: 8px; margin-left: 20px;">
      <el-button size="medium" type="text" @click="goTo(1)">未处理充值</el-button>
    </el-badge>

    <el-badge :value="wcount" style="margin-top: 8px; margin-left: 20px;">
      <el-button size="medium" type="text" @click="goTo(2)">未处理提现</el-button>
    </el-badge> -->

    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <!-- <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar"> -->
          <div style="cursor: pointer;">{{ info.name }}</div>
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          
          <!-- <router-link to="/">
            <el-dropdown-item>
              Home
            </el-dropdown-item>
          </router-link>
          <a target="_blank" href="https://github.com/PanJiaChen/vue-admin-template/">
            <el-dropdown-item>Github</el-dropdown-item>
          </a>
          <a target="_blank" href="https://panjiachen.github.io/vue-element-admin-site/#/">
            <el-dropdown-item>Docs</el-dropdown-item>
          </a> -->
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">登出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  data() {
    return {
      interval: null
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'info',
      'token'
    ]),
    ...mapState({
      wcount: state => state.wsuse.wcount,
      rcount: state => state.wsuse.rcount,
      conws: state => state.wsuse.connected
    })
  },
  mounted() {
    // let token = encodeURI(this.token)

    // clearInterval(this.interval)
    // this.interval = null

    // this.interval = setInterval(() => {
    //   if (this.conws) {
    //     this.$store.dispatch('wsuse/sendMessage', {type: 'GET_RECHARGE_PENDING_COUNT'})
    //     this.$store.dispatch('wsuse/sendMessage', {type: 'GET_WITHDRAWAL_PENDING_COUNT'})
    //   } else {
    //     this.$store.dispatch('wsuse/connect', `wss://api.stockxsms.shop/websockets?key=A91DFH88SDIASX&token=${token}`)
    //   }
    // }, 5000)

  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      //this.$store.state.wsuse.connected = false
      //this.$store.state.wsuse.websocket = null
      this.$router.push(`/login`) // ?redirect=${this.$route.fullPath}
      // window.location.reload(true)
    },
    goTo(type) {
      if (type == 1) {
        this.$router.push({
          name: 'TransList',
          params: {
            type: type
          }
        })
      } else {
        this.$router.push({
          name: 'TransListWithdraw',
          params: {
            type: type
          }
        })
      }
      
    },
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
