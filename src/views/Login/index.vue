<template>
  <div class="login-container">
    <div class="login-center">
      <h1><i class="logo"></i> {{ $adaptation.loginLeftTitle }}</h1>
      <ul onselectstart="return false">
        <li>
          <img class="img" src="~@img/login/1.png" alt="">
        </li>
        <li>
          <img class="img" src="~@img/login/2.png" alt="">
        </li>
        <li>
          <img class="img" src="~@img/login/3.png" alt="">
        </li>
        <li>
          <img class="img" src="~@img/login/4.png" alt="">
        </li>
        <li>
          <img class="img" src="~@img/login/5.png" alt="">
        </li>
      </ul>
      <el-form :model="loginForm" ref="ruleForm" :rules="loginRules" class="login-form">
        <h2>{{ $adaptation.loginRightTitle }}</h2>
        <el-form-item prop="userName" class="username">
          <img src="~@img/login/username.jpg" alt="">
          <el-input type="text" class="input" v-model.trim="loginForm.userName" @keyup.enter.native="handleLogin" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item prop="password" class="password">
          <img src="~@img/login/password.jpg" alt="">
          <el-input type="password" class="input" v-model="loginForm.password" @keyup.enter.native="handleLogin" placeholder="密码"></el-input>
        </el-form-item>
        <el-button type="primary" class="login-btn" :loading="loading" @click.native="handleLogin">登录</el-button>
      </el-form>
    </div>
    <div class="footer">广州博控自动化技术有限公司 © 版权所有</div>
  </div>
</template>

<script>
export default {
  name: 'login',
  data () {
    // const validateUsername = (rule, value, callback) => {
    //   if (!isvalidUsername(value)) {
    //     callback(new Error('请输入正确的用户名'))
    //   } else {
    //     callback()
    //   }
    // }
    const validatePass = (rule, value, callback) => {
      if (value.length < 5) {
        callback(new Error('密码不能小于5位'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        userName: '',
        password: ''
      },
      loginRules: {
        userName: [],
        password: [{validator: validatePass, trigger: 'blur'}]
      },
      loading: false,
      pwdType: 'password'
    }
  },
  methods: {
    showPwd () {
      if (this.pwdType === 'password') {
        this.pwdType = ''
      } else {
        this.pwdType = 'password'
      }
    },
    handleLogin () {
      this.$refs['ruleForm'].validate(async (valid) => {
        if (valid) {
          this.loading = true
          try {
            let res = await this.$store.dispatch('Login', this.loginForm)
            switch (res.state) {
              case 0:
                this.$router.push({ path: '/main/home' })
                break
              case 102:
                this.$message.error('账号或密码错误')
                break
              case 103:
                this.$message.error('用户过期')
                break
              case 104:
                this.$message.error('用户不存在')
                break
              case 105:
                this.$message.error('账号已经被冻结')
                break
              default:
                this.$message.error('系统异常，请联系客服')
                break
            }
          } catch (error) {
            console.log(error)
          }
          this.loading = false
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  @media screen and (min-width: 1330px) and (max-width: 1500px) {
    li {
      width: 150px !important;
      height: 200px !important;
    }
  }
  @media screen and (max-width: 1329px) {
    li {
      width: 130px !important;
      height: 180px !important;
    }
  }
  .login-container {
    background: url('~@img/login/login-bg1.png') no-repeat;
    background-size: cover;
    width: 100%;
    height: 100%;
    position: relative;
    /deep/ .el-form-item__error {
      left: 70px;
    }
    .login-center {
      position: absolute;
      top: 28%;
      width: 100%;
      height: 405px;
      background: url('~@img/login/main.png') no-repeat;
      background-size: cover;
      h1 {
        position: absolute;
        left: 60px;
        top: -22%;
        font-size: 40px;
        .logo {
          width: 167px;
          height: 50px;
          display: inline-block;
          background: url('~@img/login/logo.png') no-repeat;
          background-size: cover;
          vertical-align: bottom;
        }
      }
      ul {
        width: calc(100% - 560px);
        height: 100%;
        float: left;
        display: flex;
        justify-content: space-around;
        align-items: center;
        li {
          background: #fff;
          width: 180px;
          height: 250px;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          img {
            width: calc(100% - 60px);
            height: calc(100% - 80px);
          }
        }
      }
      .login-form {
        position: absolute;
        top: -22.5%;
        right: 5%;
        width: 475px;
        height: 600px;
        background: url('~@img/login/login-form.png') no-repeat 0 0;
        background-size: 100% 100%;
        .username, .password {
          position: relative;
        }
        img {
          position: absolute;
          width: 17px;
          height: 20px;
          top: 29px;
          left: 70px;
          z-index: 2;
        }
        .input {
          width: 70%;
          margin: 20px 0 10px 60px;
          /deep/ input {
            text-indent: 30px;
          }
        }
        h2 {
          color: #fff;
          font-weight: normal;
          line-height: 67px;
          height: 67px;
          margin-top: 55px;
          text-align: center;
        }
        .login-inp {
          margin-left: 0;
          margin-top: 8%;
          margin-bottom: 8%;
          position: relative;
          input {
            width: 80%;
            height: 50px;
            border: 1px solid #ececec;
            text-indent: 45px;
          }
          span {
            position: absolute;
            left: 12px;
            top: 16px;
            i {
              display: inline-block;
              margin-right: 6px;
              width: 23px;
              height: 20px;
              vertical-align: middle;
            }
            .usname-logo {
              background: url('~@img/login/username.jpg') no-repeat 0 0;
              background-size: cover;
            }
            .psword-logo {
              height: 22px;
              background: url('~@img/login/password.jpg') no-repeat 0 0;
              background-size: cover;
            }
          }
        }
        .login-btn {
          font-size: 20px;
          width: 220px;
          height: 50px;
          margin-left: 60px;
          margin-top: 40px;
          width: 70%;
        }
      }
    }
    .footer {
      position: absolute;
      width: 100%;
      text-align: center;
      bottom: 20px;
      font-size: 16px;
      color: #666666;
    }
  }
</style>
