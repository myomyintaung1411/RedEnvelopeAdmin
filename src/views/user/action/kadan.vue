<template>
  <el-dialog v-el-drag-dialog :title="`给 ${kdData.name} 设置幸运连单`" top="10" :visible.sync="dialogFormVisible"
    :close-on-click-modal="false" fullscreen @close="onCancel">

    <div style="line-height: 40px; font-size: 16px;">
      <span>账号：<span style="color: black; font-weight: bold;">{{ kdData.name }}</span></span>
      <span style="margin-left: 20px;">手机号：<span style="color: black; font-weight: bold;">{{ kdData.phone }}</span></span>
      <span style="margin-left: 20px;">等级：<span style="color: black; font-weight: bold;">LV {{ kdData.level }}</span></span>
      <span style="margin-left: 20px;">当前余额：<span style="color: green; font-weight: bold;">{{ kdData.balance | fixTwoFilter }} $</span></span>
      <span style="margin-left: 20px;">
        当前完成单数：
        <span style="color: black; font-weight: bold;">
          {{ parseInt(kdData.order_reach_at) < 0 ? 0 : parseInt(kdData.order_reach_at) }}
        </span> / 30
      </span>
      <span style="margin-left: 20px;">当前完成幸运连单：<span style="color: black; font-weight: bold;">{{ kdData.stuck_reach_at }}</span> / {{ kdData.total_stuck }}</span>
    </div>

    <div style="display: flex; justify-content: space-between;">
      <!-- setting left -->
      <div style="width: 38%; min-width: 400px; padding: 20px; border-radius: 8px; border: 1px solid #dcdfe6; box-shadow: 0 2px 12px 0 rgba(0,0,0,.1)">
        <el-form ref="form" :model="form" label-position="left" label-width="100px">
          <el-form-item label="开始幸运连单">
            <div style="display: flex;">
              <el-input v-model="form.stuck_at" type="number" style="width: 100px"></el-input>
              <span style="margin: 0 20px">-</span>
              <el-input v-model="form.stuck_at_real" type="number" style="width: 100px"></el-input>
            </div>
          </el-form-item>
          <el-form-item label="总连单数量">
            <el-input-number v-model="form.total_stuck" :min="1" :max="10"></el-input-number>
          </el-form-item>

        </el-form>

        <div style="margin-top: 5px; height: 500px; overflow-y: scroll;">
          <div v-show="1 <= form.total_stuck" style="margin: 5px 0;">
            第 {{ 1 }} 单 产品金额范围
          </div>
          <div v-show="1 <= form.total_stuck" style="display: flex; align-items: center;">
            <el-input v-model="from1" type="number"></el-input>
            <span style="margin: 0 10px">至</span>
            <el-input v-model="to1" type="number"></el-input>
            <el-button type="text" style="margin-left: 10px" @click="getStuckProduct(from1, to1, 1)">选择产品</el-button>
          </div>
          <div v-if="pd1 && 1 <= form.total_stuck" style="margin: 10px 0;">
            <div style="padding: 10px 20px; border-radius: 6px; border: 1px solid #dcdfe6;">
              <span>产品名称： {{ pd1.name }}</span>
              <br>
              <span>产品价格： {{ pd1.amount }} $</span>
            </div>
          </div>

          <div v-show="2 <= form.total_stuck" style="margin: 5px 0;">
            第 {{ 2 }} 单 产品金额范围
          </div>
          <div v-show="2 <= form.total_stuck" style="display: flex; align-items: center;">
            <el-input v-model="from2" type="number"></el-input>
            <span style="margin: 0 10px">至</span>
            <el-input v-model="to2" type="number"></el-input>
            <el-button type="text" style="margin-left: 10px" @click="getStuckProduct(from2, to2, 2)">选择产品</el-button>
          </div>
          <div v-if="pd2 && 2 <= form.total_stuck" style="margin: 10px 0;">
            <div style="padding: 10px 20px; border-radius: 6px; border: 1px solid #dcdfe6;">
              <span>产品名称： {{ pd2.name }}</span>
              <br>
              <span>产品价格： {{ pd2.amount }} $</span>
            </div>
          </div>

          <div v-show="3 <= form.total_stuck" style="margin: 5px 0;">
            第 {{ 3 }} 单 产品金额范围
          </div>
          <div v-show="3 <= form.total_stuck" style="display: flex; align-items: center;">
            <el-input v-model="from3" type="number"></el-input>
            <span style="margin: 0 10px">至</span>
            <el-input v-model="to3" type="number"></el-input>
            <el-button type="text" style="margin-left: 10px" @click="getStuckProduct(from3, to3, 3)">选择产品</el-button>
          </div>
          <div v-if="pd3 && 3 <= form.total_stuck" style="margin: 10px 0;">
            <div style="padding: 10px 20px; border-radius: 6px; border: 1px solid #dcdfe6;">
              <span>产品名称： {{ pd3.name }}</span>
              <br>
              <span>产品价格： {{ pd3.amount }} $</span>
            </div>
          </div>

          <div v-show="4 <= form.total_stuck" style="margin: 5px 0;">
            第 {{ 4 }} 单 产品金额范围
          </div>
          <div v-show="4 <= form.total_stuck" style="display: flex; align-items: center;">
            <el-input v-model="from4" type="number"></el-input>
            <span style="margin: 0 10px">至</span>
            <el-input v-model="to4" type="number"></el-input>
            <el-button type="text" style="margin-left: 10px" @click="getStuckProduct(from4, to4, 4)">选择产品</el-button>
          </div>
          <div v-if="pd4 && 4 <= form.total_stuck" style="margin: 10px 0;">
            <div style="padding: 10px 20px; border-radius: 6px; border: 1px solid #dcdfe6;">
              <span>产品名称： {{ pd4.name }}</span>
              <br>
              <span>产品价格： {{ pd4.amount }} $</span>
            </div>
          </div>

          <div v-show="5 <= form.total_stuck" style="margin: 5px 0;">
            第 {{ 5 }} 单 产品金额范围
          </div>
          <div v-show="5 <= form.total_stuck" style="display: flex; align-items: center;">
            <el-input v-model="from5" type="number"></el-input>
            <span style="margin: 0 10px">至</span>
            <el-input v-model="to5" type="number"></el-input>
            <el-button type="text" style="margin-left: 10px" @click="getStuckProduct(from5, to5, 5)">选择产品</el-button>
          </div>
          <div v-if="pd5 && 5 <= form.total_stuck" style="margin: 10px 0;">
            <div style="padding: 10px 20px; border-radius: 6px; border: 1px solid #dcdfe6;">
              <span>产品名称： {{ pd5.name }}</span>
              <br>
              <span>产品价格： {{ pd5.amount }} $</span>
            </div>
          </div>

          <div v-show="6 <= form.total_stuck" style="margin: 5px 0;">
            第 {{ 6 }} 单 产品金额范围
          </div>
          <div v-show="6 <= form.total_stuck" style="display: flex; align-items: center;">
            <el-input v-model="from6" type="number"></el-input>
            <span style="margin: 0 10px">至</span>
            <el-input v-model="to6" type="number"></el-input>
            <el-button type="text" style="margin-left: 10px" @click="getStuckProduct(from6, to6, 6)">选择产品</el-button>
          </div>
          <div v-if="pd6 && 6 <= form.total_stuck" style="margin: 10px 0;">
            <div style="padding: 10px 20px; border-radius: 6px; border: 1px solid #dcdfe6;">
              <span>产品名称： {{ pd6.name }}</span>
              <br>
              <span>产品价格： {{ pd6.amount }} $</span>
            </div>
          </div>
        
          <div v-show="7 <= form.total_stuck" style="margin: 5px 0;">
            第 {{ 7 }} 单 产品金额范围
          </div>
          <div v-show="7 <= form.total_stuck" style="display: flex; align-items: center;">
            <el-input v-model="from7" type="number"></el-input>
            <span style="margin: 0 10px">至</span>
            <el-input v-model="to7" type="number"></el-input>
            <el-button type="text" style="margin-left: 10px" @click="getStuckProduct(from7, to7, 7)">选择产品</el-button>
          </div>
          <div v-if="pd7 && 7 <= form.total_stuck" style="margin: 10px 0;">
            <div style="padding: 10px 20px; border-radius: 6px; border: 1px solid #dcdfe6;">
              <span>产品名称： {{ pd7.name }}</span>
              <br>
              <span>产品价格： {{ pd7.amount }} $</span>
            </div>
          </div>
        
          <div v-show="8 <= form.total_stuck" style="margin: 5px 0;">
            第 {{ 8 }} 单 产品金额范围
          </div>
          <div v-show="8 <= form.total_stuck" style="display: flex; align-items: center;">
            <el-input v-model="from8" type="number"></el-input>
            <span style="margin: 0 10px">至</span>
            <el-input v-model="to8" type="number"></el-input>
            <el-button type="text" style="margin-left: 10px" @click="getStuckProduct(from8, to8, 8)">选择产品</el-button>
          </div>
          <div v-if="pd8  && 8 <= form.total_stuck" style="margin: 10px 0;">
            <div style="padding: 10px 20px; border-radius: 6px; border: 1px solid #dcdfe6;">
              <span>产品名称： {{ pd8.name }}</span>
              <br>
              <span>产品价格： {{ pd8.amount }} $</span>
            </div>
          </div>
        
          <div v-show="9 <= form.total_stuck" style="margin: 5px 0;">
            第 {{ 9 }} 单 产品金额范围
          </div>
          <div v-show="9 <= form.total_stuck" style="display: flex; align-items: center;">
            <el-input v-model="from9" type="number"></el-input>
            <span style="margin: 0 10px">至</span>
            <el-input v-model="to9" type="number"></el-input>
            <el-button type="text" style="margin-left: 10px" @click="getStuckProduct(from9, to9, 9)">选择产品</el-button>
          </div>
          <div v-if="pd9  && 9 <= form.total_stuck" style="margin: 10px 0;">
            <div style="padding: 10px 20px; border-radius: 6px; border: 1px solid #dcdfe6;">
              <span>产品名称： {{ pd9.name }}</span>
              <br>
              <span>产品价格： {{ pd9.amount }} $</span>
            </div>
          </div>
        
          <div v-show="10 <= form.total_stuck" style="margin: 5px 0;">
            第 {{ 10 }} 单 产品金额范围
          </div>
          <div v-show="10 <= form.total_stuck" style="display: flex; align-items: center;">
            <el-input v-model="from10" type="number"></el-input>
            <span style="margin: 0 10px">至</span>
            <el-input v-model="to10" type="number"></el-input>
            <el-button type="text" style="margin-left: 10px" @click="getStuckProduct(from10, to10, 10)">选择产品</el-button>
          </div>
          <div v-if="pd10 && 10 <= form.total_stuck" style="margin: 10px 0;">
            <div style="padding: 10px 20px; border-radius: 6px; border: 1px solid #dcdfe6;">
              <span>产品名称： {{ pd10.name }}</span>
              <br>
              <span>产品价格： {{ pd10.amount }} $</span>
            </div>
          </div>
        </div>
      </div>

      <!-- table right -->
      <div style="width: 60%">
        <el-table v-loading="listLoading" :data="prodList" element-loading-text="Loading" border height="720" fit
          highlight-current-row>
          <el-table-column align="left" label="操作" width="120">
            <template slot-scope="scope">
              <div style="display: flex;">
                <el-button size="medium" type="text" @click="selectProduct(scope.row)">选定产品</el-button>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="产品标题" show-overflow-tooltip width="350">
            <template slot-scope="scope">
              {{ scope.row.name }}
            </template>
          </el-table-column>
          <el-table-column label="金额" show-overflow-tooltip width="150" align="right">
            <template slot-scope="scope">
              <span>{{ scope.row.amount }} $</span>
            </template>
          </el-table-column>
          <el-table-column label="产品图" show-overflow-tooltip width="120" align="center">
            <template slot-scope="scope">
              <!-- <span>{{ scope.row.avatar }}</span> -->
              <el-image style="width: 30px; height: 20px" :src="imageBase + scope.row.avatar"
                :preview-src-list="[imageBase + scope.row.avatar]">
              </el-image>
            </template>
          </el-table-column>
          <el-table-column label="详情" show-overflow-tooltip min-width="120" align="left">
            <template slot-scope="scope">
              <span>{{ scope.row.description }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>


    <div slot="footer">
      <el-button @click="onCancel()">取消</el-button>
      <el-button type="primary" :loading="loading" @click="onConfirm()">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getStuckProductApi, stuckOrderApi } from '@/api/stock'
import elDragDialog from '@/directive/el-drag-dialog'
import { mapState, mapGetters } from 'vuex'

export default {
  directives: { elDragDialog },
  props: ['kdData'],
  filters: {
    fixTwoFilter(amount) {
      return Number(amount.toFixed(2))
    }
  },
  data() {
    return {
      dialogFormVisible: false,
      loading: false,
      listLoading: false,
      prodList: [],
      active: 0,
      total_stuck: 1,
      form: {
        stuck_at: 0,
        stuck_at_real: 0,
        total_stuck: 1
      },
      from_: 0,
      to_: 0,
      from1: 0,
      to1: 0,
      from2: 0,
      to2: 0,
      from3: 0,
      to3: 0,
      from4: 0,
      to4: 0,
      from5: 0,
      to5: 0,
      from6: 0,
      to6: 0,
      from7: 0,
      to7: 0,
      from8: 0,
      to8: 0,
      from9: 0,
      to9: 0,
      from10: 0,
      to10: 0,
      pd1: {},
      pd2: {},
      pd3: {},
      pd4: {},
      pd5: {},
      pd6: {},
      pd7: {},
      pd8: {},
      pd9: {},
      pd10: {},
    }
  },
  computed: {
    ...mapGetters(['imageBase'])
  },
  watch: {
    kdData: {
      handler(newValue, oldValue) {
        // this.form = newValue

        if (newValue.UserStucks.length > 0) {
          this.form.stuck_at = parseInt(newValue.order_stuck_at) - 1 < 0 ? 0 : parseInt(newValue.order_stuck_at) - 1
          this.form.stuck_at_real = parseInt(newValue.order_stuck_at)
          this.form.total_stuck = newValue.total_stuck
          for (let i = 0; i < newValue.UserStucks.length; i++) {
            this[`pd${i+1}`] = newValue.UserStucks[i]['product']

            this[`from${i+1}`] =  newValue.UserStucks[i]['from']
            this[`to${i+1}`] =  newValue.UserStucks[i]['to']
            // this[`from${i+1}`] =  newValue.UserStucks[i]['from']
            // this[`to${i+1}`] =  newValue.UserStucks[i]['to']
          }
        }
      }
    },
    'form.total_stuck'(val) {
      console.log(val)
      this.total_stuck = val
    }
  },
  methods: {
    onCancel() {
      this.from_ = 0
      this.to_ = 0
      this.from1 = 0
      this.to1 = 0
      this.from2 = 0
      this.to2 = 0
      this.from3 = 0
      this.to3 = 0
      this.from4 = 0
      this.to4 = 0
      this.from5 = 0
      this.to5 = 0
      this.from6 = 0
      this.to6 = 0
      this.from7 = 0
      this.to7 = 0
      this.from8 = 0
      this.to8 = 0
      this.from9 = 0
      this.to9 = 0
      this.from10 = 0
      this.to10 = 0
      this.pd1 = {}
      this.pd2 = {}
      this.pd3 = {}
      this.pd4 = {}
      this.pd5 = {}
      this.pd6 = {}
      this.pd7 = {}
      this.pd8 = {}
      this.pd9 = {}
      this.pd10 = {}
      this.prodList = []
      this.dialogFormVisible = false
    },
    onConfirm() {
      // if (this.kdData.stuck_reach_at != this.kdData.total_stuck) return this.$message.error('辛运连单进行中')
      if (this.form.stuck_at == '' || this.form.stuck_at < 0) return this.$message.error('开始卡单号必填')
      if (this.form.total_stuck == '' || this.form.total_stuck < 1) return this.$message.error('卡单数量最少1个')
      // if (this.form.level == '') return this.$message.error('等级必填')

      let stucks_ = []
      for (let i = 1; i <= this.form.total_stuck; i++) {
        let from = parseFloat(this[`from${i}`])
        let to = parseFloat(this[`to${i}`])
        let p_id = this[`pd${i}`]['id']
        if (from < 0) return this.$message.error(`第${i}单号的金额必填`)
        if (to <= 0) return this.$message.error(`第${i}单号的金额必填`)
        if (to < from) return this.$message.error(`第${i}单号的金额有误`)

        let obj = {}
        obj.stuck_number = i
        obj.from = from
        obj.to = to
        obj.product_id = p_id

        stucks_.push(obj)
      }

      let send_ = {
        stuck_at: parseInt(this.form.stuck_at) + 1,
        total_stuck: this.form.total_stuck,
        stucks: JSON.stringify(stucks_)
      }
      // console.log('stuckssssssss ', send_)
      stuckOrderApi({ data: send_, id: this.kdData.id }).then(res => {
        if (res.success && res.code == 1000) {
          this.$message.success(res.message)
          this.onCancel()
          this.$emit('userEmit', true)
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

    selectProduct(row) {
      if (this.active == 0) return this.$message.info("请选择单")
      if (this.active == 1) return this.pd1 = JSON.parse(JSON.stringify(row))
      if (this.active == 2) return this.pd2 = JSON.parse(JSON.stringify(row))
      if (this.active == 3) return this.pd3 = JSON.parse(JSON.stringify(row))
      if (this.active == 4) return this.pd4 = JSON.parse(JSON.stringify(row))
      if (this.active == 5) return this.pd5 = JSON.parse(JSON.stringify(row))
      if (this.active == 6) return this.pd6 = JSON.parse(JSON.stringify(row))
      if (this.active == 7) return this.pd7 = JSON.parse(JSON.stringify(row))
      if (this.active == 8) return this.pd8 = JSON.parse(JSON.stringify(row))
      if (this.active == 9) return this.pd9 = JSON.parse(JSON.stringify(row))
      if (this.active == 10) return this.pd10 = JSON.parse(JSON.stringify(row))
    },

    getStuckProduct(from, to, num) {
      this.active = num
      this.prodList = []
      this.listLoading = true
      getStuckProductApi({ range_from: from, range_to: to }).then(res => {
        this.listLoading = false
        if (res.success && res.code == 1000) {
          this.$message.success(res.message)
          // this.onCancel()
          // this.$emit('userEmit', true)
          this.prodList = res.data
        } else {
          this.prodList = []
          if (res.errors !== null) {
            let key = Object.keys(res?.erorrs)[0]
            this.$message.error(res?.errors[key])
          } else {
            this.$message.error(res.message)
          }
        }
      }).catch(e => {
        this.listLoading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
