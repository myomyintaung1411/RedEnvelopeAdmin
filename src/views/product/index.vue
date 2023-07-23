<template>
  <div class="app-container">

    <div style="display: flex;">
      <el-button icon="el-icon-plus" type="text" size="medium" @click="createProduct">添加产品</el-button>
      <el-button icon="el-icon-refresh" type="text" size="medium" style="margin-left: 20px" @click="getProduct">刷新</el-button>
    </div>
    
    <div style="margin: 10px;"></div>
    <el-table
      v-loading="listLoading"
      :data="productList.products"
      element-loading-text="Loading"
      border
      height="720"
      fit
      highlight-current-row
    >
      <!-- <el-table-column align="left" label="ID" width="75">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column> -->
      <el-table-column align="left" label="操作" width="200">
        <template slot-scope="scope">
          <div style="display: flex;">
            <el-button size="medium" type="text" @click="clickUpload(scope.row)">上传图片</el-button>
            <el-button size="medium" type="text" @click="updateProduct(scope.row)" style="margin-left: 10px;">更新</el-button>
            <el-popconfirm title="您确定要删除该产品吗？" @onConfirm="confirmDel(scope.row)">
              <el-button slot="reference" size="medium" type="text" style="margin-left: 10px; color: red">删除</el-button>
            </el-popconfirm>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="产品标题" show-overflow-tooltip width="350">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="金额" show-overflow-tooltip width="150" align="right">
        <template slot-scope="scope">
          <span>{{ scope.row.amount }} $</span>
        </template>
      </el-table-column>
      <el-table-column label="产品图" show-overflow-tooltip width="120" align="center">
        <template slot-scope="scope">
          <!-- <span>{{ scope.row.avatar }}</span> -->
          <el-image 
            style="width: 30px; height: 20px"
            :src="imageBase+scope.row.avatar" 
            :preview-src-list="[imageBase+scope.row.avatar]">
          </el-image>
        </template>
      </el-table-column>
      <el-table-column label="启用状态" show-overflow-tooltip width="230" align="center">
        <template slot-scope="scope">
          <!-- <span>{{ scope.row.status }}</span> -->
          <el-switch
            v-model="scope.row.status"
            active-text="启用产品"
            inactive-text="禁用产品"
            :active-value="1"
            :inactive-value="0"
            @change="changeProductStatus(scope.row)"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="详情" show-overflow-tooltip min-width="120" align="left">
        <template slot-scope="scope">
          <span>{{ scope.row.description }}</span>
        </template>
      </el-table-column>
    </el-table>

    <Pagination style="float: right; margin-top: 20px; margin-right: -20px;" :background="true" :total="productList.meta.total" :page.sync="page" :limit.sync="perPage" @pagination="PaginationEvent" />

    <Create ref="createRef" @productEmit="productEmit" />
    <Update ref="updateRef" :update-data="updateData" @productEmit="productEmit" />
    <Upload ref="uploadRef" :upload-data="uploadData" @productEmit="productEmit" />
  </div>
</template>

<script>
import { getProductApi, uploadCarouselApi, deleteProductApi, changeProductStatusApi } from '@/api/stock'
import { mapState, mapGetters } from 'vuex'
import Create from './action/create.vue'
import Update from './action/edit.vue'
import Upload from './action/upload.vue'
import Pagination from '@/components/Pagination'

export default {
  name: 'ProductList',
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
    Create,
    Update,
    Upload,
    Pagination
  },
  data() {
    return {
      list: null,
      listLoading: true,
      loading: false,
      fromDate: '',
      toDate: '',
      page: 1,
      perPage: 10,
      updateData: {},
      uploadData: {},
      fileList: [],
      up_id: 0
    }
  },
  computed: {
    ...mapState({
      productList: state => state.stock.productList
    }),
    ...mapGetters(['imageBase'])
  },
  created() {
    this.getProduct()
  },
  methods: {
    getProduct() {
      this.listLoading = true
      let send_ = {
        page: this.page,
        perPage: this.perPage,
        // fromDate: this.fromDate,
        // toDate: this.toDate
      }
      getProductApi(send_).then(res => {
        console.log('res ', res)
        if (res.success && res.code === 1000) {
          this.$store.commit('stock/SET_PRODUCT_LIST', res.data)
        }
        this.listLoading = false
      }).catch(e => {
        this.listLoading = false
      })
    },
    createProduct() {
      this.$nextTick(() => {
        this.$refs.createRef.dialogFormVisible = true
      })
    },
    productEmit(emit) {
      if (emit) {
        this.getProduct()
      }
    },

    updateProduct(row) {
      this.updateData = JSON.parse(JSON.stringify(row))
      this.$nextTick(() => {
        this.$refs.updateRef.dialogFormVisible = true
      })
    },

    changeProductStatus(row) {
      console.log('row ', row.status)
      let status = row.status
      let send_ = {
        status: status
      }
      changeProductStatusApi({ data: send_, id: row.id }).then(res => {
        if (res.success && res.code == 1000) {
          this.$message.success('更新成功')
          this.getProduct()
        } else {
          // row.status = status == 0 ? 1 : 0
          if (res.errors !== null) {
            let key = Object.keys(res?.errors)[0]
            this.$message.error(res?.errors[key])
          } else {
            this.$message.error(res.message)
          }
        }
      }).catch(e => {
        // row.status = status == 0 ? 1 : 0
        console.error('e: changeProductStatus: ', e)
      })
    },

    
    clickUpload(row) {
      this.uploadData = JSON.parse(JSON.stringify(row))
      this.$nextTick(() => {
        this.$refs.uploadRef.dialogFormVisible = true
      })
    },

    confirmDel(row) {
      console.log('delet erow ', row)
      deleteProductApi(row.id).then(res => {
        console.log('delete res ', res)
        if (res.code === 1000 && res.success) {
          this.$message.success('删除成功')
          this.getProduct()
        } else {
          if (res.errors !== null) {
            console.log(res.errors)
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




    PaginationEvent(props) {
      this.handlePagination(props)
    },
    handlePagination(props) {
      props.action === 'limit' ? this.page = 1 : this.page = props.page
      this.perPage = props.limit
      this.getProduct()
    },
  }
}
</script>
