<template>
  <div class="main_wrap">
    <div style="width: 100%; height: 50px; background-color: #f5f7fa">
      <div style="padding-top: 13px; padding-left: 20px">
  
        <span>
          欢迎代理:
          <span style="color: red; padding: 0 5px">{{ info.name }}</span>
        </span>
        <span>
          当前时间:
          <span style="color: red; padding: 0 5px">{{ time_now }}</span>
        </span>
      </div>
    </div>
    <div style="padding-top: 10px;">
      <fieldset style="border: 1px solid #dfdfdf">
        <legend
          style="
            margin-left: 20px;
            font-size: 20px;
            color: #080808;
            font-weight: 300;
            padding: 0 10px;
          "
        >
          我的信息
        </legend>
        <el-row :gutter="10" style="padding: 10px;">
          <el-col :span="4">
            <el-card shadow="hover">
              <div style="display: flex; flex-direction: column">
                <span style="padding-bottom: 5px; color: #808080; font-size: 14px">账号</span>
                <span style="font-size: 22px; color: #1060b1">{{info.name}}</span>
              </div>
            </el-card>
          </el-col>
          <el-col :span="4">
            <!-- <el-card shadow="hover">
              <div style="display: flex; flex-direction: column">
                <span style="padding-bottom: 5px; color: #808080; font-size: 14px">手机号</span>
                <span style="font-size: 22px; color: #1060b1">{{info.phone}}</span>
              </div>
            </el-card> -->
          </el-col>
          <el-col :span="4">
            <el-card shadow="hover">
              <div style="display: flex; flex-direction: column">
                <span style="padding-bottom: 5px; color: #808080; font-size: 14px">余额</span>
                <span style="font-size: 22px; color: #1060b1">{{info.gx.replace('^','')}}</span>
              </div>
            </el-card>
          </el-col>
          <el-col :span="4">
            <el-card shadow="hover">
              <div style="display: flex; flex-direction: column">
                <span style="padding-bottom: 5px; color: #808080; font-size: 14px">等级</span>
                <span style="font-size: 22px; color: #1060b1">管理员</span>
                <!-- <span style="font-size: 22px; color: #1060b1">{{ m.level }}</span> -->
              </div>
            </el-card>
          </el-col>
          <el-col :span="4">
            <el-card shadow="hover">
              <div style="display: flex; flex-direction: column">
                <span style="padding-bottom: 5px; color: #808080; font-size: 14px">状态</span>
                <span style="font-size: 22px; color: #1060b1">{{'正常'}}</span>
              </div>
            </el-card>
          </el-col>
          <el-col :span="4">
            <el-card shadow="hover">
              <div style="display: flex; flex-direction: column">
                <span style="padding-bottom: 5px; color: #808080; font-size: 14px">邀请码</span>
                <span style="font-size: 22px; color: #1060b1">{{info.invitation_code || '.'}}</span>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </fieldset>

      <!-- <el-button @click="getNewMember">Get New Member</el-button>  -->

       <el-card style="margin-top: 30px">
        <div style="position: relative; display: flex;">
            <el-button size="medium" icon="el-icon-refresh" type="text" @click="getDashboard">刷新</el-button>
        </div>

        <div style="margin-top: 20px">
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-card shadow="hover">
                    <div style="display: flex; flex-direction: column">
                        <span style="padding-bottom: 5px; color: #808080; font-size: 26px">会员总数</span>
                        <span style="font-size: 24px; color: #009688">{{ dash.member_count }}</span>
                    </div>
                    </el-card>
                </el-col>
                <el-col :span="12">
                    <el-card shadow="hover">
                        <div style="display: flex; flex-direction: column">
                            <span style="padding-bottom: 5px; color: #808080; font-size: 26px">今日新增</span>
                            <span style="font-size: 24px; color: #F44336">{{ dash.today_add }}</span>
                        </div>
                        </el-card>
                </el-col>
            </el-row>
            <br>
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-card shadow="hover">
                    <div style="display: flex; flex-direction: column">
                        <span style="padding-bottom: 5px; color: #808080; font-size: 26px">昨日签到</span>
                        <span style="font-size: 24px; color: #FF9800">{{ dash.yesterday_redpack_count }}</span>
                    </div>
                    </el-card>
                </el-col>
                <el-col :span="8">
                  <el-card shadow="hover">
                    <div style="display: flex; flex-direction: column">
                        <span style="padding-bottom: 5px; color: #808080; font-size: 26px">当日签到</span>
                        <span style="font-size: 24px; color: #9C27B0">{{ dash.today_redpack_count }}</span>
                    </div>
                    </el-card>
                </el-col>
                <el-col :span="8">
                    <el-card shadow="hover">
                    <div style="display: flex; flex-direction: column">
                        <span style="padding-bottom: 5px; color: #808080; font-size: 26px">所有签到</span>
                        <span style="font-size: 26px; color: #669800">{{ dash.all_redpack_count }}</span>
                    </div>
                    </el-card>
                </el-col>
            </el-row>
            <br>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-card shadow="hover">
                    <div style="display: flex; flex-direction: column">
                        <span style="padding-bottom: 5px; color: #808080; font-size: 26px">推荐积分</span>
                        <span style="font-size: 26px; color: #669800">{{ dash.referral_score }}</span>
                    </div>
                    </el-card>
                </el-col>
                <el-col :span="12">
                    <el-card shadow="hover">
                    <div style="display: flex; flex-direction: column">
                        <span style="padding-bottom: 5px; color: #808080; font-size: 26px">实名人数</span>
                        <span style="font-size: 26px; color: #669800">{{ dash.real_name_count }}</span>
                    </div>
                    </el-card>
                </el-col>
            </el-row>
        </div>
        
      </el-card> 

      <Alert ref="alder" />
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import moment from 'moment'
import { getDashboardApi } from "@/api/stock";
import Alert from '@/layout/components/Notice.vue'

export default {
  components: {
    Alert
  },
  data() {
    return {
      time_now: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      timer: null,
      interval: null
    }
  },
  computed: {
      ...mapState({
        dash: state => state.stock.dashboard,
        //showd: state => state.stock.showd,
        //conws: state => state.wsuse.connected
      }),
      ...mapGetters(['info', 'token'])
  },
  mounted() {
    this.getDashboard()
    // clearInterval(this.interval)
    // this.interval = null

    // this.interval = setInterval(() => {
    //   if (this.conws) {
    //     this.$store.dispatch('wsuse/sendMessage', {type: 'GET_RECHARGE_PENDING_COUNT'})
    //     this.$store.dispatch('wsuse/sendMessage', {type: 'GET_WITHDRAWAL_PENDING_COUNT'})
    //   } else {
    //     this.$store.dispatch('wsuse/connect', `wss://api.stockxsms.shop/websockets?key=A91DFH88SDIASX&token=${this.token}`)
    //   }
    // }, 5000)
  },
  // beforeDestroy() {
  //   // 清除定时器
  //   clearInterval(this.interval)
  //   this.interval = null
  // },
  watch: {
    // 监听到端有返回信息
    // socketTimestamp(old, newVal) {
    //   this.handleMessage(this.$store.state.ws.websocketMessage);
    // }
  },
  beforeDestroy() {
    clearInterval(this.interval)
    this.interval = null
    if (this.timer) {
      clearInterval(this.timer) // 在Vue实例销毁前，清除我们的定时器
    }
  },
  methods: {
    TranDate() {
      return moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
    },
    getDashboard() {
      getDashboardApi().then((res) => {
          // console.log('hhhhhhhhhhhhhhhhhhhhhh', res)
        if (res.success && res.code == 200) {
          // this.$router.push({ path: this.redirect || '/' })
          this.$store.commit('stock/SET_DASHBOARD', res.data)
        }
      }).catch((e) => {
        console.log('eeeeeeeeeee ', e)
          this.$message.error(e)
      })
    }
  }
};
</script>

<style lang="scss">
.main_wrap {
  padding: 20px;
}
</style>















<!-- 
<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }}</div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name'
    ])
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style> -->
