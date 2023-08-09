<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">

      <div class="title-container">
        <h3 class="title">系统登录</h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="账号"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="密码"
          name="password"
          tabindex="2"
          auto-complete="on"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>

      <div style="display: flex;">
        <el-form-item prop="recaptcha" style="width: 100%">
          <span class="svg-container">
            <svg-icon icon-class="identify" />
          </span>
          <el-input
            ref="recaptcha"
            v-model="loginForm.recaptcha"
            placeholder="验证码"
            name="recaptcha"
            type="text"
            tabindex="3"
            autocomplete="off"
          />
        </el-form-item>
        <!-- <div v-html="identifyCode" style="cursor: pointer; right: 7%; display: flex; align-items: center; width: 130px; background-color: #00000060; height: 52px;" @click="refreshCode">
        
        </div> -->
        <div @click="refreshCode" style="cursor: pointer; right: 7%; display: flex; align-items: center; width: 130px; background-color: #00000060; height: 52px;" >
        <div class="img-verify " style="margin-top:6px">
                    <canvas ref="verify" :width="state.width" :height="state.height" @click="handleDraw" ></canvas>
              </div>
        </div>
      </div>

      <el-button :loading="loading" type="plain" style="width:100%;margin-bottom:30px; height: 60px; font-size: 16px; font-weight: bold; background-color: #00000090; color: white"
        @click.native.prevent="handleLogin('loginForm')">登入</el-button>

      <!-- <div class="tips">
        <span style="margin-right:20px;">username: admin</span>
        <span> password: any</span>
      </div> -->

    </el-form>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'
import { recaptchaApi } from '@/api/user'

export default {
  name: 'Login',
  data() {

    const validateUsername = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入账号'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      // if (value.length < 6) {
      //   callback(new Error('密码最少6位'))
      // } else {
      //   callback()
      // }
    // const validatePassword = (rule, value, callback) => {
      if (!value) {
            callback(new Error('密码字段必填'));
          } else {
            if (value.length < 6) {
              callback(new Error('密码最少6位'));
            } else {
              callback();
            }
          }

    }
    const validateRecaptcha = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入验证码'))
      } else {
        callback()
      }
    }
    return {
     state:{
       pool: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890', // 字符串
      width: 120,
      height: 50,
      imgCode: ''
    },
    code:'',
    
      loginForm: {
        // username: '09000000005',
        // password: 'admin5@stockxpass',
        username: 'admin',
        password: '111111',
        recaptcha: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        recaptcha: [{ required: true, trigger: 'blur', validator: validateRecaptcha }],
      },
      identifyCode: '',
      loading: false,
      passwordType: 'password',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  mounted() {
    this.state.imgCode = this.draw()
    //this.getRecaptcha()
  },
  methods: {
        // 点击图片重新绘制
     handleDraw ()  {
      this.state.imgCode = this.draw()
    },
        // 随机数
     randomNum  (min, max)  {
      return parseInt(Math.random() * (max - min) + min)
    },
        // 随机颜色
     randomColor (min, max)  {
      const r = this.randomNum(min, max)
      const g = this.randomNum(min, max)
      const b = this.randomNum(min, max)
      return `rgb(${r},${g},${b})`
    },

        // 绘制图片
     draw  ()  {
      // 3.填充背景颜色，背景颜色要浅一点
      const ctx = this.$refs.verify.getContext('2d')
      // 填充颜色
      ctx.fillStyle = this.randomColor(180, 230)
      // 填充的位置
      ctx.fillRect(0, 0, this.state.width, this.state.height)
      // 定义paramText
      let imgCode = ''
      // 4.随机产生字符串，并且随机旋转
      for (let i = 0; i < 4; i++) {
        // 随机的四个字
        const text = this.state.pool[this.randomNum(0, this.state.pool.length)]
        imgCode += text
        // 随机的字体大小
        const fontSize = this.randomNum(18, 40)
        // 字体随机的旋转角度
        const deg = this.randomNum(-30, 30)
        /*
         * 绘制文字并让四个文字在不同的位置显示的思路 :
         * 1、定义字体
         * 2、定义对齐方式
         * 3、填充不同的颜色
         * 4、保存当前的状态（以防止以上的状态受影响）
         * 5、平移translate()
         * 6、旋转 rotate()
         * 7、填充文字
         * 8、restore出栈
         * */
        ctx.font = fontSize + 'px Simhei'
        ctx.textBaseline = 'top'
        ctx.fillStyle = this.randomColor(80, 150)
        /*
         * save() 方法把当前状态的一份拷贝压入到一个保存图像状态的栈中。
         * 这就允许您临时地改变图像状态，
         * 然后，通过调用 restore() 来恢复以前的值。
         * save是入栈，restore是出栈。
         * 用来保存Canvas的状态。save之后，可以调用Canvas的平移、放缩、旋转、错切、裁剪等操作。 restore：用来恢复Canvas之前保存的状态。防止save后对Canvas执行的操作对后续的绘制有影响。
         *
         * */
        ctx.save()
        ctx.translate(30 * i + 15, 15)
        ctx.rotate((deg * Math.PI) / 180)
        // fillText() 方法在画布上绘制填色的文本。文本的默认颜色是黑色。
        // 请使用 font 属性来定义字体和字号，并使用 fillStyle 属性以另一种颜色/渐变来渲染文本。
        // context.fillText(text,x,y,maxWidth);
        ctx.fillText(text, -15 + 5, -15)
        ctx.restore()
      }
      // 5.随机产生5条干扰线,干扰线的颜色要浅一点
      for (let i = 0; i < 5; i++) {
        ctx.beginPath()
        ctx.moveTo(this.randomNum(0, this.state.width), this.randomNum(0, this.state.height))
        ctx.lineTo(this.randomNum(0, this.state.width), this.randomNum(0, this.state.height))
        ctx.strokeStyle = this.randomColor(180, 230)
        ctx.closePath()
        ctx.stroke()
      }
      // 6.随机产生40个干扰的小点
      for (let i = 0; i < 40; i++) {
        ctx.beginPath()
        ctx.arc(this.randomNum(0, this.state.width), this.randomNum(0, this.state.height), 1, 0, 2 * Math.PI)
        ctx.closePath()
        ctx.fillStyle = this.randomColor(150, 200)
        ctx.fill()
      }
      //state.imgCode = imgCode
      return imgCode
    },
    getRecaptcha() {
      recaptchaApi().then(res => {
        // console.log(res)
        this.identifyCode = res
      }).catch(e => {
        
      })
    },
    refreshCode() {
      //this.getRecaptcha()
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin(formName) {
        if (this.loginForm.recaptcha.replace(/\s/g, "").toLowerCase() != this.state.imgCode.replace(/\s/g, "").toLowerCase()) {
        this.state.imgCode = ''
        // NoticeMsg.Message(
        //   t('请输入正确的验证码'),
        //   "error"
        // );
        this.$message.error('请输入正确的验证码')
        return this.handleDraw();
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm).then((res) => {
               console.log('hhhhhhhhhhhhhhhhhhhhhh', res)
            if (res.success && res.code == 200) {
              this.$router.push({ path: this.redirect || '/' })
            } 
            else {
              // this.refreshCode()
              // if (res.errors !== null) {
              //   let key = Object.keys(res?.errors)[0]
              //   this.$message.error(res?.errors[key])
              // } else {
                this.$message.error(res.msg)

            }
            this.loading = false
          }).catch((e) => {
            console.log('eeeeeeeeeee ', e)
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#b4bfcc;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  background-color: #303030;
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;
      font-size: medium;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.5);
    background: rgba(0, 0, 0, 0.4);
    border-radius: 5px;
    color: #454545;
  }
}

</style>

<style lang="scss" scoped>
$bg:#aab1b9;
$dark_gray:#fff;
$light_gray:#fff;

.login-container {
  min-height: 100%;
  // background-color: $bg;
  position: absolute;
	width: 100%;
	height: 100%;
	// background: url(../../assets/images/bg.jpg) no-repeat center right #303030;
  // background-size: cover;
  margin: 0;
  background: url(../../assets/images/bg.jpg) no-repeat;
  background-size: 100% 100%;
  background-attachment: fixed;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 500px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }

    .set-language {
      color: #fff;
      position: absolute;
      top: 3px;
      font-size: 18px;
      right: 0px;
      cursor: pointer;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }

  .cus_input{
    outline-style: none ;
    border: 1px solid #ccc;
    border-radius: 3px;
    padding: 8px 14px;
    width: 230px;
    font-size: 16px;
    font-family: "Microsoft soft";
    margin-right: 10px;
  }
}
</style>
