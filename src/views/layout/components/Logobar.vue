<template>
  <div class="logo-bar">
    <div class="logo-bar-left">
      <img src="~@img/logo.png" alt="">
      <h2>{{ $adaptation.logoTitle }}</h2>
    </div>
    <div class="avatar-container">
      <div class="avatar-wrapper">
        <span class="user-name">你好，{{ $store.getters.name }}</span>
        <span class="twinkle" onselectstart="return false">
          <!-- TODO -->
          <el-dropdown trigger="click">
            <i class="iconfont icon-lingdang"></i>
            <el-dropdown-menu slot="dropdown" class="dropdown">
              <!-- <el-dropdown-item class="clearfix">
                评论
                <el-badge class="mark" :value="12" />
              </el-dropdown-item>
              <el-dropdown-item class="clearfix">
                回复
                <el-badge class="mark" :value="3" />
              </el-dropdown-item> -->
              <el-dropdown-item class="clearfix">
                暂无提醒
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </span>
        <span class="quit" @click="loginOut">
          <img src="~@img/quit.png"
            alt=""
            class="quit-img">
          <span>退出</span>
        </span>
        <!-- <i class="el-icon-caret-bottom"></i> -->
      </div>
      <!-- <el-dropdown-menu class="user-dropdown" slot="dropdown">
        <el-dropdown-item>
          <span @click="logout" style="display:block;">退出</span>
        </el-dropdown-item>
      </el-dropdown-menu> -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'Logobar',
  methods: {
    loginOut () {
      this.$confirm('是否确定退出？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(_ => {
        this.$store.dispatch('FedLogOut').then(() => {
          location.reload() // 为了重新实例化vue-router对象 避免bug
        })
      })
    }
  },
  created () {
    // console.log(avatar)
  }
}
</script>

<style lang="scss" scoped>
.logo-bar {
  width: 100%;
  height: $LogobarHei;
  line-height: $LogobarHei;
  overflow: hidden;
  // background-color: #44b5e0;\
  background: url('~@img/header.png') no-repeat center center;
  background-size: 100% 100%;
  padding: 0 18px;
  .logo-bar-left {
    position: relative;
    float: left;
    img {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      height: 42px;
      width: 130px;
    }
    h2 {
      margin-left: 156px;
      font-size: 24px;
      color: #fff;
    }
  }
  .avatar-container {
    height: 50px;
    display: inline-block;
    position: absolute;
    right: 35px;
    .avatar-wrapper {
      // cursor: pointer;
      position: relative;
      display: table-cell; //主要是这个属性
      line-height: $LogobarHei;
      .user-avatar {
        width: 26px;
        height: 26px;
        border-radius: 10px;
        vertical-align: middle;
      }
      .user-name {
        color: #fff;
      }
      .twinkle {
        cursor: pointer;
        i {
          color: #fff;
          font-size: 20px;
          display: block;
          &.move {
            animation: blink 2s infinite;
          }
        }
      }
      .el-icon-caret-bottom {
        position: absolute;
        right: -20px;
        top: 25px;
        font-size: 12px;
        color: #fff;
      }
      .quit {
        cursor: pointer;
        margin-left: 30px;
        height: 30px;
        line-height: 30px;
        position: relative;
        color: #fff;
        .quit-img {
          vertical-align: middle;
          width: 21px;
          height: 22px;
        }
      }
    }
  }
}

.dropdown {
  width: 120px !important;
}

@keyframes blink {
  10% {
    transform: rotateZ(10deg);
  }
  20% {
    transform: rotateZ(-10deg);
  }
  30% {
    transform: rotateZ(10deg);
  }
  40% {
    transform: rotateZ(-10deg);
  }
  44% {
    transform: rotateZ(10deg);
  }
  48% {
    transform: rotateZ(-10deg);
  }
  52% {
    transform: rotateZ(10deg);
  }
  56% {
    transform: rotateZ(-10deg);
  }
  60% {
    transform: rotateZ(10deg);
  }
  64% {
    transform: rotateZ(-10deg);
  }
  68% {
    transform: rotateZ(10deg);
  }
  72% {
    transform: rotateZ(-10deg);
  }
  80% {
    transform: rotateZ(0);
  }
}
</style>
