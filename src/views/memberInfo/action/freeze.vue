<template>
  <el-dialog
    v-el-drag-dialog
    title="冻结账户"
    :visible.sync="dialogFormVisible"
    :close-on-click-modal="false"
    width="430px"
    @close="onCancel"
  >

    <el-form ref="form" :model="form" label-width="50px">
      您确认要冻结 {{ form.phone }} 的账户吗？
    </el-form>

    <div slot="footer">
      <el-button @click="onCancel()">取消</el-button>
      <el-button type="primary" :loading="loading" @click="onConfirm()">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { freezeUserApi } from '@/api/stock'
import elDragDialog from '@/directive/el-drag-dialog'

export default {
  directives: { elDragDialog },
  props: ['freezeData'],
  data() {
    return {
      dialogFormVisible: false,
      loading: false,
      form: {
        id: '',
        username: '',
      },
    }
  },
  computed: {
  },
  watch: {
    freezeData: {
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
      if (!this.freezeData.user_id) return this.$message.error('请选择用户')

      let send_ = {
        opt_id: this.freezeData.user_id
      }
      this.loading = true
      freezeUserApi(send_).then(res => {
        if (res.code == 200) {
          this.$message.success('冻结成功')
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
