<template>
  <div class="app-container">
    <div style="display: flex; align-items: center">
      <el-input v-model="find_id" placeholder="ID" size="small" clearable style="width: 150px"></el-input>

      <el-input v-model="phone" placeholder="手机号" size="small" clearable
        style="margin-left: 10px; width: 150px"></el-input>

      <!-- <el-input
        v-model="nickname"
        placeholder="昵称"
        size="small"
        clearable
        style="margin-left: 10px; width: 150px"
      ></el-input> -->

      <el-input v-model="find_name" placeholder="姓名" size="small" clearable
        style="margin-left: 10px; width: 150px"></el-input>

      <el-input v-model="id_code" placeholder="身份证号" size="small" clearable
        style="margin-left: 10px; width: 150px"></el-input>

      <el-input v-model="amount_from" placeholder="推荐金从" size="small" clearable
        style="margin-left: 10px; width: 150px"></el-input>
      <span style="margin-left: 5px;">-</span>
      <el-input v-model="amount_to" placeholder="至推荐金" size="small" clearable
        style="margin-left: 10px; width: 150px"></el-input>

      <el-button icon="el-icon-search" type="text" size="medium" style="margin-left: 10px"
        @click="getOrderSearch">搜索</el-button>
      <el-button icon="el-icon-refresh" type="text" size="medium" style="margin-left: 10px"
        @click="refreshOrder">刷新</el-button>
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
    <el-table v-loading="listLoading" :data="memberInfoData.record" element-loading-text="Loading"
      :header-cell-style="{ color: '', background: '#F5F5F5', padding: '5px 0px' }" border stripe fit height="740"
      highlight-current-row>
      <el-table-column label="操作" width="130" align="center">
        <template slot-scope="scope">
          <div>
            <el-dropdown split-button type="primary" size="mini" trigger="click" :hide-on-click="true" style="margin-left: 5px;">
              <span class="el-dropdown-link">
                操作
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item style="width: 100%; margin: 0px!important; text-align: center;">
                  <div @click="chnageName(scope.row)" style="width: 100%; font-size: 14px; color: #1060B1;">更改姓名</div>
                </el-dropdown-item>
                <el-dropdown-item style="width: 100%; margin: 0px!important; text-align: center;">
                  <div @click="changePass(scope.row)" style="width: 100%; font-size: 14px; color: #1060B1;">更改密码</div>
                </el-dropdown-item>
                <el-dropdown-item style="width: 100%; margin: 0px!important; text-align: center;">
                  <div @click="changePhone(scope.row)" style="width: 100%; font-size: 14px; color: #1060B1;">更改手机号</div>
                </el-dropdown-item>
                <el-dropdown-item style="width: 100%; margin: 0px!important; text-align: center;">
                  <div @click="freezeAmount(scope.row)" style="width: 100%; font-size: 14px; color: #1060B1;">冻结</div>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="ID" show-overflow-tooltip width="70" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.user_id }}</span>
        </template>
      </el-table-column>

      <el-table-column label="手机号" show-overflow-tooltip width="120" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>

      <el-table-column label="姓名" show-overflow-tooltip width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.card_name }}</span>
        </template>
      </el-table-column>

      <el-table-column label="邀请码" show-overflow-tooltip width="80" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.referral_code }}</span>
        </template>
      </el-table-column>

      <el-table-column label="身份证号" show-overflow-tooltip width="170" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.id_code }}</span>
        </template>
      </el-table-column>

      <el-table-column label="银行名称" show-overflow-tooltip width="130" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.bank }}</span>
        </template>
      </el-table-column>

      <el-table-column label="银行卡号" show-overflow-tooltip width="170" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.bank_card }}</span>
        </template>
      </el-table-column>

      <el-table-column label="收获地址" show-overflow-tooltip width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.address }}</span>
        </template>
      </el-table-column>

      <el-table-column label="总余额" show-overflow-tooltip width="110" align="right">
        <template slot-scope="scope">
          <span style="color: blue">{{ scope.row.balance }}</span>
        </template>
      </el-table-column>

      <el-table-column label="推荐分" show-overflow-tooltip width="110" align="right">
        <template slot-scope="scope">
          <span style="color: blue">{{ scope.row.referal_score }}</span>
        </template>
      </el-table-column>

      <el-table-column label="红包积分" show-overflow-tooltip width="110" align="right">
        <template slot-scope="scope">
          <span style="color: blue">{{ scope.row.redpack_score }}</span>
        </template>
      </el-table-column>

      <el-table-column label="直属上级" show-overflow-tooltip width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.reference_name }}</span>
        </template>
      </el-table-column>

      <el-table-column label="注册日期" show-overflow-tooltip width="160" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.regist_time }}</span>
        </template>
      </el-table-column>


      <el-table-column label="登录ip" show-overflow-tooltip width="150" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.login_ip }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column
        label="登录日期"
        show-overflow-tooltip
        width="170"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.login_time }}</span>
        </template>
      </el-table-column> -->

    </el-table>
    <div v-if="memberInfoData.count">
      <Pagination style="float: right; margin-top: 20px; margin-right: -20px" :background="true"
        :total="memberInfoData.count" :page.sync="page" :limit.sync="perPage" @pagination="PaginationEvent" />
    </div>

    <Name ref="nameRef" :name-data="nameData" @userEmit="userEmit" />
    <Phone ref="phoneRef" :phone-data="phoneData" @userEmit="userEmit" />
    <Pass ref="passRef" :pass-data="passData" @userEmit="userEmit" />
    <Freeze ref="freezeRef" :freeze-data="freezeData" @userEmit="userEmit" />
  </div>
</template>

<script>
import elDragDialog from "@/directive/el-drag-dialog";
import { memberInfo } from "@/api/user";
import { mapState, mapGetters } from "vuex";
import moment from "moment";
import Name from './action/name.vue'
import Phone from './action/phone.vue'
import Pass from './action/pass.vue'
import Freeze from './action/freeze.vue'
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
    Name,
    Phone,
    Pass,
    Freeze,
    Pagination,
  },
  data() {
    return {
      dialogFormVisible: false,
      list: null,
      listLoading: false,
      loading: false,

      page: 1,
      perPage: 50,
      find_id: "",
      find_name: "",
      nickname: "",
      amount_from: '',
      amount_to: '',
      phone: '',
      id_code: '',
      referalScore: '',

      nameData: {},
      phoneData: {},
      passData: {},
      freezeData: {}
    };
  },
  computed: {
    ...mapState({
      memberInfoData: state => state.stock.userList,
    })
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
        pageSize: this.perPage,
        currentPage: this.page
      };
      if (this.find_id.trim() != '') send_['find_id'] = this.find_id.trim()
      if (this.find_name.trim() != '') send_['find_name'] = this.find_name.trim()
      if (this.id_code.trim() != '') send_['id_code'] = this.id_code.trim()
      if (this.phone.trim() != '') send_['phone'] = this.phone.trim()
      if (this.amount_from != '' && this.amount_to != '') {
        send_['referalScore'] = this.amount_from + "-" + this.amount_to
      }
      this.listLoading = true;
      memberInfo(send_)
        .then((res) => {
          console.log("res ", res);
          if (res.success && res.code == 200) {
            // this.memberInfoData = res.data;
            this.$store.commit('stock/SET_USER_LIST', res.data)
          }
          this.listLoading = false;
        })
        .catch((e) => {
          this.listLoading = false;
        });
    },

    chnageName(row) {
      this.nameData = JSON.parse(JSON.stringify(row))
      this.$nextTick(() => {
        this.$refs.nameRef.dialogFormVisible = true
      })
    },
    changePass(row) {
      this.passData = JSON.parse(JSON.stringify(row))
      this.$nextTick(() => {
        this.$refs.passRef.dialogFormVisible = true
      })
    },
    changePhone(row) {
      this.phoneData = JSON.parse(JSON.stringify(row))
      this.$nextTick(() => {
        this.$refs.phoneRef.dialogFormVisible = true
      })
    },
    freezeAmount(row) {
      this.freezeData = JSON.parse(JSON.stringify(row))
      this.$nextTick(() => {
        this.$refs.freezeRef.dialogFormVisible = true
      })
    },

    userEmit(val) {
      if (val) {
        this.getMemberInfo()
      }
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
