<template>
  <div class="app-container">

    <div style="display: flex;">
      <el-button icon="el-icon-plus" type="text" size="medium" @click="createProduct">添加文章</el-button>
            <el-input
        v-model="find_id"
        placeholder="ID"
        size="small"
        clearable
        style="width: 150px;margin-left:10px"
      ></el-input>

            <el-button
        icon="el-icon-search"
        type="text"
        size="medium"
        style="margin-left: 10px"
        @click="getOrderSearch"
        >搜索</el-button
      >
      <el-button
        icon="el-icon-refresh"
        type="text"
        size="medium"
        style="margin-left: 10px"
        @click="refreshOrder"
        >刷新</el-button
      >

    </div>
    <div style="margin: 5px"></div>
    <el-table
      v-loading="listLoading"
      :data="articleList.record"
      element-loading-text="Loading"
      border
      stripe
      fit
      height="720"
      highlight-current-row
    >
      <el-table-column
        label="文章id"
        show-overflow-tooltip
        width="70"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.article_id}}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="图片名称"
        show-overflow-tooltip
        width="110"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.img_name }}</span>
        </template>
      </el-table-column>

      <el-table-column label="图片地址" show-overflow-tooltip width="430" align="center">
        <template slot-scope="scope">
          <el-image 
            style="width: 30px; height: 20px"
            :src="scope.row.url" 
            :preview-src-list="[scope.row.url]">
          </el-image>
        </template>
      </el-table-column>
      <el-table-column
        label="文章内容"
        show-overflow-tooltip
        width="150"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.content }}</span>
        </template>
      </el-table-column>




      <el-table-column
        label="添加时间"
        show-overflow-tooltip
        width="170"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.create_at }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="操作"
        width="170"
        align="center"
      >
        <template slot-scope="scope">
         <el-button size="mini" @click="deleteArticle(scope.row)" type="danger" icon="el-icon-delete">删除</el-button>
        </template>
      </el-table-column>

    </el-table>
    <div v-if="articleList.count > 0">
      <Pagination
        style="float: right; margin-top: 20px; margin-right: -20px"
        :background="true"
        :total="articleList.count"
        :page.sync="page"
        :limit.sync="perPage"
        @pagination="PaginationEvent"
      />
    </div>

    <el-dialog
   
    title="上传文章封面"
    :visible.sync="dialogFormVisible"
    :close-on-click-modal="false"
   fullscreen
   :destroy-on-close="true"
    @close="onCancel"
  >
    <div style="font-size: 20px; color: #212121; margin-bottom: 20px;">
      <el-input v-model="form.imageName" placeholder="请输入标题" />
    </div>

    <div>
      <VueEditor
        id="editor"
        useCustomImageHandler
        :editorOptions="editorSettings"
        @image-added="handleImageAdded"
        v-model="form.content"
        style="height: 600px;"
      >
      </VueEditor>
    </div>

    <div slot="footer" style="margin-top:30px">
      <el-button @click="onCancel()">取消</el-button>
      <el-button type="primary" :loading="loading" @click="onConfirm()">确认</el-button>
    </div>
  </el-dialog>
   

  </div>
</template>

<script>
import { upload_article, get_article_list, delete_article,UploadImage } from '@/api/stock'
import { mapState, mapGetters } from 'vuex'
import Pagination from '@/components/Pagination'
import elDragDialog from '@/directive/el-drag-dialog'

import { VueEditor, Quill } from 'vue2-editor'
import { ImageDrop } from "quill-image-drop-module";
import ImageResize from "quill-image-resize-module";

Quill.register('modules/imageDrop', ImageDrop)
Quill.register('modules/imageResize', ImageResize)

export default {
  name: 'ArticleList',
    components: {
    // Update
    Pagination,VueEditor
  },
  directives: { elDragDialog },
  props: ['configData'],
  data() {
    return {
        find_id:'',
      list: null,
      listLoading: true,
      loading: false,
      fromDate: '',
      toDate: '',
      page: 1,
      perPage: 20,
      updateData: {},
      uploadData: {},
      fileList: [],
      up_id: 0,

      customModulesForEditor: [
        { alias: "imageDrop", module: ImageDrop },
        { alias: "imageResize", module: ImageResize }
      ],
      editorSettings: {
        modules: {
          imageDrop: true,
          imageResize: {}
        }
      },
      
      form:{
        imageName:'',
      content:'',
      imageUrl:''
      },

      dialogFormVisible:false,
      articleList:{}
      
    }
  },
  computed: {
    ...mapState({
      //productList: state => state.stock.productList
    }),
    //...mapGetters(['imageBase'])
  },
  created() {
    this.GetArticleList()
  },
  methods: {
     handleImageAdded: function (file, Editor, cursorLocation, resetUploader) {
              const fd = new FormData()
      fd.append("file", file, file.name);
      //fd.append('avatar', raw.file, raw.file.name) // 因为要上传多个文件，所以需要遍历一下才行
      // 不要直接使用我们的文件数组进行上传，你会发现传给后台的是两个Object
      this.loading = true
      UploadImage(fd).then(res => {
        this.loading = false
         console.log(res,"res,,,,,,,,,,,")
         
        if (res.code ==  0 ) {
            this.form.imageUrl = res.data.url
            //Editor.insertEmbed(cursorLocation, "image", this.form.imageUrl);
            Editor.insertEmbed(cursorLocation, "image", 'http://45.116.165.93:4195/statics/' + res.data.name);
           this.$message.success(res.message)
           resetUploader();
          //this.onCancel()
         // this.$emit('productEmit', true)
        } else{
            this.$message.error(res.message)
        }
      }).catch(err => {
        console.error(err)
        this.loading = false
      })
     },
//    handleUpload(raw) {
//       const fd = new FormData()
//       fd.append("file", raw.file, raw.file.name);
//       //fd.append('avatar', raw.file, raw.file.name) // 因为要上传多个文件，所以需要遍历一下才行
//       // 不要直接使用我们的文件数组进行上传，你会发现传给后台的是两个Object
//       this.loading = true
//       UploadImage(fd).then(res => {
//         this.loading = false
//          console.log(res,"res,,,,,,,,,,,")
         
//         if (res.code ==  0 ) {
//             this.form.imageUrl = res.data.url
//            this.$message.success(res.message)
//           //this.onCancel()
//          // this.$emit('productEmit', true)
//         } else{
//             this.$message.error(res.message)
//         }
//       }).catch(err => {
//         console.error(err)
//         this.loading = false
//       })
//     },
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
    onCancel(){
        this.dialogFormVisible = false
        this.form.imageUrl = ''
        this.form.content = ''
        this.form.imageName = ''
    },
    onConfirm(){
        console.log(this.form.imageUrl)
        if(this.form.imageUrl == '' || this.form.content == '' || this.form.imageName == '') return this.$message.error('请输入所有已归档的内容')
        
        let data = {
            imagename:this.form.imageName,
            content:this.form.content,
            url:this.form.imageUrl
        }

       const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
       
       upload_article(data)
        .then((res) => {
            loading.close();
          console.log("res ", res);
          
          if (res.success && res.code == 200) {
             this.$message.success(res.msg)
            this.GetArticleList()
             this.dialogFormVisible = false
                this.form.imageUrl = ''
               this.form.content = ''
               this.form.imageName = ''
            //this.$store.commit('stock/SET_ORDER_LIST', res.data)
          }else{
             this.$message.error(res.msg)
          }
          this.listLoading = false;
        })
        .catch((e) => {
            loading.close();
          this.listLoading = false;
        });
    },
       refreshOrder() {
      this.page = 1;
      this.GetArticleList();
    },
    getOrderSearch() {
      this.page = 1;
      this.GetArticleList();
    },
    GetArticleList(){
       let send_ = {
        find_id: this.find_id,
        pageSize: this.perPage,
        currentPage: this.page,
      };
     this.listLoading = true;
      get_article_list(send_)
        .then((res) => {
          console.log("res ", res);
          if (res.success && res.code == 200) {
            this.articleList = res.data;
            //this.$store.commit('stock/SET_ORDER_LIST', res.data)
          }
          this.listLoading = false;
        })
        .catch((e) => {
          this.listLoading = false;
        });
    },
    deleteArticle(row){
        console.log(row)
       let send_ = {
        article_id: row.article_id,
      };
     this.listLoading = true;
      delete_article(send_)
        .then((res) => {
          console.log("res ", res);
           
          if (res.success && res.code == 200) {
            this.GetArticleList();
            this.$message.success(res.msg)
          }else{
              this.$message.error(res.msg)
          }
          this.listLoading = false;
        })
        .catch((e) => {
          this.listLoading = false;
        });
    },
   
   createProduct(){
    this.dialogFormVisible = true
   },


    
    clickUpload(row) {
      this.uploadData = JSON.parse(JSON.stringify(row))
      this.$nextTick(() => {
        this.$refs.uploadRef.dialogFormVisible = true
      })
    },






    PaginationEvent(props) {
      this.handlePagination(props)
    },
    handlePagination(props) {
      props.action === 'limit' ? this.page = 1 : this.page = props.page
      this.perPage = props.limit
      //this.getProduct()
    },
  }
}
</script>
