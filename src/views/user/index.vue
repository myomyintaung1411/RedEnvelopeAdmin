<template>
  <div class="app-container">

    <div style="display: flex; align-items: center;">
      <!-- <el-date-picker
        v-model="fromDate"
        type="datetime"
        size="small"
        placeholder="选择日期时间">
      </el-date-picker>
      <span style="margin: 0 10px">至</span>
      <el-date-picker
        v-model="toDate"
        type="datetime"
        size="small"
        placeholder="选择日期时间">
      </el-date-picker> -->

      <el-input v-model="name" placeholder="用户账号" size="small" clearable style="width: 150px;"></el-input>
      <el-input v-model="phone" placeholder="手机号" size="small" clearable style="margin-left: 10px; width: 150px;"></el-input>

      <el-select v-model="status" size="small" placeholder="账号状态" style="margin-left: 10px; width: 150px;">
        <el-option
          v-for="item in status_type"
          :key="item.code"
          :label="item.name"
          :value="item.code">
        </el-option>
      </el-select>
      <el-select v-model="type" size="small" placeholder="账号类型" style="margin-left: 10px; width: 150px;">
        <el-option
          v-for="item in type_type"
          :key="item.code"
          :label="item.name"
          :value="item.code">
        </el-option>
      </el-select>

      <el-button icon="el-icon-search" type="text" size="medium" style="margin-left: 10px;" @click="getUser">搜索</el-button>
      <el-button icon="el-icon-refresh" type="text" size="medium" style="margin-left: 10px;" @click="refreshUser">刷新</el-button>
      <el-button icon="el-icon-plus" type="text" size="medium" style="margin-left: 10px;" @click="createUser">添加新用户</el-button>
    </div>
    
    <div style="margin: 10px;"></div>
    <el-table
      v-loading="listLoading"
      :data="userList.users"
      element-loading-text="Loading"
      border
      fit
      height="720"
      highlight-current-row
    >
      <el-table-column label="操作" min-width="300" align="left">
        <template slot-scope="scope">
          <el-button size="medium" type="text" @click="rechargeUser(scope.row)">上分</el-button>
          <el-button size="medium" type="text" @click="withdrawUser(scope.row)" style="margin-left: 10px;">下分</el-button>
          <el-button size="medium" type="text" @click="updateUser(scope.row)" style="margin-left: 10px;">更新</el-button>
          <el-button v-if="scope.row.id != 1" size="medium" type="text" @click="kadanSetting(scope.row)" style="margin-left: 10px;">幸运连单</el-button>

          <el-popconfirm v-if="scope.row.id != 1" title="您确定要取消连单吗？" @onConfirm="cancelKadan(scope.row)">
            <el-button v-if="scope.row.id != 1" slot="reference" size="medium" type="text" style="margin-left: 10px; color: red">取消连单</el-button>
          </el-popconfirm>

          <el-button v-if="scope.row.id != 1" size="medium" type="text" @click="resetCount(scope.row)" style="margin-left: 10px; margin-right: 10px;">重置单数</el-button>
          <el-button v-if="scope.row.id != 1" size="medium" type="text" @click="seeAddress(scope.row)" style="margin-left: 0px;">收货地址</el-button>
          <el-button v-if="scope.row.id != 1" size="medium" type="text" @click="seeBank(scope.row)" style="margin-left: 10px;">银行地址</el-button>

          <el-popconfirm v-if="scope.row.id != 1" title="您确定要删除吗？" @onConfirm="deleteUser(scope.row)">
            <el-button slot="reference" size="medium" type="text" style="color: red; margin-left: 10px;">删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
      <!-- <el-table-column label="用户ID" show-overflow-tooltip width="80" align="left">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column> -->
      <el-table-column label="头像" show-overflow-tooltip width="80" align="center">
        <template slot-scope="scope">
          <!-- <span>{{ scope.row.profile }}</span> -->
          <el-avatar size="medium" :src="imageBase+scope.row.profile"></el-avatar>
        </template>
      </el-table-column>
      <el-table-column label="账号" show-overflow-tooltip width="160" align="left">
        <template slot-scope="scope">
          <span>账号：{{ scope.row.name }}</span>
          <br>
          <span>邀请码：{{ scope.row.invite_code }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机号" show-overflow-tooltip width="180" align="left">
        <template slot-scope="scope">
          <span>手机：{{ scope.row.phone }}</span>
          <br>
          <span>飞机：{{ scope.row.telegram }}</span>
        </template>
      </el-table-column>
      <el-table-column label="当前余额" show-overflow-tooltip width="180" align="right">
        <template slot-scope="scope">
          <span>可用：{{ scope.row.balance | fixTwoFilter }} $</span>
          <br>
          <span style="color: gray">连单返佣：{{ scope.row.frozen_balance | fixTwoFilter }} $</span>
        </template>
      </el-table-column>
      <el-table-column label="接单数" show-overflow-tooltip width="90" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.order_reach_at <= 0 ? 0 : scope.row.order_reach_at }} / 30</span>
        </template>
      </el-table-column>
      <el-table-column label="幸运连单" show-overflow-tooltip width="110" align="center">
        <template slot-scope="scope">
          <span>开始：{{ scope.row.order_stuck_at == 0 ? 0 : scope.row.order_stuck_at - 1 }} - {{ scope.row.order_stuck_at }}</span>
          <br>
          <el-popover v-if="scope.row.UserStucks.length > 0" trigger="hover" placement="top">
            <div>
              幸运连单：{{ scope.row.total_stuck }}  &nbsp; 完成：{{ scope.row.stuck_reach_at }}
              <div v-for="(prod, i) in scope.row.UserStucks"  style="margin: 10px 0;">
                <div style="padding: 10px 20px; border-radius: 6px; border: 1px solid #dcdfe6;">
                  <span>产品名称： {{ prod.product == null ? '' : prod.product.name }}</span>
                  <br>
                  <span>产品价格： {{ prod.product == null ? '' : prod.product.amount }} $</span>
                </div>
              </div>
            </div>
            <div slot="reference" class="name-wrapper">
              <span style="cursor: pointer; color: blue;">完成：{{ scope.row.stuck_reach_at }} / {{ scope.row.total_stuck }}</span>
            </div>
          </el-popover>
          <span v-else>完成：{{ scope.row.stuck_reach_at }} / {{ scope.row.total_stuck }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="邀请码" show-overflow-tooltip width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.invite_code }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="等级" show-overflow-tooltip width="60" align="left">
        <template slot-scope="scope">
          <span>LV {{ scope.row.level }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="类型" show-overflow-tooltip width="80" align="left">
        <template slot-scope="scope">
          <span>{{ scope.row.type }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="状态" show-overflow-tooltip width="80" align="center">
        <template slot-scope="scope">
          <!-- <span>{{ scope.row.status }}
            active-text="启用"
            inactive-text="禁用"</span> -->
          <el-switch
            v-if="scope.row.id != 1"
            v-model="scope.row.status"
            :active-value="1"
            :inactive-value="0"
            @change="changeUserStatus(scope.row)"
          >
          </el-switch>
          <span v-else>启用</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="飞机号" show-overflow-tooltip width="130" align="left">
        <template slot-scope="scope">
          <span>{{ scope.row.telegram }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="接单状态" show-overflow-tooltip width="90" align="center">
        <template slot-scope="scope">
          <!-- <span>{{ scope.row.can_grab_order }}
            active-text="可以"
            inactive-text="禁止"</span> -->
          <el-switch
            v-if="scope.row.id != 1"
            v-model="scope.row.can_grab_order"
            :active-value="1"
            :inactive-value="0"
            @change="changeGrabStatus(scope.row)"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="上级" show-overflow-tooltip width="150" align="left">
        <template slot-scope="scope">
          <span v-if="scope.row.id != 1">ID：{{ scope.row.invitee_id }}</span>
          <br>
          <span v-if="scope.row.id != 1">账号：{{ scope.row.invitee == null ? '' : scope.row.invitee.name }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="上级ID" show-overflow-tooltip width="90" align="left">
        <template slot-scope="scope">
          <span v-if="scope.row.id != 1">{{ scope.row.invitee_id }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="注册时间" show-overflow-tooltip width="170" align="left">
        <template slot-scope="scope">
          <span>{{ scope.row.createdAt | dateFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="注册IP" show-overflow-tooltip width="150" align="left">
        <template slot-scope="scope">
          <span>{{ scope.row.register_ip }}</span>
        </template>
      </el-table-column>
    </el-table>

    <Pagination style="float: right; margin-top: 20px; margin-right: -20px;" :background="true" :total="userList.meta.total" :page.sync="page" :limit.sync="perPage" @pagination="PaginationEvent" />

    
    <!-- Reset Order -->
    <el-dialog
      v-el-drag-dialog
      title="重置单数"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
      width="400px"
      @close="onCancelReset"
    >
      <div style="width: 100%; display: flex; justify-content: center; font-size: 20px; align-items: center;">
        您确定要重置该会员的单数吗？
      </div>
      <div slot="footer">
        <el-button @click="onCancelReset()">取消</el-button>
        <el-button type="primary" :loading="loading" @click="onConfirmReset()">确认</el-button>
      </div>
    </el-dialog>
    <!-- Address Order -->
    <el-dialog
      v-el-drag-dialog
      title="收货地址列表"
      :visible.sync="showAddress"
      :close-on-click-modal="false"
      width="600px"
    >
        <div style="width: 100%; display: flex; justify-content: flex-start; flex-direction: column; align-items: flex-start; height: 500px; overflow-y: scroll;">
          <!-- {{ addressData }} -->
          <div v-for="addr in addressData" :key="addr.id" style="border-bottom: 1px dotted gray; width: 100%; line-height: 24px; color: #212121; margin-bottom: 18px;">
            <div>姓名：
              <span style="color: gray">{{ addr.name }}</span>
            </div>
            <div>手机号：
              <span style="color: gray">{{ addr.phone }}</span>
            </div>
            <div>地址详情：
              <span style="color: gray">{{ addr.address }}</span>
            </div>
            <br>
          </div>
        </div>
    </el-dialog>
    <!-- Bank Order -->
    <el-dialog
      v-el-drag-dialog
      title="已绑定银行卡列表"
      :visible.sync="showBank"
      :close-on-click-modal="false"
      width="600px"
    >
      <div style="width: 100%; display: flex; justify-content: flex-start; flex-direction: column; align-items: flex-start; height: 500px; overflow-y: scroll;">
        <!-- {{ bankData }} -->
        <div
          v-for="bank in bankData"
          :key="bank.id"
          style="border: 1px solid #ebeef5; transition: .3s; border-radius: 4px; box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
            padding: 20px; width: 100%; line-height: 24px; color: #212121; margin-bottom: 18px;"
          >
          <div>持卡人姓名：
            <span style="color: gray">{{ bank.holder_name }}</span>
          </div>
          <div>银行名称：
            <span style="color: gray">{{ bank.bank_name }}</span>
          </div>
          <div>卡号：
            <span style="color: gray">{{ bank.account }}</span>
          </div>
          <div>创建时间：
            <span style="color: gray">{{ TranDate(bank.createdAt) }}</span>
          </div>
          <div>备注：
            <span style="color: gray">{{ bank.remark }}</span>
          </div>
        </div>
      </div>
    </el-dialog>


    <Create ref="createRef" @userEmit="userEmit"  />
    <Update ref="updateRef" :update-data="updateData" @userEmit="userEmit"  />
    <KaDan ref="kadanRef" :kd-data="kdData" @userEmit="userEmit"  />
    <Recharge ref="rechargeRef" :recharge-data="rechargeData" @userEmit="userEmit"  />
    <Withdraw ref="withdrawRef" :withdraw-data="withdrawData" @userEmit="userEmit"  />
  </div>
</template>

<script>
import elDragDialog from '@/directive/el-drag-dialog'
import { getUserApi, changeUserStatusApi, deleteUserApi, resetOrderApi, changeGrabOrderApi, addressesApi, banksApi, cancelStuckOrderApi } from '@/api/stock'
import { mapState, mapGetters } from 'vuex'
import moment from 'moment'
import Create from './action/create.vue'
import Update from './action/edit.vue'
import KaDan from './action/kadan.vue'
import Recharge from './action/recharge.vue'
import Withdraw from './action/withdraw.vue'
import Pagination from '@/components/Pagination'

export default {
  name: 'UserList',
  filters: {
    fixTwoFilter(amount) {
      return Number(amount.toFixed(2))
    },
    dateFilter(date) {
      if (date) {
        return moment(date).format('YYYY-MM-DD HH:mm:ss')
      }
      return ''
    }
  },
  directives: { elDragDialog },
  components: {
    Update,
    Create,
    Recharge,
    Withdraw,
    KaDan,
    Pagination,
  },
  data() {
    return {
      list: null,
      listLoading: false,
      dialogFormVisible: false,
      showAddress: false,
      showBank: false,
      status_type: [
        { code: '-1', name: '全部' },
        { code: 1, name: '启用' },
        { code: 0, name: '禁用' }
      ],
      status: '-1',
      type_type: [
        { code: 0, name: '管理员' },
        { code: 1, name: '会员' }
      ],
      type: 1,
      phone: '',
      name: '',
      updateData: {},
      rechargeData: {},
      withdrawData: {},
      addressData: {},
      bankData: {},
      kdData: {},
      loading: false,
      toDate: '',
      fromDate: '',
      page: 1,
      perPage: 10
    }
  },
  computed: {
    ...mapState({
      userList: state => state.stock.userList
    }),
    ...mapGetters(['imageBase'])
  },
  mounted() {
    this.toDate = moment(new Date()).endOf('day').format('YYYY-MM-DD HH:mm:ss')
    this.fromDate = moment(new Date()).startOf('day').format('YYYY-MM-DD HH:mm:ss')
    this.getUser()
  },
  methods: {
    refreshUser() {
      this.page = 1
      this.getUser()
    },
    TranDate(date) {
      if (date == '') return ''
      return moment(date).format('YYYY-MM-DD HH:mm:ss')
    },
    getUser() {
      this.listLoading = true
      let send_ = {
        // fromDate: this.fromDate,
        // toDate: this.toDate,
        page: this.page,
        perPage: this.perPage
      }
      if (this.status !== '') {
        send_['status'] = this.status
      }
      if (this.type !== '') {
        send_['type'] = this.type
      }
      if (this.phone.trim() !== '') {
        send_['phone'] = this.phone.trim()
      }
      if (this.name.trim() !== '') {
        send_['name'] = this.name.trim()
      }
      console.log('send ', send_)
      getUserApi(send_).then(res => {
        console.log('res ', res)
        if (res.success && res.code === 1000) {
          this.$store.commit('stock/SET_USER_LIST', res.data)
        }
        this.listLoading = false
      }).catch(e => {
        this.listLoading = false
      })
    },

    createUser() {
      this.$nextTick(() => {
        this.$refs.createRef.dialogFormVisible = true
      })
    },

    rechargeUser(row) {
      this.rechargeData = JSON.parse(JSON.stringify(row))
      this.$nextTick(() => {
        this.$refs.rechargeRef.dialogFormVisible = true
      })
    },

    kadanSetting(row) {
      this.kdData = JSON.parse(JSON.stringify(row))
      this.$nextTick(() => {
        this.$refs.kadanRef.dialogFormVisible = true
      })
    },

    cancelKadan(row) {
      this.listLoading = true
      cancelStuckOrderApi(row.id).then(res => {
        console.log('res ', res)
        if (res.success && res.code === 1000) {
          // this.$store.commit('stock/SET_USER_LIST', res.data)
          this.$message.success('取消成功')
          this.getUser()
        }
        this.listLoading = false
      }).catch(e => {
        this.listLoading = false
      })
    },

    withdrawUser(row) {
      this.withdrawData = JSON.parse(JSON.stringify(row))
      this.$nextTick(() => {
        this.$refs.withdrawRef.dialogFormVisible = true
      })
    },

    updateUser(row) {
      this.updateData = JSON.parse(JSON.stringify(row))
      this.$nextTick(() => {
        this.$refs.updateRef.dialogFormVisible = true
      })
    },

    resetCount(row) {
      this.resetData = JSON.parse(JSON.stringify(row))
      this.$nextTick(() => {
        this.dialogFormVisible = true
      })
    },

    onCancelReset() {
      this.resetData = {}
      this.dialogFormVisible = false
    },
    onConfirmReset() {
      resetOrderApi(this.resetData.id).then(res => {
        console.log('reset res ', res)
        if (res.code === 1000 && res.success) {
          this.$message.success('重置成功')
          this.dialogFormVisible = false
          this.getUser()
        } else {
          if (res.errors !== null) {
            console.log(res.errors)
            let key = Object.keys(res?.errors)[0]
            this.$message.error(res?.errors[key])
          } else {
            this.$message.error(res.message)
          }
        }
      }).catch(err => {
        console.error(err)
        this.loading = false
      })
    },

    seeAddress(row) {
      this.addressData = {}
      this.getAddress(row)
    },
    getAddress(row) {
      addressesApi(row.id).then(res => {
        console.log('getAddress res ', res)
        if (res.code === 1000 && res.success) {
          // this.$message.success('查询成功')
          this.addressData = res.data
          if (this.addressData.length > 0) {
            this.showAddress = true
          } else {
            this.$message.info('该会员未绑定收货地址')
          }
        } else {
          if (res.errors !== null) {
            console.log(res.errors)
            let key = Object.keys(res?.errors)[0]
            this.$message.error(res?.errors[key])
          } else {
            this.$message.error(res.message)
          }
        }
      }).catch(err => {
        console.error(err)
        this.loading = false
      })
    },
    seeBank(row) {
      this.bankData = {}
      this.getBank(row)
    },
    getBank(row) {
      banksApi(row.id).then(res => {
        console.log('getBank res ', res)
        if (res.code === 1000 && res.success) {
          // this.$message.success('查询成功')
          // this.getUser()
          this.bankData = res.data
          if (this.bankData.length > 0) {
            this.showBank = true
          } else {
            this.$message.info('该会员未绑定银行卡信息')
          }
        } else {
          if (res.errors !== null) {
            console.log(res.errors)
            let key = Object.keys(res?.errors)[0]
            this.$message.error(res?.errors[key])
          } else {
            this.$message.error(res.message)
          }
        }
      }).catch(err => {
        console.error(err)
        this.loading = false
      })
    },

    userEmit(emit) {
      if (emit) {
        this.getUser()
      }
    },


    deleteUser(row) {
      deleteUserApi(row.id).then(res => {
        console.log('delete res ', res)
        if (res.code === 1000 && res.success) {
          this.$message.success('删除成功')
          this.getUser()
        } else {
          if (res.errors !== null) {
            console.log(res.errors)
            let key = Object.keys(res?.errors)[0]
            this.$message.error(res?.errors[key])
          } else {
            this.$message.error(res.message)
          }
        }
      }).catch(err => {
        console.error(err)
        this.loading = false
      })
    },


    changeUserStatus(row) {
      console.log('row ', row.status)
      let status = row.status
      let send_ = {
        status: status
      }
      changeUserStatusApi({ data: send_, id: row.id }).then(res => {
        if (res.success && res.code == 1000) {
          this.$message.success('更新成功')
          this.getUser()
        } else {
          if (res.errors !== null) {
            let key = Object.keys(res?.errors)[0]
            this.$message.error(res?.errors[key])
          } else {
            this.$message.error(res.message)
          }
        }
      }).catch(e => {
        console.error('e: changeUserStatus: ', e)
      })
    },

    changeGrabStatus(row) {
      console.log('row ', row.status)
      let status = row.can_grab_order
      let send_ = {
        status: status
      }
      changeGrabOrderApi({ data: send_, id: row.id }).then(res => {
        if (res.success && res.code == 1000) {
          this.$message.success('更新成功')
          this.getUser()
        } else {
          if (res.errors !== null) {
            let key = Object.keys(res?.errors)[0]
            this.$message.error(res?.errors[key])
          } else {
            this.$message.error(res.message)
          }
        }
      }).catch(e => {
        console.error('e: changeUserStatus: ', e)
      })
    },


    PaginationEvent(props) {
      this.handlePagination(props)
    },
    handlePagination(props) {
      props.action === 'limit' ? this.page = 1 : this.page = props.page
      this.perPage = props.limit
      this.getUser()
    },

  }
}
</script>
