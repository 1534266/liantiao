<template>
  <div class="login-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" title="登录" />
    <!-- 导航栏结束 -->

    <!-- 登录菜单 -->
    <!-- 当表单提交时会自动触发检验规则,验证通过会触发submit事件,失败则不会触发 -->
    <van-form ref="loginForm" @submit="onSubmit">
      <van-field
        name="mobile"
        placeholder="请输入手机号"
        v-model="user.mobile"
        :rules="userFormRules.mobile"
        type="number"
        maxlength="11"
      >
        <i slot="left-icon" class="toutiao toutiao-shouji"></i>
      </van-field>
      <!-- 输入验证码 -->
      <van-field
        name="code"
        placeholder="请输入验证码"
        v-model="user.code"
        :rules="userFormRules.code"
        type="number"
        maxlength="6"
      >
        <i slot="left-icon" class="toutiao toutiao-yanzhengma"></i>
        <!-- 发送验证码 -->

        <template #button>
          <van-count-down
            v-if="isCountDownShow"
            :time="1000 * 10"
            format="ss s"
            @finish="isCountDownShow = false"
          />
          <van-button
            v-else
            class="send-sms-btn"
            round
            size="small"
            type="default"
            @click="onSendSms"
            native-type="button"
            >发送验证码</van-button
          >
        </template>
        <!-- 提交按钮 -->
      </van-field>
      <div class="login-btn-wrap">
        <van-button class="login-btn" block type="info" native-type="submit">
          提交
        </van-button>
      </div>
    </van-form>
  </div>
</template>
<script>
import { login, sendSms } from '@/api/user'
export default {
  name: 'LoginIndex',
  components: {},
  props: {},
  data() {
    return {
      user: {
        mobile: '13911111111',
        code: '246810'
      },
      // 1.手机校验规则
      userFormRules: {
        mobile: [
          { required: true, message: '请输入手机号' },
          {
            pattern: /^1[3578]\d{9}$/,
            message: '手机号格式错误'
          }
        ],
        code: [
          { required: true, message: '请输入验证码' },
          {
            pattern: /^\d{6}$/,
            message: '验证码格式错误'
          }
        ]
      },
      isCountDownShow: false
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    async onSubmit() {
      // 1.获取表单数据
      const user = this.user

      // 2.验证表单
      // 登录状态引用
      this.$toast.loading({
        duration: 0, // 持续展示 toast
        message: '加载中...',
        forbidClick: true // 是否禁止背景点击
      })
      // 3.提交表单请求登录
      try {
        const { data } = await login(user)
        this.$store.commit('setUser', data.data)
        // console.log(res)
        this.$toast.success('登录成功')
      } catch (err) {
        if (err.response.status === 400) {
          console.log('手机号或验证码错误')
          this.$toast.fail('登录失败')
        } else {
          this.$toast.fail('登录失败,稍后再试')
        }
      }
      // 4.根据请求结果处理后续操作
    },
    // 验证校验码
    async onSendSms() {
      // 1点击按钮校手机号
      try {
        await this.$refs.loginForm.validate('mobile')
        console.log('验证成功')
      } catch (err) {
        return console.log('验证失败', err)
      }
      // 2验证通过显示倒计时状态
      this.isCountDownShow = true

      // 3请求发送验证码
      try {
        await sendSms(this.user.mobile)
        this.$toast('发送成功')
      } catch (err) {
        if (err.response.status === 429) {
          this.$toast('发送太频繁了请稍后')
        } else {
          this.$toast('发送失败')
        }
      }
    }
  }
}
</script>
<style lang="less">
.login-container {
  .toutiao {
    font-size: 37px;
  }
  .send-sms-btn {
    width: 175px;
    height: 46px;
    line-height: 46px;
    background-color: #ededed;
    font-size: 20px;
    color: #666;
  }
  .login-btn-wrap {
    padding: 20px 30px;
    .login-btn {
      background-color: #6db4fb;
      border: none;
    }
  }
}
</style>
