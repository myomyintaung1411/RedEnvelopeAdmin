<template>
  <el-dialog
    v-el-drag-dialog
    title="修改用户姓名"
    :visible.sync="dialogFormVisible"
    :close-on-click-modal="false"
    width="430px"
    @close="onCancel"
  >

    <el-form ref="form" :model="form" label-width="50px">
      <el-form-item label="账号">
        <el-input v-model="form.phone" disabled></el-input>
      </el-form-item>
      <el-form-item label="姓名">
        <el-input v-model="name" placeholder="请输入姓名"></el-input>
      </el-form-item>
      <!-- <el-form-item label="手机号">
        <el-input v-model="phone" placeholder="请输入手机号"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="password" placeholder="请输入密码"></el-input>
      </el-form-item> -->
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
import { changeRealnameApi } from '@/api/stock'
import elDragDialog from '@/directive/el-drag-dialog'

export default {
  directives: { elDragDialog },
  props: ['nameData'],
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
      comment: ''
    }
  },
  computed: {
  },
  watch: {
    nameData: {
      handler(newValue, oldValue) {
        this.form = newValue
      }
    }
  },
  methods: {
    onCancel() {
      this.loading = false
      this.name = ''
      this.dialogFormVisible = false
    },
    onConfirm() {
      if (!this.nameData.user_id) return this.$message.error('请选择用户')
      if (this.name.trim() == '') return this.$message.error('请输入姓名')

      let send_ = {
        opt_id: this.nameData.user_id,
        real_name: this.name
      }
      this.loading = true
      changeRealnameApi(send_).then(res => {
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
