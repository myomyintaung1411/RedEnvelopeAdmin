<template>
  <el-dialog
    v-el-drag-dialog
    title="通过提现申请"
    :visible.sync="dialogFormVisible"
    :close-on-click-modal="false"
    width="400px"
    @close="onCancel"
  >

    <el-form ref="form" :model="form" label-width="50px">
      <el-form-item label="账号">
        <el-input v-model="form.username" disabled></el-input>
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="comment" type="textarea"></el-input>
      </el-form-item>
    </el-form>

    <div slot="footer">
      <el-button @click="onCancel()">取消</el-button>
      <el-button type="primary" :loading="loading" @click="onConfirm()">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
// import { acceptWithdrawApi } from '@/api/hoh'
import elDragDialog from '@/directive/el-drag-dialog'

export default {
  directives: { elDragDialog },
  props: ['acceptData'],
  data() {
    return {
      dialogFormVisible: false,
      loading: false,
      form: {
        id: '',
        username: '',
      },
      comment: ''
    }
  },
  computed: {
  },
  watch: {
    acceptData: {
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
      if (!this.acceptData.id) return this.$message.error('请选择操作记录')

      let send_ = {
        with_id: this.acceptData.id,
        user_id: this.acceptData.user_id,
        amount: this.acceptData.amount,
        comment: this.comment,
      }
      // acceptWithdrawApi(send_).then(res => {
      //   if (res.code == 0) {
      //     this.$message.success(res.msg)
      //     this.onCancel()
      //     this.$emit('withdrawEmit', true)
      //   } else {
      //     this.$message.error(res.msg)
      //   }
      // })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
