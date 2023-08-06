<template>
  <el-dialog
    v-el-drag-dialog
    title="修改用户密码"
    :visible.sync="dialogFormVisible"
    :close-on-click-modal="false"
    width="430px"
    @close="onCancel"
  >

    <el-form ref="form" :model="form" label-width="100px">
      <el-form-item label="账号">
        <el-input v-model="form.phone" disabled></el-input>
      </el-form-item>
      <el-form-item label="新密码">
        <el-input v-model="password" placeholder="请输入新密码"></el-input>
      </el-form-item>
      <el-form-item label="确认密码">
        <el-input v-model="confirm_password" placeholder="请输入确认密码"></el-input>
      </el-form-item>
      <!-- <el-form-item label="备注">
        <el-input v-model="comment" type="textarea" placeholder="备注"></el-input>
      </el-form-item> -->
    </el-form>

    <div slot="footer">
      <el-button @click="onCancel()">取消</el-button>
      <el-button type="primary" :loading="loading" @click="onConfirm()">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { changePassApi } from '@/api/stock'
import elDragDialog from '@/directive/el-drag-dialog'

export default {
  directives: { elDragDialog },
  props: ['passData'],
  data() {
    return {
      dialogFormVisible: false,
      loading: false,
      form: {
        id: '',
        username: '',
      },
      name: '',
      phone: '',
      password: '',
      confirm_password: '',
      comment: ''
    }
  },
  computed: {
  },
  watch: {
    passData: {
      handler(newValue, oldValue) {
        this.form = newValue
      }
    }
  },
  methods: {
    onCancel() {
      this.loading = false
      this.password = ''
      this.confirm_password = ''
      this.dialogFormVisible = false
    },
    onConfirm() {
      if (!this.passData.user_id) return this.$message.error('请选择用户')
      if (this.password.trim() == '') return this.$message.error('请输入新密码')
      if (this.confirm_password.trim() == '') return this.$message.error('请输入确认密码')
      if (this.confirm_password.trim() !== this.password.trim()) return this.$message.error('两次输入密码不一致！')

      let send_ = {
        opt_id: this.passData.user_id,
        new_pw: this.password,
        new_pw2: this.confirm_password
      }
      this.loading = true
      changePassApi(send_).then(res => {
        if (res.code == 200) {
          this.$message.success(res.msg)
          this.onCancel()
          this.$emit('userEmit', true)
        } else {
          this.$message.error(res.msg)
        }
        this.loading = false
      }).catch(e => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
