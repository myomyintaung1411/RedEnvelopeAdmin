<template>
  <el-dialog
    v-el-drag-dialog
    title="产品图片上传"
    :visible.sync="dialogFormVisible"
    :close-on-click-modal="false"
    width="500px"
    @close="onCancel"
  >

    <el-form ref="form" :model="form" label-width="90px">
      
      <el-form-item label="产品标题">
        <el-input v-model="form.name" disabled type="textarea" :rows="4"></el-input>
      </el-form-item>
      <el-form-item label="产品金额">
        <el-input v-model="form.amount" type="number" disabled></el-input>
      </el-form-item>
      <el-form-item label="产品图片">
        <el-upload
          ref="uploadCarousel"
          class="avatar-uploader"
          action="/upload"
          :show-file-list="false"
          :before-upload="beforeUpload"
          :http-request="handleUpload"
        >
          <el-button size="medium" icon="el-icon-upload" :loading="loading" type="text">点击上传</el-button>
        </el-upload>
      </el-form-item>
      
    </el-form>

    <!-- <div slot="footer">
      <el-button @click="onCancel()">取消</el-button>
      <el-button type="primary" :loading="loading" @click="onConfirm()">确认</el-button>
    </div> -->
  </el-dialog>
</template>

<script>
import { uploadProductAvatarApi } from '@/api/stock'
import elDragDialog from '@/directive/el-drag-dialog'

export default {
  directives: { elDragDialog },
  props: ['uploadData'],
  data() {
    return {
      dialogFormVisible: false,
      loading: false,
      form: {
        name: '',
        amount: ''
      }
    }
  },
  computed: {
  },
  watch: {
    uploadData: {
      handler(newValue, oldValue) {
        this.form = newValue
      }
    }
  },
  methods: {
    beforeUpload(file) {
      const isMatch = file.type === 'image/jpeg' ||
        file.type === 'image/jpg' ||
        file.type === 'image/png' ||
        file.type === 'image/gif' ||
        file.type === 'image/bmp'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isMatch) {
        this.$message.error('当前图片格式不支持')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
      }
      return isMatch && isLt2M
    },
    handleUpload(raw) {
      const fd = new FormData()
      fd.append('avatar', raw.file, raw.file.name) // 因为要上传多个文件，所以需要遍历一下才行
      // 不要直接使用我们的文件数组进行上传，你会发现传给后台的是两个Object
      this.loading = true
      uploadProductAvatarApi({data: fd, id: this.uploadData.id}).then(res => {
        this.loading = false
        const { code, success, errors } = res
        if (code === 1000 && success) {
          this.$message.success('上传成功')
          this.onCancel()
          this.$emit('productEmit', true)
        } else {
          if (res.errors !== null) {
            let key = Object.keys(res?.errors)[0]
            this.$message.error(res?.errors[key])
          } else {
            this.$message.error(res.message)
          }
        }
      }).catch(err => {
        console.error(err)
        this.loading = false
      })
    },
    onCancel() {
      this.dialogFormVisible = false
    }
    // onConfirm() {
    //   if (this.form.name.trim() == '') return this.$message.error('产品名称必填')
    //   if (this.form.amount == '' || this.form.amount < 0) return this.$message.error('产品金额值必填')

    //   let send_ = {
    //     name: this.form.name.trim(),
    //     amount: this.form.amount
    //   }
    //   updateProductApi({data: send_, id: this.uploadData.id}).then(res => {
    //     if (res.success && res.code == 1000) {
    //       this.$message.success('更新成功')
    //       this.onCancel()
    //       this.$emit('productEmit', true)
    //     } else {
    //       if (res.errors !== null) {
    //         let key = Object.keys(res?.errors)[0]
    //         this.$message.error(res?.errors[key])
    //       } else {
    //         this.$message.error(res.message)
    //       }
    //     }
    //   })
    // }
  }
}
</script>

<style lang="scss" scoped>

</style>
