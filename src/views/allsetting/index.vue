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

      <el-button
        icon="el-icon-refresh"
        type="primary"
        size="medium"
        style="margin-left: 10px"
        @click="refreshOrder"
        >刷新</el-button
      >
    </div>

    <div style="margin: 5px"></div>

    <div v-if="setup_data"  style="margin-top: 20px;min-width:1250px;">
        <div >
         <el-row :gutter="20">
            <el-col :span="3">
            <div>
                <el-button icon="el-icon-setting" type="primary" size="medium" style="margin-left: 10px" @click="openRedpackage" >设定红包金额</el-button>
            </div>
            </el-col>
            <el-col :span="4"><div class="grid-content bg-purple">
                <div style="line-height: 36px;text-align:center">红包金额</div>
                </div>
            </el-col>

            <el-col :span="12"><div class="grid-content bg-purple">
                <div style="line-height: 36px;text-align:center;color:red">{{setup_data.amount}}</div>
                </div>
            </el-col>
        </el-row>
     </div>

    <div style="margin-top:10px">
         <el-row :gutter="20">
        <el-col :span="3">
         <div>
      <el-button icon="el-icon-setting" type="primary" size="medium"  style="margin-left: 10px"   @click="openNotice" >设定公告内容</el-button >
         </div>
        </el-col>
        <el-col :span="4"><div class="grid-content bg-purple">
            <div style="line-height: 36px;text-align:center">公告内容</div>
            </div>
        </el-col>

        <el-col :span="12"><div class="grid-content bg-purple">
            <div style="line-height: 36px;text-align:center;color:red;padding:3px;font-size:14px;">{{setup_data.msg}}</div>
            </div></el-col>
      </el-row>
    </div>
    </div>

    <el-dialog
      title="设定红包金额"
      :visible.sync="redpackge_dialog"
      :close-on-click-modal="false"
      width="500px"
      @close="onCancel"
    >
      <el-form ref="form" label-width="90px">
        <el-form-item label="金额">
          <el-input v-model="red_pack_money" type="number"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer">
        <el-button @click="onCancel()">取消</el-button>
        <el-button
          type="primary"
          :loading="loading"
          @click="onConfirm_Red_Pack()"
          >确认</el-button
        >
      </div>
    </el-dialog>

    <el-dialog
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
    </el-dialog>
  </div>
</template>

<script>
import elDragDialog from "@/directive/el-drag-dialog";
import { notice_setup, redpackage_setup, get_setup } from "@/api/stock";
import { mapState, mapGetters } from "vuex";
import moment from "moment";
// import Update from './action/edit.vue'
import Pagination from "@/components/Pagination";

export default {
  name: "OrderList",
  directives: { elDragDialog },
  components: {
    // Update
    Pagination,
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
      setup_data:''
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
      this.redpackge_dialog = true;
    },
    openNotice() {
      this.notice_dialog = true;
    },
    onCancel() {
      this.redpackge_dialog = false;
      this.notice_dialog = false;
      this.notice = "";
      this.red_pack_money = "";
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
      if (this.notice == "") return this.$message.error("请输入公告内容");
      let send_ = {
        content: this.notice,
      };

      this.listLoading = true;
      notice_setup(send_)
        .then((res) => {
          console.log("res ", res);
          if (res.success && res.code == 200) {
            this.$message.success(res.msg);
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
 border:1px solid #000;
 
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