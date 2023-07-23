<template>
  <el-dialog
    v-el-drag-dialog
    title="添加用户"
    :visible.sync="dialogFormVisible"
    :close-on-click-modal="false"
    width="500px"
    @close="onCancel"
  >

    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="账号">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="form.phone" type="number"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="form.password"></el-input>
      </el-form-item>
      <el-form-item label="邀请码">
        <el-input v-model="form.invite_code"></el-input>
      </el-form-item>
    </el-form>

    <div slot="footer">
      <el-button @click="onCancel()">取消</el-button>
      <el-button type="primary" :loading="loading" @click="onConfirm()">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { createUserApi } from '@/api/stock'
import elDragDialog from '@/directive/el-drag-dialog'

export default {
  directives: { elDragDialog },
  props: ['configData'],
  data() {
    return {
      dialogFormVisible: false,
      loading: false,
      form: {
        name: '',
        phone: '',
        password: '',
        invite_code: '',
      }
    }
  },
  methods: {
    onCancel() {
      this.dialogFormVisible = false
    },
    onConfirm() {
      if (this.form.name.trim() == '') return this.$message.error('账号必填')
      if (this.form.phone == '') return this.$message.error('手机号必填')
      if (this.form.password.trim() == '') return this.$message.error('密码必填')
      if (this.form.invite_code.trim() == '') return this.$message.error('邀请码必填')

      let send_ = {
        name: this.form.name.trim(),
        phone: this.form.phone,
        password: this.form.password.trim(),
        invite_code: this.form.invite_code.trim(),
      }
      createUserApi(send_).then(res => {
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
