<template>
  <el-dialog
    v-el-drag-dialog
    title="添加公告"
    :visible.sync="dialogFormVisible"
    :close-on-click-modal="false"
    width="600px"
    @close="onCancel"
  >

    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="公告标题">
        <el-input v-model="form.title" type="textarea" :rows="2"></el-input>
      </el-form-item>
      <el-form-item label="公告内容">
        <el-input v-model="form.description" type="textarea" :rows="6"></el-input>
      </el-form-item>
    </el-form>

    <div slot="footer">
      <el-button @click="onCancel()">取消</el-button>
      <el-button type="primary" :loading="loading" @click="onConfirm()">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { createMessageApi } from '@/api/stock'
import elDragDialog from '@/directive/el-drag-dialog'

export default {
  directives: { elDragDialog },
  props: ['configData'],
  data() {
    return {
      dialogFormVisible: false,
      loading: false,
      form: {
        title: '',
        description: '',
      }
    }
  },
  methods: {
    onCancel() {
      this.dialogFormVisible = false
    },
    onConfirm() {
      if (this.form.title.trim() == '') return this.$message.error('公告标题必填')
      if (this.form.description.trim() == '') return this.$message.error('公告内容必填')

      let send_ = {
        title: this.form.title.trim(),
        description: this.form.description.trim(),
      }
      createMessageApi(send_).then(res => {
        if (res.success && res.code == 1000) {
          this.$message.success(res.message)
          this.onCancel()
          this.$emit('messageEmit', true)
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
