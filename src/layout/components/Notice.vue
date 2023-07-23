<template>
  <div>
    <el-dialog
      v-el-drag-dialog
      title="登录提示"
      :visible.sync="dialogVisible"
      :width="device !== 'mobile' ? '30%' : '85%'"
      :close-on-click-modal="true"
      center
    >
      登录系统成功，请点击任意地区关闭弹窗。
      <!-- <el-result icon="info" :sub-title="'登录系统成功，请点击任意地区关闭弹窗。'">
        <template slot="extra">
          <el-button type="primary" size="medium" @click="close">关闭</el-button>
        </template>
      </el-result> -->
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui

export default {
  directives: { elDragDialog },
  data() {
    return {
      dialogVisible: false
    }
  },
  computed: {
    ...mapState({
      device: state => state.app.device
    })
  },
  mounted() {
    // this.getNotcieMsg()
  },
  methods: {
    close() {
      // this.$store.state.user.alert.visible = false
      // setAlertState(false)
    }
  }
}
</script>
