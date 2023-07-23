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

      <el-button icon="el-icon-search" type="text" size="medium" style="margin-left: 10px;" @click="getMessage">搜索</el-button>
      <el-button icon="el-icon-refresh" type="text" size="medium" style="margin-left: 10px;" @click="refreshMessage">刷新</el-button>
      <el-button icon="el-icon-plus" type="text" size="medium" style="margin-left: 10px;" @click="createMessage">添加公告</el-button>
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
      :data="messageList.messages"
      element-loading-text="Loading"
      border
      fit
      height="720"
      highlight-current-row
    >
      <el-table-column label="操作" width="100" align="left">
        <template slot-scope="scope">
          <el-button slot="reference" size="medium" type="text" @click="updateMessage(scope.row)">更新</el-button>

          <el-popconfirm title="您确定要删除吗？" @onConfirm="deleteMessage(scope.row)">
            <el-button slot="reference" size="medium" type="text" style="color: red; margin-left: 10px;">删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
      <el-table-column label="ID" show-overflow-tooltip width="90" align="left">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="公告标题" show-overflow-tooltip width="330" align="left">
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="公告内容" show-overflow-tooltip min-width="430" align="left">
        <template slot-scope="scope">
          <span>{{ scope.row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" show-overflow-tooltip width="160" align="left">
        <template slot-scope="scope">
          <span>{{ scope.row.createdAt }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" show-overflow-tooltip width="160" align="left">
        <template slot-scope="scope">
          <span>{{ scope.row.updatedAt }}</span>
        </template>
      </el-table-column>
    </el-table>

    <Pagination style="float: right; margin-top: 20px; margin-right: -20px;" :background="true" :total="messageList.meta.total" :page.sync="page" :limit.sync="perPage" @pagination="PaginationEvent" />

    <Create ref="createRef" @messageEmit="messageEmit"  />
    <Update ref="updateRef" :update-data="updateData" @messageEmit="messageEmit"  />
  </div>
</template>

<script>
import { getMessageApi, deleteMessageApi } from '@/api/stock'
import { mapState } from 'vuex'
import moment from 'moment'
import Create from './action/create.vue'
import Update from './action/edit.vue'
import Pagination from '@/components/Pagination'

export default {
  // filters: {
  //   statusFilter(status) {
  //     const statusMap = {
  //       published: 'success',
  //       draft: 'gray',
  //       deleted: 'danger'
  //     }
  //     return statusMap[status]
  //   }
  // },
  components: {
    Update,
    Create,
    Pagination,
  },
  data() {
    return {
      list: null,
      listLoading: false,
      updateData: {},
      loading: false,
      toDate: '',
      fromDate: '',
      page: 1,
      perPage: 10
    }
  },
  computed: {
    ...mapState({
      messageList: state => state.stock.messageList
    })
  },
  mounted() {
    this.toDate = moment(new Date()).endOf('day').format('YYYY-MM-DD HH:mm:ss')
    this.fromDate = moment(new Date()).startOf('day').format('YYYY-MM-DD HH:mm:ss')
    this.getMessage()
  },
  methods: {
    refreshMessage() {
      this.page = 1
      this.getMessage()
    },
    getMessage() {
      this.listLoading = true
      let send_ = {
        fromDate: this.fromDate == '' ||  this.fromDate == null ? '' : moment(this.fromDate).format('YYYY-MM-DD HH:mm:ss'),
        toDate: this.toDate == '' || this.toDate == null ? '' :  moment(this.toDate).format('YYYY-MM-DD HH:mm:ss'),
        page: this.page,
        perPage: this.perPage
      }
      getMessageApi(send_).then(res => {
        console.log('res ', res)
        if (res.success && res.code === 1000) {
          this.$store.commit('stock/SET_MESSAGE_LIST', res.data)
        }
        this.listLoading = false
      }).catch(e => {
        this.listLoading = false
      })
    },

    createMessage() {
      this.$nextTick(() => {
        this.$refs.createRef.dialogFormVisible = true
      })
    },

    updateMessage(row) {
      this.updateData = JSON.parse(JSON.stringify(row))
      this.$nextTick(() => {
        this.$refs.updateRef.dialogFormVisible = true
      })
    },

    messageEmit(emit) {
      if (emit) {
        this.getMessage()
      }
    },


    deleteMessage(row) {
      deleteMessageApi(row.id).then(res => {
        console.log('delete res ', res)
        if (res.code === 1000 && res.success) {
          this.$message.success('删除成功')
          this.getMessage()
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


    PaginationEvent(props) {
      this.handlePagination(props)
    },
    handlePagination(props) {
      props.action === 'limit' ? this.page = 1 : this.page = props.page
      this.perPage = props.limit
      this.getMessage()
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
      this.getMessage()
    }

  }
}
</script>
