<template>
  <el-dialog
    v-el-drag-dialog
    title="用户下分"
    :visible.sync="dialogFormVisible"
    :close-on-click-modal="false"
    width="400px"
    @close="onCancel"
  >

    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="账号">
        <el-input v-model="form.name" disabled></el-input>
      </el-form-item>
      <el-form-item label="金额">
        <el-input v-model="form.amount" type="number"></el-input>
      </el-form-item>
    </el-form>

    <div slot="footer">
      <el-button @click="onCancel()">取消</el-button>
      <el-button type="primary" :loading="loading" @click="onConfirm()">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { withdrawUserApi } from '@/api/stock'
import elDragDialog from '@/directive/el-drag-dialog'

export default {
  directives: { elDragDialog },
  props: ['withdrawData'],
  data() {
    return {
      dialogFormVisible: false,
      loading: false,
      form: {
        name: '',
        amount: 0,
      }
    }
  },
  computed: {
  },
  watch: {
    withdrawData: {
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
      if (this.form.name == '') return this.$message.error('账号必填')
      if (this.form.amount == '' || this.form.amount < 0) return this.$message.error('金额必填')

      let send_ = {
        amount: this.form.amount,
      }
      // if (this.form.password.trim() !== '') {
      //   send_['password'] = this.form.password.trim()
      // }
      withdrawUserApi({data: send_, id: this.form.id}).then(res => {
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
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
