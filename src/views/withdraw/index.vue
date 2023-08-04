<template>
  <div class="app-container">

    <div style="display: flex; align-items: center;">
      <el-date-picker
        v-model="fromDate"
        type="datetime"
        size="medium"
        placeholder="选择日期时间">
      </el-date-picker>
      <span style="margin: 0 10px">至</span>
      <el-date-picker
        v-model="toDate"
        type="datetime"
        size="medium"
        placeholder="选择日期时间">
      </el-date-picker>

      <el-input v-model="find_id" placeholder="用户ID" size="medium" clearable style="margin-left: 10px; width: 150px;"></el-input>
      <el-input v-model="findname" placeholder="手机号" size="medium" clearable style="margin-left: 10px; width: 150px;"></el-input>

      <el-select v-model="type" size="medium" placeholder="状态" style="width: 150px; margin-left: 10px;">
        <el-option
          v-for="item in wd_type"
          :key="item.code"
          :label="item.name"
          :value="item.code">
        </el-option>
      </el-select>

      <el-button icon="el-icon-search" type="primary" size="medium" style="margin-left: 10px;" @click="getWithdrawRecord">搜索</el-button>
      <el-button icon="el-icon-refresh" type="primary" size="medium" style="margin-left: 10px;" @click="refreshLog">刷新</el-button>
    </div>

    <div style="display: flex; justify-content: flex-start; margin: 5px 0 0 0;">
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
      :data="withdrawList.record"
      element-loading-text="Loading"
      stripe
      border
      fit
      height="720"
      :header-cell-style="{ color: '', background: '#F5F5F5', padding: '5px' }"
      highlight-current-row
    >
      <el-table-column label="操作" width="100" align="left">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status == 1" size="small" type="text" @click="acceptWithdraw(scope.row)">通过</el-button>
          <el-button v-if="scope.row.status == 1" size="small" type="text" @click="rejectWthdraw(scope.row)">拒绝</el-button>
          <!-- <div v-if="scope.row.status == 1" style="color: green">已通过</div>
          <div v-if="scope.row.status == 2" style="color: red">已拒绝</div> -->
        </template>
      </el-table-column>
      <el-table-column label="ID" show-overflow-tooltip width="90" align="center">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="用户账号" show-overflow-tooltip width="130" align="center">
        <template slot-scope="scope">
          {{ scope.row.account }}
        </template>
      </el-table-column>
      <el-table-column label="提现金额" show-overflow-tooltip width="130" align="right">
        <template slot-scope="scope">
          <span>{{ scope.row.amount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="申请前余额" show-overflow-tooltip width="130" align="right">
        <template slot-scope="scope">
          <span>{{ scope.row.before_withdraw }}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单状态" show-overflow-tooltip width="130" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.status == 1">待审核</span>
          <span v-if="scope.row.status == 2" style="color: green">已通过</span>
          <span v-if="scope.row.status == 3" style="color: red">已拒绝</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="申请后余额" show-overflow-tooltip width="130" align="right">
        <template slot-scope="scope">
          <span>{{ scope.row.amount_to }}</span>
        </template>
      </el-table-column> -->
      <!-- <el-table-column label="姓名" show-overflow-tooltip width="100" align="left">
        <template slot-scope="scope">
          <span>{{ getBankInfo(scope.row.bank_info, 'realname') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="银行名称" show-overflow-tooltip width="130" align="left">
        <template slot-scope="scope">
          <span>{{ getBankInfo(scope.row.bank_info, 'bank_name') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="银行卡号" show-overflow-tooltip width="200" align="left">
        <template slot-scope="scope">
          <span>卡号: {{ getBankInfo(scope.row.bank_info, 'bank_card_id') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="IP" show-overflow-tooltip width="130" align="left">
        <template slot-scope="scope">
          <span>{{ scope.row.ip }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="申请时间" show-overflow-tooltip width="180" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.create_time | dateFilter }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="订单状态" show-overflow-tooltip width="230" align="left">
        <template slot-scope="scope">
          <span v-if="scope.row.status == 0">待处理</span>
          <span v-if="scope.row.status == 1" style="color: green">通过</span>
          <span v-if="scope.row.status == 2" style="color: red">拒绝</span>
        </template>
      </el-table-column> -->
      <!-- <el-table-column label="备注" show-overflow-tooltip width="230" align="left">
        <template slot-scope="scope">
          <span>{{ scope.row.comment }}</span>
        </template>
      </el-table-column> -->
    </el-table>

    <Pagination style="float: right; margin-top: 20px; margin-right: -20px;" :background="true" :total="withdrawList.count" :page.sync="pageNum" :limit.sync="pageSize" @pagination="PaginationEvent" />

    <Accept ref="acceptRef" :accept-data="acceptData" @withdrawEmit="withdrawEmit"  />
    <Reject ref="rejectRef" :reject-data="rejectData" @withdrawEmit="withdrawEmit"  />
  </div>
</template>

<script>
import { getWithdrawRecordApi } from '@/api/stock'
import { mapState } from 'vuex'
import moment from 'moment'
import Accept from './action/accept.vue'
import Reject from './action/reject.vue'
import Pagination from '@/components/Pagination'

export default {
  name: 'WithdrawList',
  filters: {
    // statusFilter(status) {
    //   const statusMap = {
    //     published: 'success',
    //     draft: 'gray',
    //     deleted: 'danger'
    //   }
    //   return statusMap[status]
    // }
    dateFilter(date) {
      if (date) {
        return moment(date).format('YYYY-MM-DD HH:mm:ss')
      }
      return ''
    }
  },
  components: {
    Accept,
    Reject,
    Pagination
  },
  data() {
    return {
      list: null,
      listLoading: false,
      acceptData: {},
      rejectData: {},
      loading: false,
      toDate: '',
      fromDate: '',
      find_id: '',
      findname: '',
      type: 'all',
      wd_type: [
        { code: 'all', name: '全部' },
        { code: 1, name: '待操作' },
        { code: 2, name: '批准' },
        { code: 3, name: '拒绝' },
      ],
      pageNum: 1,
      pageSize: 50,
    }
  },
  computed: {
    ...mapState({
      withdrawList: state => state.stock.withdrawList
    })
  },
  mounted() {
    this.toDate = moment(new Date()).endOf('day').format('YYYY-MM-DD HH:mm:ss')
    this.fromDate = moment(new Date()).startOf('day').format('YYYY-MM-DD HH:mm:ss')
    this.getWithdrawRecord()
  },
  methods: {
    refreshLog() {
      this.pageNum = 1
      this.getWithdrawRecord()
      this.checkUndoCount()
    },
    checkUndoCount() {
      // checkUndoApi().then(res => {
      //   // console.log('res ', res)
      //   if (res?.code == 0) {
      //     this.$store.commit('hoh/SET_UNDO', res?.data)
      //   }
      // })
    },
    getBankInfo(bank, need) {
      if (!bank || bank == '' || bank == null || bank == {} || bank == []) return ''
      let bank_ = JSON.parse(bank)
      return ' ' + bank_[need] + ' ' || ''
    },
    getWithdrawRecord() {
      this.listLoading = true
      let send_ = {
        // fromDate: this.fromDate == '' ||  this.fromDate == null ? '' : moment(this.fromDate).format('YYYY-MM-DD HH:mm:ss'),
        // toDate: this.toDate == '' || this.toDate == null ? '' :  moment(this.toDate).format('YYYY-MM-DD HH:mm:ss'),
        currentPage: this.pageNum,
        status: this.type == 'all' ? '' : this.type,
        pageSize: this.pageSize
      }

      if (this.find_id !== '') {
        send_['find_id'] = this.find_id
      }
      if (this.findname.trim() !== '') {
        send_['findname'] = this.findname.trim()
      }
      console.log('log send ', send_)
      getWithdrawRecordApi(send_).then(res => {
        console.log('res ', res)
        if (res.code == 200) {
          this.$store.commit('stock/SET_WITHDRAW_LIST', res.data)
        } else {
          this.$store.commit('stock/SET_WITHDRAW_LIST', {record: [], count: 0})
        }
        this.listLoading = false
      }).catch(e => {
        this.listLoading = false
      })
    },

    acceptWithdraw(row) {
      this.acceptData = JSON.parse(JSON.stringify(row))
      this.$nextTick(() => {
        this.$refs.acceptRef.dialogFormVisible = true
      })
    },

    rejectWthdraw(row) {
      this.rejectData = JSON.parse(JSON.stringify(row))
      this.$nextTick(() => {
        this.$refs.rejectRef.dialogFormVisible = true
      })
    },

    withdrawEmit(val) {
      if (val) {
        this.getWithdrawRecord()
        this.checkUndoCount()
      }
    },


    PaginationEvent(props) {
      this.handlePagination(props)
    },
    handlePagination(props) {
      props.action === 'limit' ? this.pageNum = 1 : this.pageNum = props.page
      this.pageSize = props.limit
      this.getWithdrawRecord()
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
      this.pageNum = 1
      this.getWithdrawRecord()
    }

  }
}
</script>
