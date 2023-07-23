<template>
  <el-dialog
    v-el-drag-dialog
    title="修改配置"
    :visible.sync="dialogFormVisible"
    :close-on-click-modal="false"
    width="400px"
    @close="onCancel"
  >

    <el-form ref="form" :model="form" label-width="120px">
      
      <el-form-item label="等级">
        <el-input v-model="form.level" disabled></el-input>
      </el-form-item>
      <el-form-item label="每日接单数量">
        <el-input v-model="form.order_count"></el-input>
      </el-form-item>
      <el-form-item label="接单最小金额">
        <el-input v-model="form.range_from"></el-input>
      </el-form-item>
      <el-form-item label="接单最大金额">
        <el-input v-model="form.range_to"></el-input>
      </el-form-item>
      <el-form-item label="返佣比例">
        <el-input v-model="form.commission"></el-input>
      </el-form-item>
    </el-form>

    <div slot="footer">
      <el-button @click="onCancel()">取消</el-button>
      <el-button type="primary" :loading="loading" @click="onConfirm()">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { updateLevelApi } from '@/api/stock'
import elDragDialog from '@/directive/el-drag-dialog'

export default {
  directives: { elDragDialog },
  props: ['levelData'],
  data() {
    return {
      dialogFormVisible: false,
      loading: false,
      form: {
        level: '',
        range_from: 0,
        range_to: 0,
        commission: 0,
        order_count: 0
      }
    }
  },
  computed: {
  },
  watch: {
    levelData: {
      handler(newValue, oldValue) {
        this.form = newValue
      }
    }
  },
  methods: {
    onCancel() {
      this.dialogFormVisible = false
    },
    onConfirm() {
      console.log('this. form ', this.form)
      if (this.form.commission ==  '') return this.$message.error('返佣比例必填')
      if (parseFloat(this.form.range_from) < 0 || this.form.range_from === '') return this.$message.error('接单最小值必填')
      if (parseFloat(this.form.range_to) < 0 || this.form.range_to === '') return this.$message.error('接单最大值必填')
      if (this.form.order_count < 0 || this.form.order_count == '') return this.$message.error('每日接单数量值必填')

      let send_ = {
        commission: this.form.commission,
        range_from: this.form.range_from,
        range_to: this.form.range_to,
        order_count: this.form.order_count
      }
      updateLevelApi({data: send_, id: this.form.id}).then(res => {
        if (res.success && res.code == 1000) {
          this.$message.success(res.message)
          this.onCancel()
          this.$emit('levelEmit', true)
        } else {
          if (res.errors !== null) {
            let key = Object.keys(res?.errors)[0]
            this.$message.error(res?.errors[key])
          } else {
            this.$message.error(res.message)
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
