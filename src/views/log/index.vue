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
      </el-date-picker>

      <el-select v-model="model" size="small" placeholder="请选择模型" style="margin-left: 10px; width: 150px">
        <el-option
          v-for="item in logFilter.model"
          :key="item.value"
          :label="item.name"
          :value="item.value">
        </el-option>
      </el-select>

      <el-select v-model="type" size="small" placeholder="请选择操作类型" style="margin-left: 10px; width: 150px">
        <el-option
          v-for="item in logFilter.type"
          :key="item.value"
          :label="item.name"
          :value="item.value">
        </el-option>
      </el-select> -->
       <el-input v-model="find_id" placeholder="查询id(可选）" size="small" clearable style="margin-left: 10px; width: 150px;"></el-input>

      <el-button icon="el-icon-search" type="text" size="medium" style="margin-left: 10px;" @click="getLoginRecord">搜索</el-button>
      <el-button icon="el-icon-refresh" type="text" size="medium" style="margin-left: 10px;" @click="getLoginRecord">刷新</el-button>
    </div>

    <!-- <div style="display: flex; justify-content: flex-start; margin: 5px 0 0 0;">
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
      :data="LoginList.record"
      element-loading-text="Loading"
      border
      fit
      height="720"
      highlight-current-row
    >
      <!-- <el-table-column label="操作" width="100" align="left">
        <template slot-scope="scope">
          <el-button slot="reference" size="medium" type="text" @click="updateLevel(scope.row)">更新</el-button>
        </template>
      </el-table-column> -->
      <el-table-column label="Id" show-overflow-tooltip width="130" align="center">
        <template slot-scope="scope">
          {{ scope.row.user_id }}
        </template>
      </el-table-column>
      <el-table-column label="帐号" show-overflow-tooltip width="150" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.account }}</span>
        </template>
      </el-table-column>
      <el-table-column label="登录ip" show-overflow-tooltip width="430" align="left">
        <template slot-scope="scope">
          <span>{{ scope.row.login_ip }}</span>
        </template>
      </el-table-column>

      <el-table-column label="创建时间" show-overflow-tooltip width="170" align="left">
        <template slot-scope="scope">
          <span>{{ scope.row.create_at }}</span>
        </template>
      </el-table-column>
    </el-table>

    <div v-if="LoginList.count">
    <Pagination style="float: right; margin-top: 20px; margin-right: -20px;" :background="true" :total="LoginList.count" :page.sync="page" :limit.sync="perPage" @pagination="PaginationEvent" />
    </div>

    <!-- <Update ref="updateRef" :level-data="levelData" @levelEmit="levelEmit"  /> -->
  </div>
</template>

<script>
import { getLogApi, getLogFilterApi } from '@/api/stock'
import { loginRecord } from '@/api/user'
import { mapState } from 'vuex'
import moment from 'moment'
// import Update from './action/edit.vue'
import Pagination from '@/components/Pagination'

export default {
  name: 'LogList',
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
    // Update
    Pagination
  },
  data() {
    return {
      list: null,
      listLoading: false,
      levelData: {},
      loading: false,
      toDate: '',
      fromDate: '',
      model: '',
      type: '',
      page: 1,
      perPage: 20,
      find_id:'',
      LoginList:{}
    }
  },
  computed: {
    ...mapState({
      logList: state => state.stock.logList,
      logFilter: state => state.stock.logFilter
    })
  },
  mounted() {
    this.getLoginRecord()
    // this.getLogFilter()
    // this.toDate = moment(new Date()).endOf('day').format('YYYY-MM-DD HH:mm:ss')
    // this.fromDate = moment(new Date()).startOf('day').format('YYYY-MM-DD HH:mm:ss')
    // setTimeout(() => {
    //   this.getLog()
    // }, 800)
  },
  methods: {
    refreshLog() {
      this.page = 1
      this.getLog()
    },
    getLoginRecord(){
    this.listLoading = true
    let data = {
      pageSize:this.perPage,
      currentPage:this.page,
      find_id:this.find_id
    }
    loginRecord(data).then(res => {
      console.log(data,"send data to api ")
        console.log('res ', res)
        if (res.success && res.code == 200) {
          this.LoginList =  res.data
          //this.$store.commit('stock/SET_LOG_LIST', res.data)
        }
        this.listLoading = false
      }).catch(e => {
        this.listLoading = false
      })
    },
    getLog() {
      // this.listLoading = true
      // let send_ = {
      //   fromDate: this.fromDate == '' ||  this.fromDate == null ? '' : moment(this.fromDate).format('YYYY-MM-DD HH:mm:ss'),
      //   toDate: this.toDate == '' || this.toDate == null ? '' :  moment(this.toDate).format('YYYY-MM-DD HH:mm:ss'),
      //   page: this.page,
      //   perPage: this.perPage
      // }
      // if (this.model !== '') {
      //   send_['model'] = this.model
      // }
      // if (this.type !== '') {
      //   send_['type'] = this.type
      // }
      // console.log('log send ', send_)
      // getLogApi(send_).then(res => {
      //   console.log('res ', res)
      //   if (res.success && res.code === 1000) {
      //     this.$store.commit('stock/SET_LOG_LIST', res.data)
      //   }
      //   this.listLoading = false
      // }).catch(e => {
      //   this.listLoading = false
      // })
    },

    getLogFilter() {
      // getLogFilterApi().then(res => {
      //   console.log('log filter res : ', res)
      //   if (res.success && res.code == 1000) {
      //     this.$store.commit('stock/SET_LOGFILTER_LIST', res.data)
      //   }
      // })
    },




    PaginationEvent(props) {
      this.handlePagination(props)
    },
    handlePagination(props) {
      props.action === 'limit' ? this.page = 1 : this.page = props.page
      this.perPage = props.limit
      this.getLoginRecord()
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
      this.getLog()
    }

  }
}
</script>
