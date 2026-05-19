<template>
  <view class="login-container">
    <!-- 顶部渐变品牌区 -->
    <view class="brand-section">
      <view class="brand-logo">
        <image :src="globalConfig.appInfo.logo" mode="widthFix"></image>
      </view>
      <text class="brand-title">若依管理系统</text>
      <text class="brand-subtitle">RuoYi Management System</text>
    </view>

    <!-- 白色悬浮卡片 -->
    <view class="login-card">
      <view class="card-title">欢迎登录</view>

      <!-- 租户选择 -->
      <view class="input-item" v-if="tenantEnabled">
        <view class="iconfont icon-bank icon"></view>
        <picker @change="onTenantChange" :value="tenantIndex" :range="tenantList" range-key="companyName">
          <view class="input">{{ tenantList[tenantIndex] ? tenantList[tenantIndex].companyName : '请选择租户' }}</view>
        </picker>
        <view class="iconfont icon-down arrow"></view>
      </view>

      <!-- 用户名输入 -->
      <view class="input-item">
        <view class="iconfont icon-user icon"></view>
        <input v-model="loginForm.username" class="input" type="text" placeholder="请输入账号" maxlength="30" />
      </view>

      <!-- 密码输入 -->
      <view class="input-item">
        <view class="iconfont icon-anquanbaozhang icon"></view>
        <input v-model="loginForm.password" type="password" password="true" class="input" placeholder="请输入密码" maxlength="20" />
      </view>

      <!-- 验证码输入 -->
      <view class="input-item" v-if="captchaEnabled">
        <view class="iconfont icon-font-size icon"></view>
        <input v-model="loginForm.code" type="number" class="input" placeholder="请输入验证码" maxlength="4" />
        <view class="login-code">
          <image :src="codeUrl" @click="getCode" class="login-code-img"></image>
        </view>
      </view>

      <!-- 登录按钮 -->
      <button @click="handleLogin" class="login-btn">登录</button>

      <!-- 协议链接 -->
      <view class="xieyi text-center">
        <text class="text-grey1">登录即代表同意</text>
        <text @click="handleUserAgrement" class="text-link">《用户协议》</text>
        <text @click="handlePrivacy" class="text-link">《隐私协议》</text>
      </view>
    </view>
  </view>
</template>

<script>
  import { getCodeImg, getTenantList } from '@/api/login'
  import { getToken } from '@/utils/auth'

  export default {
    data() {
      return {
        codeUrl: "",
        captchaEnabled: true,
        // 租户开关
        tenantEnabled: true,
        // 租户列表
        tenantList: [],
        tenantIndex: 0,
        // 用户注册开关
        register: false,
        globalConfig: getApp().globalData.config,
        loginForm: {
          tenantId: '000000',
          username: "admin",
          password: "admin123",
          code: "",
          uuid: ""
        }
      }
    },
    created() {
      this.getCode()
      this.getTenantList()
    },
    onLoad() {
      //#ifdef H5
      if (getToken()) {
        this.$tab.reLaunch('/pages/index')
      }
      //#endif
    },
    methods: {
      // 用户注册
      handleUserRegister() {
        this.$tab.redirectTo(`/pages/register`)
      },
      // 隐私协议
      handlePrivacy() {
        let site = this.globalConfig.appInfo.agreements[0]
        this.$tab.navigateTo(`/pages/common/webview/index?title=${site.title}&url=${site.url}`)
      },
      // 用户协议
      handleUserAgrement() {
        let site = this.globalConfig.appInfo.agreements[1]
        this.$tab.navigateTo(`/pages/common/webview/index?title=${site.title}&url=${site.url}`)
      },
      // 获取图形验证码
      getCode() {
        getCodeImg().then(res => {
          this.captchaEnabled = res.captchaEnabled === undefined ? true : res.captchaEnabled
          if (this.captchaEnabled) {
            this.codeUrl = 'data:image/gif;base64,' + res.img
            this.loginForm.uuid = res.uuid
          }
        })
      },
      // 获取租户列表
      getTenantList() {
        getTenantList(false).then(res => {
          this.tenantEnabled = res.tenantEnabled === undefined ? true : res.tenantEnabled
          if (this.tenantEnabled) {
            this.tenantList = res.voList || []
            if (this.tenantList.length > 0) {
              this.tenantIndex = 0
              this.loginForm.tenantId = this.tenantList[0].tenantId
            }
          }
        })
      },
      // 租户选择变化
      onTenantChange(e) {
        this.tenantIndex = e.detail.value
        this.loginForm.tenantId = this.tenantList[this.tenantIndex].tenantId
      },
      // 登录方法
      async handleLogin() {
        if (this.loginForm.username === "") {
          this.$modal.msgError("请输入账号")
        } else if (this.loginForm.password === "") {
          this.$modal.msgError("请输入密码")
        } else if (this.loginForm.code === "" && this.captchaEnabled) {
          this.$modal.msgError("请输入验证码")
        } else {
          this.$modal.loading("登录中，请耐心等待...")
          this.pwdLogin()
        }
      },
      // 密码登录
      async pwdLogin() {
        this.$store.dispatch('Login', this.loginForm).then(() => {
          this.$modal.closeLoading()
          this.loginSuccess()
        }).catch(() => {
          if (this.captchaEnabled) {
            this.getCode()
          }
        })
      },
      // 登录成功后，处理函数
      loginSuccess(result) {
        // 设置用户信息
        this.$store.dispatch('GetInfo').then(res => {
          this.$tab.reLaunch('/pages/index')
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
page {
  background-color: #f5f6f7;
}

.login-container {
  min-height: 100vh;
  background-color: #f5f6f7;
}

// 顶部渐变品牌区
.brand-section {
  background: linear-gradient(135deg, #4f7cff, #6b5cff);
  padding: 40px 20px 50px;
  text-align: center;
  color: white;

  .brand-logo {
    width: 70px;
    height: 70px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 16px;
    margin: 0 auto 15px;
    display: flex;
    align-items: center;
    justify-content: center;

    image {
      width: 50px;
      height: 50px;
      border-radius: 8px;
    }
  }

  .brand-title {
    display: block;
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 5px;
  }

  .brand-subtitle {
    display: block;
    font-size: 13px;
    opacity: 0.8;
  }
}

// 白色悬浮卡片
.login-card {
  position: relative;
  background-color: #ffffff;
  border-radius: 16px;
  padding: 25px 20px;
  margin: -30px 15px 0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);

  .card-title {
    text-align: center;
    font-size: 16px;
    color: #333;
    font-weight: 500;
    margin-bottom: 20px;
  }
}

// 输入框样式
.input-item {
  background-color: #f8f9fc;
  border-radius: 12px;
  padding: 12px 15px;
  margin-bottom: 15px;
  display: flex;
  align-items: center;

  .icon {
    font-size: 18px;
    color: #999;
    margin-right: 10px;
  }

  .input {
    flex: 1;
    font-size: 14px;
    color: #333;
    background: transparent;
    border: none;
    outline: none;

    &::placeholder {
      color: #999;
    }
  }

  .arrow {
    font-size: 14px;
    color: #999;
  }

  .login-code {
    flex-shrink: 0;
    width: 70px;
    height: 32px;
    margin-left: 10px;

    .login-code-img {
      width: 70px;
      height: 32px;
      border-radius: 6px;
    }
  }
}

// 登录按钮
.login-btn {
  background: linear-gradient(135deg, #4f7cff, #6b5cff);
  color: white;
  border: none;
  border-radius: 10px;
  padding: 10px 14px;
  font-size: 15px;
  font-weight: 500;
  margin-top: 10px;
  width: 100%;
  height: 44px;
  line-height: 24px;

  &:active {
    opacity: 0.9;
  }
}

// 协议链接
.xieyi {
  text-align: center;
  margin-top: 15px;
  font-size: 12px;
  color: #999;

  .text-grey1 {
    color: #999;
  }

  .text-link {
    color: #4f7cff;
    margin: 0 3px;
  }
}
</style>
