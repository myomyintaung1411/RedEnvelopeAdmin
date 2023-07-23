<template>
  <el-dialog
    v-el-drag-dialog
    title="修改三层级配置"
    :visible.sync="dialogFormVisible"
    :close-on-click-modal="false"
    width="400px"
    @close="onCancel"
  >

    <el-form ref="form" :model="form" label-width="80px">
      
      <el-form-item label="等级">
        <el-input v-model="form.level" disabled></el-input>
      </el-form-item>
      <el-form-item label="名称">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="返佣比例">
        <el-input v-model="form.commission" type="number"></el-input>
      </el-form-item>
    </el-form>

    <div slot="footer">
      <el-button @click="onCancel()">取消</el-button>
      <el-button type="primary" :loading="loading" @click="onConfirm()">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { updateRewardApi } from '@/api/stock'
import elDragDialog from '@/directive/el-drag-dialog'

export default {
  directives: { elDragDialog },
  props: ['rewardData'],
  data() {
    return {
      dialogFormVisible: false,
      loading: false,
      form: {
        level: '',
        commission: 0,
      }
    }
  },
  computed: {
  },
  watch: {
    rewardData: {
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
      console.log('this. form ', this.form)
      if (this.form.commission ==  '') return this.$message.error('返佣比例必填')

      let send_ = {
        commission: this.form.commission,
      }
      updateRewardApi({data: send_, id: this.form.id}).then(res => {
        if (res.success && res.code == 1000) {
          this.$message.success(res.message)
          this.onCancel()
          this.$emit('rewardEmit', true)
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
