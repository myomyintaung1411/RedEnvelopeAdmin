<template>
  <div class="app-container">

    <el-button icon="el-icon-refresh" type="text" size="medium" @click="getConfig">刷新</el-button>
    <div style="margin: 10px;"></div>
    <el-table
      v-loading="listLoading"
      :data="configList"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <!-- <el-table-column align="left" label="ID" width="75">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column> -->
      <el-table-column label="操作" width="100" align="left">
        <template slot-scope="scope">
          <el-upload
            v-if="scope.row.type == 'app_logo'"
            ref="uploadCarousel"
            class="avatar-uploader"
            action="/upload"
            :show-file-list="false"
            :before-upload="beforeAvatarUpload"
            :http-request="handleUploadLogo"
          >
            <el-button size="small" icon="el-icon-upload" :loading="loading" type="text">点击上传</el-button>
          </el-upload>
          <el-button v-else size="medium" type="text" @click="editConfig(scope.row)">修改</el-button>
        </template>
      </el-table-column>
      <el-table-column label="标题" show-overflow-tooltip width="330">
        <template slot-scope="scope">
          {{ scope.row.title }}
        </template>
      </el-table-column>
      <el-table-column label="内容值" show-overflow-tooltip min-width="400" align="left">
        <template slot-scope="scope">
          <span v-if="scope.row.type === 'app_logo'">
            <el-image 
            style="width: 30px; height: 20px"
            :src="imageBase+scope.row.val" 
            :preview-src-list="[imageBase+scope.row.val]">
          </el-image>
          </span>
          <span v-else>{{ scope.row.val }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="类型值" width="300" align="left">
        <template slot-scope="scope">
          {{ scope.row.type }}
        </template>
      </el-table-column> -->
      <el-table-column align="left" prop="description" label="备注" show-overflow-tooltip min-width="400">
        <template slot-scope="scope">
          <span>{{ scope.row.description }}</span>
        </template>
      </el-table-column>
    </el-table>

    <Edit ref="editRef" :config-data="configData" @configEmit="configEmit"  />
    <EditTiny ref="tinyRef" :tiny-data="tinyData" @configEmit="configEmit"  />
  </div>
</template>

<script>
import { getConfigApi, uploadApi } from '@/api/stock'
import { mapState, mapGetters } from 'vuex'
import Edit from './action/edit.vue'
import EditTiny from './action/edit_e.vue'

export default {
  // filters: {
  //   statusFilter(status) {
  //     const statusMap = {
  //       published: 'success',
  //       draft: 'gray',
  //       deleted: 'danger'
  //     }
  //     return statusMap[status]
  //   }
  // },
  components: {
    Edit,
    EditTiny
  },
  data() {
    return {
      list: null,
      listLoading: true,
      configData: {},
      tinyData: {},
      loading: false
    }
  },
  computed: {
    ...mapState({
      configList: state => state.stock.configList
    }),
    ...mapGetters(['imageBase'])
  },
  created() {
    this.getConfig()
  },
  methods: {
    getConfig() {
      this.listLoading = true
      getConfigApi().then(res => {
        console.log('res ', res)
        if (res.success && res.code === 1000) {
          this.$store.commit('stock/SET_CONFIG_LIST', res.data)
        }
        this.listLoading = false
      }).catch(e => {
        this.listLoading = false
      })
    },
    editConfig(row) {
      if (
        row.type === 'about_us' || row.type === 'user_aggrement'
        || row.type === 'platform_introduction' || row.type === 'platform_announcement'
        || row.type === 'agent_cooperation' || row.type === 'recharge_note'
        || row.type === 'withdrawal_note' || row.type === 'grab_order_instruction'
        || row.type === 'credit_order' || row.type === 'popup_ad'
      ) {
        this.tinyData = JSON.parse(JSON.stringify(row))
        this.$nextTick(() => {
          this.$refs.tinyRef.dialogFormVisible = true
        })
      } else {
        this.configData = JSON.parse(JSON.stringify(row))
        this.$nextTick(() => {
          this.$refs.editRef.dialogFormVisible = true
        })
      }
    },
    configEmit(emit) {
      if (emit) {
        this.getConfig()
      }
    },

    beforeAvatarUpload(file) {
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
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isMatch && isLt2M
    },
    handleUploadLogo(raw) {
      const fd = new FormData()
      fd.append('logo', raw.file, raw.file.name) // 因为要上传多个文件，所以需要遍历一下才行
      // 不要直接使用我们的文件数组进行上传，你会发现传给后台的是两个Object
      this.loading = true
      uploadApi({data: fd, id: 2}).then(res => {
        this.loading = false
        const { code, data, success } = res.data
        if (code === 1000 && success) {
          this.$message.success('上传成功')
          this.getConfig()
          // this.handleAvatarSuccess(res.data.data.name)
          // this.addCarousel({ name: data.name })
          // this.form.logo_img = res.data.data.name
          // this.editForm.logo_img = res.data.data.name
        }
      }).catch(err => {
        console.error(err)
        this.loading = false
      })
    },
  }
}
</script>
