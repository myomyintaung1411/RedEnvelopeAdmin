<template>
  <div class="app-container">
    <div style="display: flex; align-items: center;border-bottom:1px solid #eee;padding-bottom:10px;">
      <!-- <el-button
        icon="el-icon-plus"
        type="primary"
        size="medium"
        style="margin-left: 10px"
        @click="openRedpackage"
        >设定红包金额</el-button
      >
      <el-button
        icon="el-icon-plus"
        type="primary"
        size="medium"
        style="margin-left: 10px"
        @click="openNotice"
        >设定公告内容</el-button
      > -->

      <el-button icon="el-icon-refresh" type="primary" size="medium" style="margin-left: 10px"
        @click="refreshOrder">刷新</el-button>
    </div>

    <div style="margin: 5px"></div>

    <div style="margin-top: 20px;min-width:1250px;">
      <div>
        <el-row :gutter="20">
          <el-col :span="3">
            <div>
              <el-button icon="el-icon-setting" type="primary" size="medium" style="margin-left: 10px"
                @click="openRedpackage">设定红包金额</el-button>
            </div>
          </el-col>
          <el-col v-if="setup_data" :span="4">
            <div class="grid-content bg-purple">
              <div style="line-height: 36px;text-align:center; color: #1060B1;">红包金额</div>
            </div>
          </el-col>

          <el-col v-if="setup_data" :span="12">
            <div class="grid-content bg-purple">
              <div style="line-height: 36px;text-align:center;">{{ setup_data.amount }}</div>
            </div>
          </el-col>
        </el-row>
      </div>

      <div style="margin-top:10px">
        <el-row :gutter="20">
          <el-col :span="3">
            <div>
              <el-button icon="el-icon-setting" type="primary" size="medium" style="margin-left: 10px"
                @click="openNotice">设定公告内容</el-button>
            </div>
          </el-col>
          <el-col v-if="setup_data" :span="4">
            <div class="grid-content bg-purple">
              <div style="line-height: 36px;text-align:center;color: #1060B1;">公告内容</div>
            </div>
          </el-col>

          <el-col v-if="setup_data" :span="12">
            <div class="grid-content bg-purple">
              <div style="line-height: 36px;text-align:center;padding:3px;font-size:14px;
                overflow: hidden; text-overflow: ellipsis; white-space: nowrap; width: 100%;">{{ setup_data.msg }}
              </div>
            </div>
          </el-col>
        </el-row>
      </div>

      <div style="margin-top:10px">
        <el-row :gutter="20">
          <el-col :span="3">
            <div>
              <el-button icon="el-icon-setting" type="primary" size="medium" style="margin-left: 10px"
                @click="openLevel">设定推荐奖
              </el-button>
            </div>
          </el-col>

          <el-col v-if="setup_data" :span="4">
            <div class="grid-content bg-purple">
              <div style="line-height: 36px;text-align:center;color: #1060B1;">一级推荐奖 : <span style="color:red">{{
                setup_data.referral_reward1 }}</span></div>
            </div>
          </el-col>

          <el-col v-if="setup_data" :span="4">
            <div class="grid-content bg-purple">
              <div style="line-height: 36px;text-align:center;color: #1060B1;">二级推荐奖 : <span style="color:red">{{
                setup_data.referral_reward2 }}</span></div>
            </div>
          </el-col>
          <el-col v-if="setup_data" :span="4">
            <div class="grid-content bg-purple">
              <div style="line-height: 36px;text-align:center;color: #1060B1;">三级推荐奖 : <span style="color:red">{{
                setup_data.referral_reward3 }}</span></div>
            </div>
          </el-col>
        </el-row>
      </div>

      <div style="margin-top:10px">
        <el-row :gutter="20">
          <el-col :span="3">
            <div>
              <el-button icon="el-icon-setting" type="primary" size="medium" style="margin-left: 10px">设定提现状态
              </el-button>
            </div>
          </el-col>

          <el-col v-if="setup_data" :span="4">
            <div class="grid-content bg-purple">
              <div style="line-height: 36px;text-align:center;color: #1060B1;">可提现状态</div>
            </div>
          </el-col>
          <el-col v-if="setup_data" :span="4">
            <div class="grid-content bg-purple"
              style="display: flex; justify-content: center; align-items: center; height: 38px;">
              <el-switch v-model="setup_data.is_withdraw"  :active-value="1"
              :inactive-value="0" active-text="可提现" inactive-text="关闭中"
                @change="changeWithdrawStatus(setup_data.is_withdraw)">
              </el-switch>
            </div>
          </el-col>
        </el-row>
      </div>


    </div>

    <el-dialog title="设定红包金额" :visible.sync="redpackge_dialog" :close-on-click-modal="false" width="500px"
      @close="onCancel">
      <el-form ref="form" label-width="90px">
        <el-form-item label="金额">
          <el-input v-model="red_pack_money" type="number"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer">
        <el-button @click="onCancel()">取消</el-button>
        <el-button type="primary" :loading="loading" @click="onConfirm_Red_Pack()">确认</el-button>
      </div>
    </el-dialog>

    <!-- <el-dialog
      title="设定公告内容"
      :visible.sync="notice_dialog"
      :close-on-click-modal="false"
      width="500px"
      @close="onCancel"
    >
      <el-form ref="form" label-width="90px">
        <el-form-item label="公告内容">
          <el-input v-model="notice" type="textarea" :rows="4"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer">
        <el-button @click="onCancel()">取消</el-button>
        <el-button type="primary" :loading="loading" @click="onConfirm_Notice()"
          >确认</el-button
        >
      </div>
    </el-dialog> -->

    <el-dialog title="设定公告内容" :visible.sync="notice_dialog" :close-on-click-modal="false" fullscreen
      :destroy-on-close="true" @close="onCancel">
      <div>
        <VueEditor id="editor" useCustomImageHandler :editorOptions="editorSettings" @image-added="handleImageAdded"
          v-model="form.content" style="height: 600px;">
        </VueEditor>
      </div>

      <div slot="footer" style="margin-top:30px">
        <el-button @click="onCancel()">取消</el-button>
        <el-button type="primary" :loading="loading" @click="onConfirm_Notice()">确认</el-button>
      </div>
    </el-dialog>

    <el-dialog title="设定推荐奖" :visible.sync="level_dialog" :close-on-click-modal="false" width="500px" @close="onCancel">
      <el-form ref="form" label-width="90px">
        <el-form-item label="一级推荐奖">
          <el-input v-model="lvl1" type="number"></el-input>
        </el-form-item>
        <el-form-item label="二级推荐奖">
          <el-input v-model="lvl2" type="number"></el-input>
        </el-form-item>
        <el-form-item label="三级推荐奖">
          <el-input v-model="lvl3" type="number"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer">
        <el-button @click="onCancel()">取消</el-button>
        <el-button type="primary" :loading="loading" @click="onConfirm_level()">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import elDragDialog from "@/directive/el-drag-dialog";
import { notice_setup, redpackage_setup, get_setup, referral_setup, UploadImage } from "@/api/stock";
import { mapState, mapGetters } from "vuex";
import moment from "moment";
// import Update from './action/edit.vue'
import Pagination from "@/components/Pagination";


import { VueEditor, Quill } from 'vue2-editor'
import { ImageDrop } from "quill-image-drop-module";
import ImageResize from "quill-image-resize-module";
import { withdraw_setup } from "@/api/user";

Quill.register('modules/imageDrop', ImageDrop)
Quill.register('modules/imageResize', ImageResize)

export default {
  name: "OrderList",
  directives: { elDragDialog },
  components: {
    // Update
    Pagination,
    VueEditor
  },
  data() {
    return {
      dialogFormVisible: false,
      list: null,
      listLoading: false,
      loading: false,

      redpackge_dialog: false,
      notice_dialog: false,

      notice: "",
      red_pack_money: "",
      setup_data: {
        is_withdraw: 0,
        lvl1: '',
        lvl2: '',
        lvl3: '',
        msg: ''
      },
      level_dialog: false,
      lvl1: '',
      lvl2: '',
      lvl3: '',
      wstate: true,

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
      form: {
        imageName: '',
        content: '',
        imageUrl: ''
      },

    };
  },
  computed: {
    // ...mapState({
    //   orderList: state => state.stock.orderList,
    // }),
    // ...mapGetters(['imageBase'])
  },
  mounted() {
    this.Get_Setup_Api();
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
        console.log(res, "res,,,,,,,,,,,")

        if (res.code == 0) {
          this.form.imageUrl = res.data.url
          //Editor.insertEmbed(cursorLocation, "image", this.form.imageUrl);
          Editor.insertEmbed(cursorLocation, "image", 'https://sxh-cn.oss-cn-hongkong.aliyuncs.com/' + res.data.name);
          this.$message.success(res.message)
          resetUploader();
          //this.onCancel()
          // this.$emit('productEmit', true)
        } else {
          this.$message.error(res.message)
        }
      }).catch(err => {
        console.error(err)
        this.loading = false
      })
    },
    refreshOrder() {
      this.Get_Setup_Api();
    },
    Get_Setup_Api() {
      this.listLoading = true;
      get_setup()
        .then((res) => {
          console.log("res ", res);
          if (res.success && res.code == 200) {
            this.$message.success(res.msg);
            this.setup_data = res.data
          } else {
            this.$message.error(res.msg);
          }
          this.listLoading = false;
        })
        .catch((e) => {
          this.listLoading = false;
        });
    },

    openRedpackage() {
      if (this.setup_data?.amount && this.setup_data?.amount != '') {
        this.red_pack_money = this.setup_data.amount
      }
      this.redpackge_dialog = true;
    },
    openNotice() {
      if (this.setup_data?.msg && this.setup_data?.msg != '') {
        this.form.content = this.setup_data.msg
      }
      this.notice_dialog = true;
    },
    openLevel() {
      if (this.setup_data?.referral_reward3 && this.setup_data?.referral_reward3 != '') {
        this.lvl1 = this.setup_data.referral_reward1
        this.lvl2 = this.setup_data.referral_reward2
        this.lvl3 = this.setup_data.referral_reward3
      }
      this.level_dialog = true;
    },
    onCancel() {
      this.redpackge_dialog = false;
      this.notice_dialog = false;
      this.level_dialog = false;
      this.lvl1 = ''
      this.lvl2 = ''
      this.lvl3 = ''
      this.notice = "";
      this.red_pack_money = "";
    },
    onConfirm_level() {
      if (this.lvl1 == "" || this.lvl2 == "" || this.lvl3 == "") return this.$message.error("请输入金额");
      let send_ = {
        referral_reward1: this.lvl1,
        referral_reward2: this.lvl2,
        referral_reward3: this.lvl3,
      };

      this.listLoading = true;
      referral_setup(send_)
        .then((res) => {
          console.log("res ", res);
          if (res.success && res.code == 200) {
            this.$message.success(res.msg);
            this.Get_Setup_Api();
            this.onCancel();
          } else {
            this.$message.error(res.msg);
          }
          this.listLoading = false;
        })
        .catch((e) => {
          this.listLoading = false;
        });
    },
    onConfirm_Red_Pack() {
      if (this.red_pack_money == "") return this.$message.error("请输入金额");
      let send_ = {
        amount: this.red_pack_money,
      };

      this.listLoading = true;
      redpackage_setup(send_)
        .then((res) => {
          console.log("res ", res);
          if (res.success && res.code == 200) {
            this.$message.success(res.msg);
            this.Get_Setup_Api();
            this.onCancel();
          } else {
            this.$message.error(res.msg);
          }
          this.listLoading = false;
        })
        .catch((e) => {
          this.listLoading = false;
        });
    },
    onConfirm_Notice() {
      if (this.form.content == "") return this.$message.error("请输入公告内容");
      let send_ = {
        content: this.form.content,
      };

      this.listLoading = true;
      notice_setup(send_)
        .then((res) => {
          console.log("res ", res);
          if (res.success && res.code == 200) {
            this.$message.success(res.msg);
            this.Get_Setup_Api();
            this.onCancel();
          } else {
            this.$message.error(res.msg);
          }
          this.listLoading = false;
        })
        .catch((e) => {
          this.listLoading = false;
        });
    },

    changeWithdrawStatus(status) {
      let st = status == 1 ? 1 : 0
      let send = {
        is_withdraw: st
      }
      withdraw_setup(send)
        .then((res) => {
          console.log("res ", res);
          if (res.success && res.code == 200) {
            this.$message.success(res.msg);
            this.Get_Setup_Api();
            // this.onCancel();
          } else {
            this.$message.error(res.msg);
          }
          this.listLoading = false;
        })
        .catch((e) => {
          this.listLoading = false;
        });
    },

    PaginationEvent(props) {
      this.handlePagination(props);
    },
    handlePagination(props) {
      props.action === "limit" ? (this.page = 1) : (this.page = props.page);
      this.perPage = props.limit;
      this.getFundRecord();
    },
  },
};
</script>

<style lang="scss" scoped>
.el-col {
  border-radius: 4px;
}

.bg-purple {
  //   background: #d3dce6;
  border: 1px solid #f5f5f5;
  box-shadow: rgb(204, 219, 232) 3px 3px 6px 0px inset, rgba(255, 255, 255, 0.5) -3px -3px 6px 1px inset;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}

.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
</style>