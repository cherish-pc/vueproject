<template>
  <div class="app-login">
    <div class="logo">
      <img src="@/assets/logo.png" alt />
    </div>
    <div class="form">
      <form action>
        <div class="formItem">
          <span>
            <i class="iconfont icon-user1"></i>
          </span>
          <input
            type="text"
            name="loginAccount"
            id="loginAccount"
            v-model="formData.loginAccount"
            placeholder="请输入用户名"
          />
        </div>
        <div class="formItem">
          <span>
            <i class="iconfont icon-pwd"></i>
          </span>
          <input
            type="password"
            name="pwd"
            id="pwd"
            v-model="formData.password"
            placeholder="请输入密码"
          />
        </div>
      </form>
      <div class="btn">
        <button class="login" @click="handleLogin()" type="button">登录</button>
      </div>
      <div class="reg" @click="handleReg">
        <span>注册</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      formData: {
        loginAccount: "",
        password: "",
        isAdmin: "0"
      }
    };
  },
  methods: {
    handleLogin() {
      this.$store.dispatch("login", this.formData).then(response => {
        this.$router.push("/home");
      });
    },
    handleReg() {
      this.$router.push("/register");
    },
    
  }
};
</script>

<style lang="scss" scoped>
.app-login {
  height: 100%;
  padding: 2rem;
  position: relative;
  .logo {
    width: 100%;
    position: relative;
    // 由于图片的宽度是动态计算的，所以需要预先设定高度，把空间预留出来
    height: 0;
    padding-top: 100%;
    img {
      position: absolute;
      left: 0;
      top: 100px;
      width: auto;
      height: auto;
      max-width: 100%;
      max-height: 100%;
    }
  }
  .form {
    .formItem {
      display: flex;
      justify-content: space-between;
      margin: 0 20px 1rem 20px;
      border-bottom: 1px solid rgb(202, 147, 94);
      position: relative;
      i {
        color: rgb(202, 147, 94);
        padding-left: 1rem;
        line-height: 42px;
        font-weight: bold;
      }
      input {
        border: none;
        outline: none;
        flex: 1;
        color: #555;
        font-size: 1.1em;
        margin-left: 1rem;
        font-family: monospace;
        &::-webkit-input-placeholder {
          color: #bbb;
        }
        &::-moz-placeholder {
          color: #bbb;
        }
        &::-ms-input-placeholder {
          color: #bbb;
        }
      }
      .tips {
        position: absolute;
        left: 48px;
        top: 42px;
        color: red;
      }
    }
    .btn {
      color: cadetblue;
      border-radius: 6px;
      border: none;

      height: 2.5rem;
      margin: 60px 20px 0 20px;
      background: linear-gradient(to right, #e6ab54 50%, #c38743);
      font-weight: bold;
      .login {
        border: none;
        background: none;
        color: white;
        font-size: 20px;
        line-height: 2.5rem;
        outline: none;
      }
    }
    .reg {
      text-align: right;
      margin: 11px 22px;
      font-size: 1rem;
      color: #555;
      cursor: pointer;
    }
  }
}
</style>