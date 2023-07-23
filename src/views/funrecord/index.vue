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

      <el-input v-model="find_id" placeholder="查询id(可选）" size="small" clearable style="margin-left: 10px; width: 150px;"></el-input>

     
      <el-button icon="el-icon-search" type="text" size="medium" style="margin-left: 10px;" @click="getOrderSearch">搜索</el-button>
      <el-button icon="el-icon-refresh" type="text" size="medium" style="margin-left: 10px;" @click="refreshOrder">刷新</el-button>
    </div>

    <!-- <div style="display: flex; justify-content: flex-start; margin: 10px 0 0 0;">
      <el-button size="small" type="text" @click="selectDate('1')">今日</el-button>
      <el-button size="small" type="text" @click="selectDate('2')">昨日</el-button>
      <el-button size="small" type="text" @click="selectDate('3')">本周</el-button>
      <el-button size="small" type="text" @click="selectDate('4')">上周</el-button>
      <el-button size="small" type="text" @click="selectDate('5')">本月</el-button>
      <el-button size="small" type="text" @click="selectDate('6')">上月</el-button>
    </div> -->
    
    <div style="margin: 5px;"></div>
    <el-table
      v-loading="listLoading"
      :data="fundData.record"
      element-loading-text="Loading"
      border
      fit
      height="720"
      highlight-current-row
    >
      <el-table-column label="ID" show-overflow-tooltip width="70" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.user_id }}</span>
        </template>
      </el-table-column>

      <el-table-column label="类型" show-overflow-tooltip width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.type }}</span>
        </template>
      </el-table-column>

      <el-table-column label="描述" show-overflow-tooltip width="130" align="center">
        <template slot-scope="scope">
          {{ scope.row.content }}
        </template>
      </el-table-column>
      <el-table-column label="资金变化前" show-overflow-tooltip width="150" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.before_change }}</span>
        </template>
      </el-table-column>
      <el-table-column label="资金变化后" show-overflow-tooltip width="150" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.after_change }}</span>
        </template>
      </el-table-column>


      <!-- <el-table-column label="比例" show-overflow-tooltip width="90" align="right">
        <template slot-scope="scope">
          <span>{{ scope.row.profit_rate }} %</span>
        </template>
      </el-table-column> -->




      <el-table-column label="抢单日期" show-overflow-tooltip width="170" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.create_at }}</span>
        </template>
      </el-table-column>

    
    </el-table>
    <div v-if="fundData.count > 0">
    <Pagination style="float: right; margin-top: 20px; margin-right: -20px;" :background="true" :total="fundData.count" :page.sync="page" :limit.sync="perPage" @pagination="PaginationEvent" />
    </div>
  </div>
</template>

<script>
import elDragDialog from '@/directive/el-drag-dialog'
import { funRecord } from '@/api/user'
import { mapState, mapGetters } from 'vuex'
import moment from 'moment'
// import Update from './action/edit.vue'
import Pagination from '@/components/Pagination'

export default {
  name: 'OrderList',
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
        return moment(date).format("YYYY-MM-DD HH:mm:ss")
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
      loading: false,
      page: 1,
      perPage: 20,
      toDate: '',
      fromDate: '',
      find_id:'',
      fundData:{}
    }
  
  },
  computed: {
    // ...mapState({
    //   orderList: state => state.stock.orderList,
    // }),
   // ...mapGetters(['imageBase'])
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
      this.getFundRecord()
    }, 800)
  },
  methods: {

    refreshOrder() {
      this.page = 1
      this.getFundRecord()
    },
    getOrderSearch() {
      this.page = 1
      this.getFundRecord()
    },
    getFundRecord(){
            let send_ = {
        start_time: this.fromDate == '' ||  this.fromDate == null ? '' : moment(this.fromDate).format('YYYY-MM-DD HH:mm:ss'),
        end_time: this.toDate == '' || this.toDate == null ? '' :  moment(this.toDate).format('YYYY-MM-DD HH:mm:ss'),
        pageSize:this.perPage,
        currentPage:this.page,
       type:"",
       find_id:this.find_id
      }
      funRecord(send_).then(res => {
        console.log('res of fund recored data ********', res)
        if (res.success && res.code == 200) {
          this.fundData = res.data
          //this.$store.commit('stock/SET_ORDER_LIST', res.data)
        }
        this.listLoading = false
      }).catch(e => {
        this.listLoading = false
      })
    },
    getOrder() {
      // this.listLoading = true
      // let send_ = {
      //   fromDate: this.fromDate == '' ||  this.fromDate == null ? '' : moment(this.fromDate).format('YYYY-MM-DD HH:mm:ss'),
      //   toDate: this.toDate == '' || this.toDate == null ? '' :  moment(this.toDate).format('YYYY-MM-DD HH:mm:ss'),
      //   page: this.page,
      //   perPage: this.perPage,
      //   is_continuous: this.is_continuous,
      //   is_finished: this.is_finished
      // }
      // if (this.phone !== '') {
      //   send_['phone'] = this.phone
      // }
      // if (this.order_number !== '') {
      //   send_['order_number'] = this.order_number
      // }
      // ordersApi(send_).then(res => {
      //   console.log('res ', res)
      //   if (res.success && res.code === 1000) {
      //     this.$store.commit('stock/SET_ORDER_LIST', res.data)
      //   }
      //   this.listLoading = false
      // }).catch(e => {
      //   this.listLoading = false
      // })
    },


    PaginationEvent(props) {
      this.handlePagination(props)
    },
    handlePagination(props) {
      props.action === 'limit' ? this.page = 1 : this.page = props.page
      this.perPage = props.limit
      this.getFundRecord()
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
      this.getOrder()
    }

  }
}
</script>
