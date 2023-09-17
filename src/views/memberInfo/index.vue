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

      <el-input v-model="reference_name" placeholder="上级" size="small" clearable
        style="margin-left: 10px; width: 150px"></el-input>
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

    <div v-if="ulist.length >= 0">
      返回列表：
      <!-- <el-button type="text" @click="clickOwn()">{{ 'admin' }} >> </el-button> -->
      <span v-for="u in ulist" :key="u">
        <el-button type="text" @click="clickBtn(u)">{{ u }} >> </el-button>
      </span>
    </div>
    <el-table v-loading="listLoading" :data="memberInfoData.record" element-loading-text="Loading"
      :header-cell-style="{ color: '', background: '#F5F5F5', padding: '5px 0px' }" border stripe fit height="740"
      highlight-current-row>
      <el-table-column label="操作" width="110" align="center">
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
                  <div @click="freezeAmount(scope.row, 0)" style="width: 100%; font-size: 14px; color: #1060B1;">冻结</div>
                </el-dropdown-item>
                <el-dropdown-item style="width: 100%; margin: 0px!important; text-align: center;">
                  <div @click="freezeAmount(scope.row, 1)" style="width: 100%; font-size: 14px; color: #1060B1;">解冻</div>
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
      <!-- <el-table-column label="关系" show-overflow-tooltip width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.gx_name.join('/') }}</span>
        </template>
      </el-table-column> -->

      <el-table-column label="手机号" show-overflow-tooltip width="120" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>

      <el-table-column label="姓名" show-overflow-tooltip width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.real_name }}</span>
        </template>
      </el-table-column>

      <el-table-column label="邀请码" show-overflow-tooltip width="80" align="center">
        <template slot-scope="scope">
          <span style="cursor: pointer; color: #1060B1" @click="getDirectUserlist(scope.row)">{{ scope.row.referral_code }}</span>
        </template>
      </el-table-column>

      <el-table-column label="身份证号" show-overflow-tooltip width="170" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.id_code }}</span>
        </template>
      </el-table-column>

      <el-table-column label="银行卡姓名" show-overflow-tooltip width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.card_name }}</span>
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

      <el-table-column label="直属上级" show-overflow-tooltip width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.reference_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="下级数量" show-overflow-tooltip width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.subordinate_number }}</span>
        </template>
      </el-table-column>
      <el-table-column label="关系" show-overflow-tooltip width="150" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.gx_name.join('/') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="账户状态" show-overflow-tooltip width="90" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.enable == 1 ? '正常' : scope.row.enable == 0 ? '冻结' : '' }}</span>
        </template>
      </el-table-column>

      <el-table-column label="注册日期" show-overflow-tooltip width="160" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.regist_time }}</span>
        </template>
      </el-table-column>


      <el-table-column label="注册ip" show-overflow-tooltip width="260" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.regist_ip }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="登录ip" show-overflow-tooltip width="150" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.login_ip }}</span>
        </template>
      </el-table-column> -->
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
    <Freeze ref="freezeRef" :freeze-data="freezeData" :is-freeze="isFreeze" @userEmit="userEmit" />
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
import { getIP } from '@/api/ip'

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
      ulist: [],

      page: 1,
      perPage: 50,
      find_id: "",
      find_name: "",
      reference_name: '',
      nickname: "",
      amount_from: '',
      amount_to: '',
      phone: '',
      id_code: '',
      referalScore: '',

      nameData: {},
      phoneData: {},
      passData: {},
      freezeData: {},
      isFreeze: ''
    };
  },
  computed: {
    ...mapState({
      memberInfoData: state => state.stock.userList,
    })
  },
  mounted() {
    this.reference_name = ''
    this.getMemberInfo();
  },
  methods: {
    /**
     * 遍历好的数组列表“去重”后获取对应IP地理位置
     * 为了避免相同ip一页内，多次请求
     * @param {Object} tableData 数据列
     */
    mapIP(tableData) {
      console.log('mapIp', tableData)
      let arr = tableData
      var hash=[]
      for (var i = 0; i < arr.length; i++) {
        for (var j = i+1; j < arr.length; j++) {
          if(arr[i].regist_ip===arr[j].regist_ip) {
            ++i
          }
        }
        hash.push(arr[i])
      }
      hash.map(async v => {
        v.Ipp = ' ' + await this.getIPAddress(v.regist_ip)
        tableData.forEach(vv => {
          if(vv.regist_ip === v.regist_ip) {
            vv.regist_ip += v.Ipp
          }
        })
      })
    },
    async getIPAddress(ip) {
      let {data} = await getIP(ip)
      if(data.data.length > 0) {
        return data.data[0].location
      } else {
        return ''
      }
    },
    clickCode(user) {
      this.ulist.push(user.account)
      this.reference_name = user.account
    },
    refreshOrder() {
      this.page = 1;
      this.getMemberInfo();
    },
    getOrderSearch() {
      this.page = 1;
      this.getMemberInfo();
    },
    clickOwn() {
      this.ulist = []
      this.reference_name = ''
      this.getMemberInfo()
    },
    splitIP(ip) {
      if (ip == '' || ip == null || ip == undefined) return ''
      let ips = ip.split(',')
      // console.log('ips ', ips)
      if (ips.length == 2) {
        return ips[0] || ''
      }
      if (ips.length == 3) return ips[1] || ''
      return ips[0] || ''
    },
    clickBtn(u) {

      if (u == 'admin') {
        this.clickOwn()
        return
      }
      var index = this.ulist.indexOf(u); // 找到要删除的用户在数组中的位置
      if (index !== -1) {
        this.ulist.splice(index + 1); // 删除该位置及其后面的元素
      }
      this.reference_name = u
      this.page = 1
      let send_ = {
        pageSize: this.perPage,
        currentPage: this.page,
        reference_name: u
      };
      // if (this.find_id.trim() != '') send_['find_id'] = this.find_id.trim()
      // if (this.find_name.trim() != '') send_['find_name'] = this.find_name.trim()
      // if (this.id_code.trim() != '') send_['id_code'] = this.id_code.trim()
      // if (this.phone.trim() != '') send_['phone'] = this.phone.trim()
      if (this.amount_from != '' && this.amount_to != '') {
        send_['referalScore'] = this.amount_from + "-" + this.amount_to
      }
      this.listLoading = true;
      memberInfo(send_)
        .then((res) => {
          console.log("res ", res);
          if (res.success && res.code == 200) {
            // this.memberInfoData = res.data;
            let sdata = res.data
            if (sdata?.record && sdata?.record?.length > 0) {
              this.ulist = []
              this.ulist = sdata?.record[0].gx_name
              sdata?.record?.map(u => {
                u.regist_ip = this.splitIP(u?.regist_ip)
                u.login_ip = this.splitIP(u?.login_ip)
              })
              this.mapIP(sdata.record)
            }
            this.$store.commit('stock/SET_USER_LIST', sdata)
          }
          this.listLoading = false;
        })
        .catch((e) => {
          this.listLoading = false;
        });
    },
    getMemberInfo() {
      let send_ = {
        pageSize: this.perPage,
        currentPage: this.page
      };
      if (this.find_id.trim() != '') send_['find_id'] = this.find_id.trim()
      if (this.find_name.trim() != '') send_['find_name'] = this.find_name.trim()
      if (this.id_code.trim() != '') send_['id_code'] = this.id_code.trim()
      if (this.reference_name.trim() != '') {
        send_['reference_name'] = this.reference_name.trim()
      } else {
        if (this.phone.trim() != '') send_['phone'] = this.phone.trim()
      }
      // if (this.phone.trim() != '') send_['phone'] = this.phone.trim()
      // if (this.reference_name.trim() != '') send_['reference_name'] = this.reference_name.trim()
      if (this.amount_from != '' && this.amount_to != '') {
        send_['referalScore'] = this.amount_from + "-" + this.amount_to
      }
      this.listLoading = true;
      memberInfo(send_)
        .then((res) => {
          console.log("res ", res);
          if (res.success && res.code == 200) {
            // this.memberInfoData = res.data;
            let sdata = res.data
            if (sdata?.record && sdata?.record?.length > 0) {
              this.ulist = []
              this.ulist = sdata?.record[0].gx_name
              sdata?.record?.map(u => {
                u.regist_ip = this.splitIP(u?.regist_ip)
                u.login_ip = this.splitIP(u?.login_ip)
              })
              this.mapIP(sdata.record)
            }
            this.$store.commit('stock/SET_USER_LIST', sdata)
          }
          this.listLoading = false;
        })
        .catch((e) => {
          this.listLoading = false;
        });
    },
    getDirectUserlist(row) {
      this.clickCode(row)
      this.page = 1
      let send_ = {
        pageSize: this.perPage,
        currentPage: this.page,
        reference_name: row.account
      };
      // if (this.find_id.trim() != '') send_['find_id'] = this.find_id.trim()
      // if (this.find_name.trim() != '') send_['find_name'] = this.find_name.trim()
      // if (this.id_code.trim() != '') send_['id_code'] = this.id_code.trim()
      // if (this.phone.trim() != '') send_['phone'] = this.phone.trim()
      if (this.amount_from != '' && this.amount_to != '') {
        send_['referalScore'] = this.amount_from + "-" + this.amount_to
      }
      this.listLoading = true;
      memberInfo(send_)
        .then((res) => {
          console.log("res ", res);
          if (res.success && res.code == 200) {
            // this.memberInfoData = res.data;
            let sdata = res.data
            if (sdata?.record && sdata?.record?.length > 0) {
              this.ulist = []
              this.ulist = sdata?.record[0].gx_name.shift()
              sdata?.record?.map(u => {
                u.regist_ip = this.splitIP(u?.regist_ip)
                u.login_ip = this.splitIP(u?.login_ip)
              })
              this.mapIP(sdata.record)
            }
            this.$store.commit('stock/SET_USER_LIST', sdata)
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
    freezeAmount(row, type) { // 1解冻 0冻结
      this.freezeData = JSON.parse(JSON.stringify(row))
      this.isFreeze = type
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
