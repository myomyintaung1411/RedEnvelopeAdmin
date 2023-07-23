<template>
  <div class="app-container">
    <div style="display: flex; align-items: center">
      <el-input
        v-model="find_id"
        placeholder="查询id(可选）"
        size="small"
        clearable
        style="width: 150px"
      ></el-input>
      <el-input
        v-model="find_name"
        placeholder="查询帐号(可选）"
        size="small"
        clearable
        style="margin-left: 10px; width: 150px"
      ></el-input>

      <el-input
        v-model="nickname"
        placeholder="查询昵称(可选）"
        size="small"
        clearable
        style="margin-left: 10px; width: 150px"
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

    <!-- <div style="display: flex; justify-content: flex-start; margin: 10px 0 0 0;">
      <el-button size="small" type="text" @click="selectDate('1')">今日</el-button>
      <el-button size="small" type="text" @click="selectDate('2')">昨日</el-button>
      <el-button size="small" type="text" @click="selectDate('3')">本周</el-button>
      <el-button size="small" type="text" @click="selectDate('4')">上周</el-button>
      <el-button size="small" type="text" @click="selectDate('5')">本月</el-button>
      <el-button size="small" type="text" @click="selectDate('6')">上月</el-button>
    </div> -->

    <div style="margin: 5px"></div>
    <el-table
      v-loading="listLoading"
      :data="memberInfoData.record"
      element-loading-text="Loading"
      border
      fit
      height="720"
      highlight-current-row
    >
      <el-table-column
        label="ID"
        show-overflow-tooltip
        width="70"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.user_id }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="帐号"
        show-overflow-tooltip
        width="110"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.account }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="昵称"
        show-overflow-tooltip
        width="130"
        align="center"
      >
        <template slot-scope="scope">
          {{ scope.row.nickname }}
        </template>
      </el-table-column>
      <el-table-column
        label="创建时间"
        show-overflow-tooltip
        width="150"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.reference_name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="登录ip"
        show-overflow-tooltip
        width="150"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.login_ip }}</span>
        </template>
      </el-table-column>

      <el-table-column label="余额" show-overflow-tooltip width="90" align="right">
        <template slot-scope="scope">
          <span>{{ scope.row.balance }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="抢单日期"
        show-overflow-tooltip
        width="170"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.regist_time }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="抢单日期"
        show-overflow-tooltip
        width="170"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.login_time }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="开户行"
        show-overflow-tooltip
        width="170"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.bank }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="户头账户"
        show-overflow-tooltip
        width="170"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.card_name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="卡号"
        show-overflow-tooltip
        width="170"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.bank_card }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="身份证"
        show-overflow-tooltip
        width="170"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.id_code }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="手机号"
        show-overflow-tooltip
        width="170"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>
    </el-table>
    <div v-if="memberInfoData.count">
      <Pagination
        style="float: right; margin-top: 20px; margin-right: -20px"
        :background="true"
        :total="memberInfoData.count"
        :page.sync="page"
        :limit.sync="perPage"
        @pagination="PaginationEvent"
      />
    </div>
  </div>
</template>

<script>
import elDragDialog from "@/directive/el-drag-dialog";
import { memberInfo } from "@/api/user";
import { mapState, mapGetters } from "vuex";
import moment from "moment";
// import Update from './action/edit.vue'
import Pagination from "@/components/Pagination";

export default {
  name: "OrderList",
  directives: { elDragDialog },
  filters: {
    //   statusFilter(status) {
    //     const statusMap = {
    //       published: 'success',
    //       draft: 'gray',
    //       deleted: 'danger'
    //     }
    //     return statusMap[status]
    //   }
    dateFilter(date) {
      if (date) {
        return moment(date).format("YYYY-MM-DD HH:mm:ss");
      }
      return "";
    },
  },
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

      page: 1,
      perPage: 20,
      find_id: "",
      find_name: "",
      nickname: "",
      memberInfoData: {},
    };
  },
  computed: {
    // ...mapState({
    //   orderList: state => state.stock.orderList,
    // }),
    // ...mapGetters(['imageBase'])
  },
  mounted() {
    this.getMemberInfo();
  },
  methods: {
    refreshOrder() {
      this.page = 1;
      this.getMemberInfo();
    },
    getOrderSearch() {
      this.page = 1;
      this.getMemberInfo();
    },
    getMemberInfo() {
      let send_ = {
        find_id: this.find_id,
        find_name: this.find_name,
        nickname: this.nickname,
        pageSize: this.perPage,
        currentPage: this.page,
      };
       this.listLoading = true;
      memberInfo(send_)
        .then((res) => {
          console.log("res ", res);
          if (res.success && res.code == 200) {
            this.memberInfoData = res.data;
            //this.$store.commit('stock/SET_ORDER_LIST', res.data)
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
      this.getMemberInfo();
    },
  },
};
</script>
