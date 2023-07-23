<template>
  <div class="app-container">

    <div style="display: flex;">
      <el-button icon="el-icon-refresh" type="text" size="medium" @click="getReward">刷新</el-button>
    </div>
    
    <div style="margin: 10px;"></div>
    <el-table
      v-loading="listLoading"
      :data="rewardList.rewards"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <!-- <el-table-column align="left" label="ID" width="75">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column> -->
      <el-table-column label="操作" width="100" align="left">
        <template slot-scope="scope">
          <el-button slot="reference" size="medium" type="text" @click="updateReward(scope.row)">更新</el-button>
        </template>
      </el-table-column>
      <el-table-column label="等级" show-overflow-tooltip width="130" align="center">
        <template slot-scope="scope">
          LV {{ scope.row.level }}
        </template>
      </el-table-column>
      <el-table-column label="名称" show-overflow-tooltip width="150" align="right">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="返佣比例" show-overflow-tooltip width="230" align="right">
        <template slot-scope="scope">
          <span>{{ scope.row.commission }} %</span>
        </template>
      </el-table-column>
      <el-table-column label="添加时间" show-overflow-tooltip width="230" align="right">
        <template slot-scope="scope">
          <span>{{ TranDate(scope.row.createdAt) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="最后更新时间" show-overflow-tooltip width="230" align="right">
        <template slot-scope="scope">
          <span>{{ TranDate(scope.row.updatedAt) }}</span>
        </template>
      </el-table-column>
    </el-table>

    <Update ref="updateRef" :reward-data="rewardData" @rewardEmit="rewardEmit"  />
  </div>
</template>

<script>
import { getRewardApi } from '@/api/stock'
import { mapState } from 'vuex'
import Update from './action/edit.vue'
import moment from 'moment'

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
    Update
  },
  data() {
    return {
      list: null,
      listLoading: true,
      rewardData: {},
      loading: false
    }
  },
  computed: {
    ...mapState({
      rewardList: state => state.stock.rewardList
    })
  },
  created() {
    this.getReward()
  },
  methods: {
    TranDate(date) {
      if (date == '') return ''
      return moment(date).format('YYYY-MM-DD HH:mm:ss')  
    },
    getReward() {
      this.listLoading = true
      getRewardApi().then(res => {
        console.log('res ', res)
        if (res.success && res.code === 1000) {
          this.$store.commit('stock/SET_REWARD_LIST', res.data)
        }
        this.listLoading = false
      }).catch(e => {
        this.listLoading = false
      })
    },
    updateReward(row) {
      this.rewardData = JSON.parse(JSON.stringify(row))
      this.$nextTick(() => {
        this.$refs.updateRef.dialogFormVisible = true
      })
    },
    rewardEmit(emit) {
      if (emit) {
        this.getReward()
      }
    },

  }
}
</script>
