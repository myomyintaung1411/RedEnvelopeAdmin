<template>
  <div class="app-container">

    <div style="display: flex;">
      <el-button icon="el-icon-refresh" type="text" size="medium" @click="getLevel">刷新</el-button>
    </div>
    
    <div style="margin: 10px;"></div>
    <el-table
      v-loading="listLoading"
      :data="levelList"
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
          <el-button slot="reference" size="medium" type="text" @click="updateLevel(scope.row)">更新</el-button>
        </template>
      </el-table-column>
      <el-table-column label="等级" show-overflow-tooltip width="130" align="center">
        <template slot-scope="scope">
          {{ scope.row.level }}
        </template>
      </el-table-column>
      <el-table-column label="每日接单数量" show-overflow-tooltip width="150" align="right">
        <template slot-scope="scope">
          <span>{{ scope.row.order_count }} 单</span>
        </template>
      </el-table-column>
      <el-table-column label="接单金额范围" show-overflow-tooltip width="230" align="right">
        <template slot-scope="scope">
          <span>{{ scope.row.range_from }} $ 至 {{ scope.row.range_to }} $</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="最大金额" show-overflow-tooltip width="150" align="right">
        <template slot-scope="scope">
          <span></span>
        </template>
      </el-table-column> -->
      <el-table-column label="返佣比例" show-overflow-tooltip width="150" align="right">
        <template slot-scope="scope">
          <span>{{ scope.row.commission }} %</span>
        </template>
      </el-table-column>
    </el-table>

    <Update ref="updateRef" :level-data="levelData" @levelEmit="levelEmit"  />
  </div>
</template>

<script>
import { getLevelApi } from '@/api/stock'
import { mapState } from 'vuex'
import Update from './action/edit.vue'

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
      levelData: {},
      loading: false
    }
  },
  computed: {
    ...mapState({
      levelList: state => state.stock.levelList
    })
  },
  created() {
    this.getLevel()
  },
  methods: {
    getLevel() {
      this.listLoading = true
      getLevelApi().then(res => {
        console.log('res ', res)
        if (res.success && res.code === 1000) {
          this.$store.commit('stock/SET_LEVEL_LIST', res.data)
        }
        this.listLoading = false
      }).catch(e => {
        this.listLoading = false
      })
    },
    updateLevel(row) {
      this.levelData = JSON.parse(JSON.stringify(row))
      this.$nextTick(() => {
        this.$refs.updateRef.dialogFormVisible = true
      })
    },
    levelEmit(emit) {
      if (emit) {
        this.getLevel()
      }
    },

  }
}
</script>
