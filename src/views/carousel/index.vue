<template>
  <div class="app-container">

    <div style="display: flex;">
      <!-- <el-upload
        ref="uploadCarousel"
        class="avatar-uploader"
        action="/upload"
        :show-file-list="false"
        :before-upload="beforeUpload"
        :http-request="handleUpload"
      >
        <el-button size="medium" icon="el-icon-upload" :loading="loading" type="text">点击上传轮播图</el-button>
      </el-upload> -->

      <el-button icon="el-icon-plus" type="text" size="medium" @click="createProduct">添加轮播图</el-button>

      <el-button icon="el-icon-refresh" type="text" size="medium" style="margin-left: 20px"
        @click="getCarousalList">刷新</el-button>
    </div>

    <div style="margin: 10px;"></div>
    <el-table v-loading="listLoading" :data="carousalList.record" element-loading-text="Loading"
      :header-cell-style="{ color: '', background: '#F5F5F5', padding: '5px 0px' }" border stripe fit
      highlight-current-row>
      <!-- <el-table-column align="left" label="ID" width="75">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column> -->
      <el-table-column align="left" label="操作" width="100">
        <template slot-scope="scope">
          <el-popconfirm title="您确定要删除吗？" @onConfirm="deleteCarousal(scope.row)">
            <el-button slot="reference" size="medium" type="danger">删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>

      <el-table-column label="轮播图 ID" show-overflow-tooltip width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.chart_id }}</span>
        </template>
      </el-table-column>

      <el-table-column label="图片名称" show-overflow-tooltip width="180" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.img_name }}</span>
        </template>
      </el-table-column>

      <el-table-column label="地址" show-overflow-tooltip width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.address }}</span>
        </template>
      </el-table-column>

      <el-table-column label="图片地址" show-overflow-tooltip width="230" align="center">
        <template slot-scope="scope">
          <el-image style="width: 30px; height: 20px" :src="'http://45.116.165.93:4195/statics/ ' + scope.row.url"
            :preview-src-list="['http://45.116.165.93:4195/statics/' + scope.row.url]">
          </el-image>
        </template>
      </el-table-column>
    </el-table>


    <el-dialog title="上传轮播图" :visible.sync="dialogFormVisible" :close-on-click-modal="false" width="500px"
      @close="onCancel">

      <el-form ref="form" :model="form" label-width="90px">


        <!-- <el-form-item label="图片名称">
        <el-input v-model="form.imageName" type="text" ></el-input>
      </el-form-item> -->

        <el-form-item label="选择图片">

          <el-upload ref="uploadCarousel" class="avatar-uploader" action="/opt/upload" :show-file-list="false"
            :before-upload="beforeUpload" :http-request="handleUpload" :multiple="false">
            <el-button size="medium" icon="el-icon-upload" :loading="loading" type="text">点击上传</el-button>
          </el-upload>
        </el-form-item>

      </el-form>

      <div slot="footer">
        <el-button @click="onCancel()">取消</el-button>
        <el-button type="primary" :loading="loading" @click="onConfirm()">确认</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { upload_chart, get_chart_list, delete_chart, UploadImage } from '@/api/stock'
import { mapState, mapGetters } from 'vuex'
// import Edit from './action/edit.vue'
import moment from 'moment'

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
    // Edit
  },
  data() {
    return {
      list: null,
      listLoading: true,
      configData: {},
      loading: false,
      dialogFormVisible: false,
      page: 1,
      perPage: 20,
      // carousalList: {},
      form: {
        imageUrl: '',
        imgname: ''
      }
    }
  },
  computed: {
    ...mapState({
      carousalList: state => state.stock.carouselList
    }),
    ...mapGetters(['imageBase'])
  },
  created() {
    this.getCarousalList()
  },
  methods: {
    TranDate(date) {
      if (date == '') return ''
      return moment(date).format('YYYY-MM-DD HH:mm:ss')
    },
    getBanner() {
      this.listLoading = true
      getCarouselApi().then(res => {
        console.log('res ', res)
        if (res.success && res.code === 1000) {
          this.$store.commit('stock/SET_BANNER_LIST', res.data)
        }
        this.listLoading = false
      }).catch(e => {
        this.listLoading = false
      })
    },
    editConfig(row) {
      this.configData = JSON.parse(JSON.stringify(row))
      this.$nextTick(() => {
        this.$refs.editRef.dialogFormVisible = true
      })
    },
    configEmit(emit) {
      if (emit) {
        this.getBanner()
      }
    },

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
      fd.append("file", raw.file, raw.file.name);
      //fd.append('avatar', raw.file, raw.file.name) // 因为要上传多个文件，所以需要遍历一下才行
      // 不要直接使用我们的文件数组进行上传，你会发现传给后台的是两个Object
      this.loading = true
      UploadImage(fd).then(res => {
        this.loading = false
        console.log(res, "res,,,,,,,,,,,")

        if (res.code == 0) {
          this.form.imageUrl = res.data.url
          this.form.imgname = res.data.name
          this.$message.success(res.message)
          //this.getCarousalList()
          this.onConfirm()
          // this.$emit('productEmit', true)
        } else {
          this.$message.error(res.message)
        }
      }).catch(err => {
        console.error(err)
        this.loading = false
      })
    },

    onCancel() {
      this.dialogFormVisible = false
      this.form.imageUrl = ''
      this.form.imgname = ''
    },

    onConfirm() {
      console.log(this.form.imageUrl)
      if (this.form.imageUrl == '') return this.$message.error('请输入所有已归档的内容')

      let data = {
        imgname: this.form.imgname,
        address: 1,
        url: this.form.imageUrl
      }

      //  const loading = this.$loading({
      //     lock: true,
      //     text: 'Loading',
      //     spinner: 'el-icon-loading',
      //     background: 'rgba(0, 0, 0, 0.7)'
      //   });

      upload_chart(data)
        .then((res) => {
          //loading.close();
          console.log("res ", res);

          if (res.success && res.code == 200) {
            this.$message.success(res.msg)
            this.getCarousalList()
            this.dialogFormVisible = false
            this.form.imageUrl = ''
            this.form.imageName = ''
            //this.$store.commit('stock/SET_ORDER_LIST', res.data)
          } else {
            this.$message.error(res.msg)
          }
          this.listLoading = false;
        })
        .catch((e) => {
          // loading.close();
          this.listLoading = false;
        });
    },

    getCarousalList() {
      let send_ = {
        // chart_id: '',
        // address: 1,
        pageSize: this.perPage,
        currentPage: this.page,
      };
      this.listLoading = true;
      get_chart_list(send_)
        .then((res) => {
          console.log("res ", res);
          if (res.success && res.code == 200) {
            // this.carousalList = res.data;
            this.$store.commit('stock/SET_CAROUSEL_LIST', res.data)
          }
          this.listLoading = false;
        })
        .catch((e) => {
          this.listLoading = false;
        });
    },
    deleteCarousal(row) {
      console.log(row)
      let send_ = {
        chart_id: row.chart_id,
      };
      this.listLoading = true;
      delete_chart(send_)
        .then((res) => {
          console.log("res ", res);

          if (res.success && res.code == 200) {
            this.getCarousalList();
            this.$message.success(res.msg)
          } else {
            this.$message.error(res.msg)
          }
          this.listLoading = false;
        })
        .catch((e) => {
          this.listLoading = false;
        });
    },
    createProduct() {
      this.dialogFormVisible = true
    },

  }
}
</script>
