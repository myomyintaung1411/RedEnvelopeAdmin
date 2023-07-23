<template>
  <el-dialog
    v-el-drag-dialog
    title="系统配置修改"
    :visible.sync="dialogFormVisible"
    :close-on-click-modal="false"
    width="600px"
    @close="onCancel"
  >

    <el-form ref="form" :model="form" label-width="80px">
      
      <el-form-item label="类型值">
        <el-input v-model="form.type" disabled></el-input>
      </el-form-item>
      <el-form-item label="标题">
        <el-input v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item label="内容值">
        <el-input v-model="form.val" type='textarea' :rows="6"></el-input>
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="form.description"></el-input>
      </el-form-item>
    </el-form>

    <div slot="footer">
      <el-button @click="onCancel()">取消</el-button>
      <el-button type="primary" :loading="loading" @click="onConfirm()">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { updateConfigApi } from '@/api/stock'
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
        val: '',
        description: ''
      }
    }
  },
  computed: {
  },
  watch: {
    configData: {
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
      if (this.form.title.trim() == '') return this.$message.error('标题必填')
      if (this.form.val.trim() == '') return this.$message.error('内容值必填')
      if (this.form.description.trim() == '') return this.$message.error('详细值必填')

      let send_ = {
        title: this.form.title.trim(),
        val: this.form.val.trim(),
        description: this.form.description.trim()
      }
      updateConfigApi({data: send_, id: this.form.id}).then(res => {
        if (res.success && res.code == 1000) {
          this.$message.success('修改成功')
          this.onCancel()
          this.$emit('configEmit', true)
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
