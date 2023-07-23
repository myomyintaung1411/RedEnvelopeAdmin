<template>
  <el-dialog
    v-el-drag-dialog
    title="系统配置修改"
    :visible.sync="dialogFormVisible"
    :close-on-click-modal="false"
    fullscreen
    :destroy-on-close="true"
    @close="onCancel"
  >

    <div style="font-size: 20px; color: #212121; margin-bottom: 20px;">
      {{ form.title }}  <!--类型：{{ form.type }} -->
    </div>

    

    <div style="display: flex; justify-content: space-between; flex-wrap: wrap;">
      <div>
        <h5>中文(Chinses)</h5>
        <tinymce v-model="description_zh" :height="550" />
      </div>
      <div>
        <h5>英文(English)</h5>
        <tinymce v-model="description_en" :height="550" />
      </div>
      <div>
        <h5>缅文(Burmese)</h5>
        <tinymce v-model="description_mm" :height="550" />
      </div>
    </div>
    
    <div slot="footer" class="dialog-footer">
      <el-button @click="onCancel()">取消</el-button>
      <el-button type="primary" :loading="loading" @click="onConfirm()">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import elDragDialog from '@/directive/el-drag-dialog'
import Tinymce from '@/components/Tinymce'
import { updateConfigApi } from '@/api/stock'

export default {
  directives: { elDragDialog },
  props: ['tinyData'],
  components: {Tinymce},
  data() {
    return {
      dialogFormVisible: false,
      loading: false,
      form: {
        id: 0,
        val: '',
        title: '',
        type: '',
        description: ''
      },
      description: '',
      description_zh: '',
      description_en: '',
      description_mm: '',
    }
  },
  computed: {
  },
  watch: {
    tinyData: {
      handler(newValue, oldValue) {
        console.log('watch ', newValue )
        this.form = newValue
        this.form.val = newValue.val
        this.description = newValue.description
        this.description_zh = newValue.description.zh
        this.description_en = newValue.description.en
        this.description_mm = newValue.description.mm
      }
    }
  },
  methods: {
    onCancel() {
      this.dialogFormVisible = false
      this.form.id = 0
      this.form.val = ''
      this.form.title = ''
      this.form.type = ''
      this.form.description = ''
      this.description_zh = ''
      this.description_en = ''
      this.description_mm = ''
      this.description = ''
    },
    onConfirm() {
      if (this.form.title.trim() == '') return this.$message.error('标题必填')
      if (this.description == '') return this.$message.error('内容值必填')
      // if (this.form.description.trim() == '') return this.$message.error('详细值必填')
      let desc = [
        {
          lang: 'en',
          desc: this.description_en
        },
        {
          lang: 'zh',
          desc: this.description_zh
        },
        {
          lang: 'mm',
          desc: this.description_mm
        }
      ]
      let send_ = {
        title: this.form.title.trim(),
        val: this.form.val,
        description: JSON.stringify(desc)
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
