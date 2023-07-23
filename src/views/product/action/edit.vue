<template>
  <el-dialog
    v-el-drag-dialog
    title="更新产品"
    :visible.sync="dialogFormVisible"
    :close-on-click-modal="false"
    width="600px"
    @close="onCancel"
  >

    <el-form ref="form" :model="form" label-width="90px">
      
      <el-form-item label="产品标题">
        <el-input v-model="form.name" type="textarea" :rows="4"></el-input>
      </el-form-item>
      <el-form-item label="产品金额">
        <el-input v-model="form.amount" type="number"></el-input>
      </el-form-item>
      <el-form-item label="产品详情">
        <el-input v-model="form.description" type="textarea" :rows="8"></el-input>
      </el-form-item>
    </el-form>

    <div slot="footer">
      <el-button @click="onCancel()">取消</el-button>
      <el-button type="primary" :loading="loading" @click="onConfirm()">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { updateProductApi } from '@/api/stock'
import elDragDialog from '@/directive/el-drag-dialog'

export default {
  directives: { elDragDialog },
  props: ['updateData'],
  data() {
    return {
      dialogFormVisible: false,
      loading: false,
      form: {
        name: '',
        amount: '',
        description: ''
      }
    }
  },
  computed: {
  },
  watch: {
    updateData: {
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
      if (this.form.name.trim() == '') return this.$message.error('产品名称必填')
      if (this.form.amount == '' || this.form.amount < 0) return this.$message.error('产品金额值必填')

      let send_ = {
        name: this.form.name.trim(),
        amount: this.form.amount,
        description: this.form.description
      }
      updateProductApi({data: send_, id: this.updateData.id}).then(res => {
        if (res.success && res.code == 1000) {
          this.$message.success('更新成功')
          this.onCancel()
          this.$emit('productEmit', true)
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
