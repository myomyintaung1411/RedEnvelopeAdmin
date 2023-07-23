<template>
  <el-dialog
    v-el-drag-dialog
    title="修改用户"
    :visible.sync="dialogFormVisible"
    :close-on-click-modal="false"
    width="400px"
    @close="onCancel"
  >

    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="账号">
        <el-input v-model="form.name" disabled></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="form.password"></el-input>
      </el-form-item>
      <el-form-item label="等级">
        <el-input v-model="form.level"></el-input>
      </el-form-item>
    </el-form>

    <div slot="footer">
      <el-button @click="onCancel()">取消</el-button>
      <el-button type="primary" :loading="loading" @click="onConfirm()">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { updateUserApi } from '@/api/stock'
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
        level: 0,
        password: ''
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
      if (this.form.name == '') return this.$message.error('账号必填')
      if (this.form.level === '') return this.$message.error('等级必填')

      let send_ = {
        name: this.form.name,
        level: this.form.level,
      }
      if (this.form.password.trim() !== '') {
        send_['password'] = this.form.password.trim()
      }
      updateUserApi({data: send_, id: this.form.id}).then(res => {
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
