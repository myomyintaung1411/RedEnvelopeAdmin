<template>
  <div class="app-container">

    <div style="display: flex; align-items: center;">
      <el-date-picker
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
      </el-date-picker>

      <el-input v-model="name" placeholder="用户账号" size="small" clearable style="margin-left: 10px; width: 150px;"></el-input>

      <el-input v-model="phone" placeholder="手机号" size="small" clearable style="margin-left: 10px; width: 150px;"></el-input>

      <el-input v-model="reference_number" placeholder="订单号" size="small" clearable style="margin-left: 10px; width: 150px;"></el-input>

      <!-- <el-select v-model="type" size="small" placeholder="订单类型" style="margin-left: 10px; width: 150px;" @change="onTypeChange">
        <el-option
          v-for="item in typeType"
          :key="item.code"
          :label="item.name"
          :value="item.code">
        </el-option>
      </el-select> -->

      <!-- <el-select v-model="recharge_type" size="small" placeholder="充值类型" style="margin-left: 10px; width: 150px;">
        <el-option
          v-for="item in tranFilter.recharge_type"
          :key="item.code"
          :label="item.name"
          :value="item.code">
        </el-option>
      </el-select> -->

      <!-- <el-select v-model="withdraw_type" size="small" placeholder="提现类型" style="margin-left: 10px; width: 150px;">
        <el-option
          v-for="item in tranFilter.withdraw_type"
          :key="item.code"
          :label="item.name"
          :value="item.code">
        </el-option>
      </el-select>

      <el-select v-model="status" size="small" placeholder="订单状态" style="margin-left: 10px; width: 130px;">
        <el-option
          v-for="item in tranFilter.status"
          :key="item.code"
          :label="item.name"
          :value="item.code">
        </el-option>
      </el-select> -->

      <el-button icon="el-icon-search" type="text" size="medium" style="margin-left: 10px;" @click="getTransactionSearch">搜索</el-button>
      <el-button icon="el-icon-refresh" type="text" size="medium" style="margin-left: 10px;" @click="refreshTransaction">刷新</el-button>
    </div>

    <div style="display: flex; justify-content: flex-start; margin: 10px 0 0 0;">
      <el-button size="small" type="text" @click="selectDate('1')">今日</el-button>
      <el-button size="small" type="text" @click="selectDate('2')">昨日</el-button>
      <el-button size="small" type="text" @click="selectDate('3')">本周</el-button>
      <el-button size="small" type="text" @click="selectDate('4')">上周</el-button>
      <el-button size="small" type="text" @click="selectDate('5')">本月</el-button>
      <el-button size="small" type="text" @click="selectDate('6')">上月</el-button>
    </div>
    
    <div style="margin: 5px;"></div>
    <el-table
      v-loading="listLoading"
      :data="transactionList.logs"
      element-loading-text="Loading"
      border
      fit
      height="720"
      highlight-current-row
    >
      <!-- <el-table-column label="操作" width="120" align="left">
        <template slot-scope="scope">
          <el-button slot="reference" size="medium" :disabled="scope.row.status !== 0" type="text" @click="doTran(scope.row, 'accept')">通过</el-button>
          <el-button slot="reference" size="medium" :disabled="scope.row.status !== 0" type="text" @click="doTran(scope.row, 'deny')"
            :style="scope.row.status == 0 ? 'color: red' : ''">拒绝</el-button>
        </template>
      </el-table-column> -->
      <!-- <el-table-column label="订单号" show-overflow-tooltip width="120" align="left">
        <template slot-scope="scope">
          <span>{{ scope.row.order_id }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="产生账号" show-overflow-tooltip width="170" align="left">
        <template slot-scope="scope">
          <span>账号：{{ scope.row.effect_user == null ? '' : scope.row.effect_user.name }}</span>
          <br>
          <span>手机：{{ scope.row.effect_user == null ? '' : scope.row.effect_user.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="收益账号" show-overflow-tooltip width="170" align="left">
        <template slot-scope="scope">
          <span>账号：{{ scope.row.user == null ? '' : scope.row.user.name }}</span>
          <br>
          <span>手机：{{ scope.row.user == null ? '' : scope.row.user.phone }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="手机号" show-overflow-tooltip width="150" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.user == null ? '' : scope.row.user.phone }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="类型" show-overflow-tooltip width="150" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.type === '000'">{{ TranShow('TRAN_RECHARGE_TYPE', scope.row.recharge_type) }}</span>
          <span v-if="scope.row.type === '001'">{{ TranShow('TRAN_WITHDRAW_TYPE', scope.row.withdrawal_type) }}</span>
          <span>{{ TranShow('TRAN_TYPE', scope.row.type) }} </span>
        </template>
      </el-table-column>
      <el-table-column label="金额" show-overflow-tooltip width="150" align="right">
        <template slot-scope="scope">
          <span v-if="scope.row.amount < 0" style="color: red">{{ scope.row.amount }} $</span>
          <span v-else style="color: green">{{ scope.row.amount }} $</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="订单状态" show-overflow-tooltip width="130" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.status == 0">{{ '待处理' }}</span>
          <span v-if="scope.row.status == 1" style="color: green">{{ '已通过' }}</span>
          <span v-if="scope.row.status == 2" style="color: red">{{ '已拒绝' }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="订单号" show-overflow-tooltip width="150" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.reference_number }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="充值支付凭证图" show-overflow-tooltip width="150" align="center">
        <template slot-scope="scope">
          <el-image
            v-if="scope.row.type === '000'"
            style="width: 30px; height: 20px"
            :src="imageBase+scope.row.screenshot" 
            :preview-src-list="[imageBase+scope.row.screenshot]">
          </el-image>
        </template>
      </el-table-column> -->
      <el-table-column label="日期" show-overflow-tooltip width="170" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createdAt | dateFilter }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="更新时间" show-overflow-tooltip width="150" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.updatedAt }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="备注" show-overflow-tooltip min-width="150" align="left">
        <template slot-scope="scope">
          <span>{{ scope.row.remark }}</span>
        </template>
      </el-table-column>
    </el-table>

    <Pagination style="float: right; margin-top: 20px; margin-right: -20px;" :background="true" :total="transactionList.meta.total" :page.sync="page" :limit.sync="perPage" @pagination="PaginationEvent" />


    <!-- <el-dialog
      v-el-drag-dialog
      :title="action == 'accept' ? '通过订单' : '拒绝订单'"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
      width="400px"
      @close="onCancel"
    >

    <div style="width: 100%; display: flex; justify-content: center; flex-direction: column; font-size: 16px; align-items: flex-start;">
      <div :style="action == 'accept' ? 'color: green;' : 'color: red;' ">
        {{ `您确认要${showText}申请的充值订单吗?` }}
      </div>
      <br>
      <div>
        <span>账号：{{ doData.user == null ? '' : doData.user.name }}</span>
        <br>
        <br>
        <span>手机号：{{ doData.user == null ? '' : doData.user.phone }}</span>
        <br>
        <br>
        <span>申请金额：{{ doData.amount }} $</span>
      </div>
    </div>

    <div slot="footer">
      <el-button @click="onCancel()">取消</el-button>
      <el-button type="primary" :loading="loading" @click="onConfirm()">确认</el-button>
    </div>
  </el-dialog> -->

    <!-- <Update ref="updateRef" :level-data="levelData" @levelEmit="levelEmit"  /> -->
  </div>
</template>

<script>
import elDragDialog from '@/directive/el-drag-dialog'
import { getTransactionApi, getTransactionFilterApi, approveTransactionApi, denyTransactionApi } from '@/api/stock'
import { mapState, mapGetters } from 'vuex'
import moment from 'moment'
import { TRAN_TYPE, TRAN_RECHARGE_TYPE, TRAN_STATUS, TRAN_WITHDRAW_TYPE } from './const'
// import Update from './action/edit.vue'
import Pagination from '@/components/Pagination'

export default {
  name: 'TransList005',
  directives: { elDragDialog },
  filters: {
  //   statusFilter(status) {
  //     const statusMap = {
  //       published: 'success',
  //       draft: 'gray',
  //       deleted: 'danger'
  //     }
  //     return statusMap[status]
  //   }
    dateFilter(date) {
      if (date) {
        return moment(date).format('YYYY-MM-DD HH:mm:ss')
      }
      return ''
    }
  },
  components: {
    // Update
    Pagination
  },
  data() {
    return {
      dialogFormVisible: false,
      list: null,
      listLoading: false,
      levelData: {},
      loading: false,
      page: 1,
      perPage: 30,
      toDate: '',
      fromDate: '',
      name: '',
      phone: '',
      reference_number: '',
      recharge_type: '',
      withdraw_type: '',
      status: '',
      type: '005',

      showText: '',
      action: '',
      doData: {},
      typeType: [
        {code: '000', name: '充值'},
        {code: '001', name: '提现'},
      ]
    }
  
  },
  computed: {
    ...mapState({
      transactionList: state => state.stock.transactionList005,
      tranFilter: state => state.stock.transactionFilter
    }),
    ...mapGetters(['imageBase'])
  },
  mounted() {
    // var routerParams = this.$route.params
    // console.log('routerParams ... ', routerParams)
    // if (routerParams.type !== undefined) {
    //   if (routerParams.type == 2) {
    //     this.withdraw_type = 0
    //     this.type = '001'
    //   }
    //   if (routerParams.type == 1) {
    //     this.recharge_type = 0
    //     this.type = '000'
    //   }
    // }
    // if (this.tranFilter.recharge_type.length == 0) {
    //   this.getTransactionFilter()
    // }
    this.toDate = moment(new Date()).endOf('day').format('YYYY-MM-DD HH:mm:ss')
    this.fromDate = moment(new Date()).startOf('day').subtract(1, 'weeks').format('YYYY-MM-DD HH:mm:ss')

    setTimeout(() => {
      this.getTransaction()
    }, 800)
  },
  methods: {
    getParams() {
      
    },

    getTransactionSearch() {
      this.page = 1
      this.getTransaction()
    },

    TranShow(cont, data) {
      cont = cont == 'TRAN_TYPE' ? TRAN_TYPE : cont == 'TRAN_RECHARGE_TYPE' ? TRAN_RECHARGE_TYPE : cont == 'TRAN_WITHDRAW_TYPE' ? TRAN_WITHDRAW_TYPE : ''
      return cont[data]
    },

    refreshTransaction() {
      this.page = 1
      this.getTransaction()
    },
    getTransaction() {
      this.listLoading = true
      let send_ = {
        fromDate: this.fromDate == '' ||  this.fromDate == null ? '' : moment(this.fromDate).format('YYYY-MM-DD HH:mm:ss'),
        toDate: this.toDate == '' || this.toDate == null ? '' :  moment(this.toDate).format('YYYY-MM-DD HH:mm:ss'),
        page: this.page,
        perPage: this.perPage
      }
      if (this.phone !== '') {
        send_['phone'] = this.phone
      }
      if (this.name !== '') {
        send_['name'] = this.name
      }
      if (this.reference_number !== '') {
        send_['reference_number'] = this.reference_number
      }
      // if (this.recharge_type !== '') {
      //   send_['recharge_type'] = this.recharge_type
      // }
      // if (this.withdraw_type !== '') {
      //   send_['withdraw_type'] = this.withdraw_type
      // }
      if (this.status !== '') {
        send_['status'] = this.status
      }
      if (this.type !== '') {
        send_['type'] = this.type
      }
      getTransactionApi(send_).then(res => {
        console.log('res ', res)
        if (res.success && res.code === 1000) {
          this.$store.commit('stock/SET_TRANSACTION_LIST_005', res.data)
        }
        this.listLoading = false
      }).catch(e => {
        this.listLoading = false
      })
    },

    // getTransactionFilter() {
    //   getTransactionFilterApi().then(res => {
    //     console.log('Transaction filter res : ', res)
    //     if (res.success && res.code == 1000) {
    //       this.$store.commit('stock/SET_TRANSACTIONFILTER_LIST', res.data)
    //     }
    //   })
    // },

    doTran(row, action) {
      this.action = ''
      this.doData = {}

      this.action = action
      this.doData = JSON.parse(JSON.stringify(row))

      if (this.action === 'accept') {
        this.showText = `通过` 
      }

      if (this.action === 'deny') {
        this.showText = `拒绝` 
      }
      
      this.$nextTick(() => {
        this.dialogFormVisible = true
      })
    },

    onCancel() {
      this.action = ''
      this.showText = ''
      this.doData = {}
      this.dialogFormVisible = false
    },
    onConfirm() {
      if (this.action == '') return this.$message.error('未选择订单！')
      if (this.doData == '') return this.$message.error('请选择订单后操作！')
      if (this.doData?.status !== 0) return this.$message.error('该订单已处理过！')
      if (this.action === 'accept') {
        this.onAccept()
      }

      if (this.action === 'deny') {
        this.onDeny()
      }
      
    },


    onAccept() {
      if (this.doData.id == undefined || this.doData.id == null || this.doData.id == '') return this.$message.error('请选择订单后操作！')
      approveTransactionApi(this.doData.id).then(res => {
        if (res.success && res.code == 1000) {
          this.$message.success(res.message)
          this.onCancel()
          this.getTransaction()
          // console.log('ssssssssssss ', this.$socket)
          this.$socket.sendObj({type: 'GET_RECHARGE_PENDING_COUNT'})
          this.$socket.sendObj({type: 'GET_WITHDRAWAL_PENDING_COUNT'})
        } else {
          if (res.errors !== null) {
            let key = Object.keys(res?.errors)[0]
            this.$message.error(res?.errors[key])
          } else {
            this.$message.error(res.message)
          }
        }
      })
    },

    onDeny() {
      if (this.doData.id == undefined || this.doData.id == null || this.doData.id == '') return this.$message.error('请选择订单后操作！')
      denyTransactionApi(this.doData.id).then(res => {
        if (res.success && res.code == 1000) {
          this.$message.success(res.message)
          this.onCancel()
          this.getTransaction()
          // console.log('ssssssssssss ', this.$socket)
          this.$socket.sendObj({type: 'GET_RECHARGE_PENDING_COUNT'})
          this.$socket.sendObj({type: 'GET_WITHDRAWAL_PENDING_COUNT'})
        } else {
          if (res.errors !== null) {
            let key = Object.keys(res?.errors)[0]
            this.$message.error(res?.errors[key])
          } else {
            this.$message.error(res.message)
          }
        }
      })
    },

    onTypeChange(e) {
      this.page = 1
      this.getTransaction()
    },




    PaginationEvent(props) {
      this.handlePagination(props)
    },
    handlePagination(props) {
      props.action === 'limit' ? this.page = 1 : this.page = props.page
      this.perPage = props.limit
      this.getTransaction()
    },

    selectDate(time) {
      switch (time) {
        case '1':
          // 获取今日的开始和结束时间
          this.fromDate = moment().startOf('day').format('YYYY-MM-DD HH:mm:ss')
          this.toDate = moment().endOf('day').format('YYYY-MM-DD HH:mm:ss')
          break
        case '2':
          // 获取昨日的开始和结束时间
          this.fromDate = moment().subtract(1, 'day').startOf('day').format('YYYY-MM-DD HH:mm:ss')
          this.toDate = moment().subtract(1, 'day').endOf('day').format('YYYY-MM-DD HH:mm:ss')
          break
        case '3':
          // 获取本周的开始和结束时间
          this.fromDate = moment().startOf('week').format('YYYY-MM-DD HH:mm:ss')
          this.toDate = moment().endOf('week').format('YYYY-MM-DD HH:mm:ss')
          break
        case '4':
          // 获取上周的开始和结束时间
          this.fromDate = moment().subtract(1, 'week').startOf('week').format('YYYY-MM-DD HH:mm:ss')
          this.toDate = moment().subtract(1, 'week').endOf('week').format('YYYY-MM-DD HH:mm:ss')
          break
        case '5':
          // 获取本月的开始和结束时间
          this.fromDate = moment().startOf('month').format('YYYY-MM-DD HH:mm:ss')
          this.toDate = moment().endOf('month').format('YYYY-MM-DD HH:mm:ss')
          break
        case '6':
          // 获取上月的开始和结束时间
          this.fromDate = moment().subtract(1, 'month').startOf('month').format('YYYY-MM-DD HH:mm:ss')
          this.toDate = moment().subtract(1, 'month').endOf('month').format('YYYY-MM-DD HH:mm:ss')
          break
      }
      this.page = 1
      this.getTransaction()
    }

  }
}
</script>
