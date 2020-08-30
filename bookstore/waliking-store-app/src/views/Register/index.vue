<template>
  <div class="reg_container">
    <AppHeader title="注册" :hiddenBack="false" />
    <div class="content_wrapper">
      <div class="logo">
        <img src="@/assets/logo.png" alt />
      </div>
      <div class="form">
        <form action method>
          <div class="sex">
            <div class="radio manRadio" @click="changeActive(0)" ref="man">
              <input type="radio" name="sexRadio" class="human" id="man" />
              <label for="man">
                <span class="manImg" :class="{'sexActive':mActives}">
                  <i class="iconfont icon-nan"></i>
                </span>
                <span class="manText" :class="{'textActive':mActives}">男</span>
              </label>
            </div>
            <div class="radio femaleRadio" @click="changeActive(1)" ref="woman">
              <input type="radio" name="sexRadio" class="human" id="woman" />
              <label for="woman">
                <span class="manImg" :class="{'sexActive':wActives}">
                  <i class="iconfont icon-female"></i>
                </span>
                <span class="manText" :class="{'textActive':wActives}">女</span>
              </label>
            </div>
          </div>
          <div class="formItem">
            <span>
              <i class="iconfont icon-user1"></i>
            </span>
            <input
              type="text"
              name="userAccount"
              id="userAccount"
              v-model="formData.userAccount"
              placeholder="请输入用户名"
            />
          </div>
          <div class="formItem">
            <span>
              <i class="iconfont icon-pwd"></i>
            </span>
            <input
              type="password"
              name="password"
              id="password"
              v-model="formData.password"
              placeholder="请输入密码"
            />
          </div>
          <div class="formItem">
            <span>
              <i class="iconfont icon-pwd2"></i>
            </span>
            <input type="password" name id v-model="formData.password2" placeholder="请确认密码" />
            <span class="tips">{{tips}}</span>
          </div>

          <div class="formItem">
            <span>
              <i class="iconfont icon-phone"></i>
            </span>
            <input type="text" name id v-model="formData.phone" placeholder="请输入手机号" />
          </div>
          <div class="formItem">
            <span>
              <i class="iconfont icon-name"></i>
            </span>
            <input type="text" name id v-model="formData.userName" placeholder="请输入姓名" />
          </div>
          <div class="formItem">
            <span>
              <i class="iconfont icon-idCard"></i>
            </span>
            <input type="text" name id v-model="formData.idCard" placeholder="请输入身份证号" />
          </div>
        </form>
        <div class="btn">
          <button class="login" @click="handerRegister()" type="button">注册</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AppHeader from "@/components/AppHeader";
import { register } from "@/api";
export default {
  name: "Register",
  components: {
    AppHeader
  },
  data() {
    return {
      mActives: false,
      wActives: false,
      formData: {
        userAccount: "",
        password: "",
        password2: "",
        userSex: "2",
        phone: "",
        userName: "",
        email: "",
        idCard: "",
        isAdmin: "0",
        frontScore: "0"
      },
      tips: ""
    };
  },

  methods: {
    // 切换 性别选中
    changeActive(v) {
      if (v == 0) {
        this.mActives = true;
        this.wActives = false;
        this.formData.userSex = "1";
      } else if (v == 1) {
        this.mActives = false;
        this.wActives = true;
        this.formData.userSex = "0";
      } else {
        this.formData.userSex = "2";
      }
    },
    // 点击注册
    handerRegister() {
      register(this.formData).then(response => {
        this.$router.push("/");
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.reg_container {
  height: 100%;
  padding: 2rem;
  box-sizing: border-box;
  .content_wrapper {
    margin-top: 16px;
    height: 100%;
    .logo {
      width: 100%;
      position: relative;
      // 由于图片的宽度是动态计算的，所以需要预先设定高度，把空间预留出来
      height: 0;
      padding: 30% 0;
      img {
        position: absolute;
        left: 0;
        top: 27px;
        width: auto;
        height: auto;
        max-width: 100%;
        max-height: 100%;
      }
    }
    .form {
      /* 性别 */
      .sex {
        display: flex;
        justify-content: space-between;
        margin: 0 20px 2rem 20px;
        height: 4rem;

        .radio {
          width: 50%;
          height: 100%;

          .human {
            display: none;
          }
          input.human + label {
            // display: inline-block;
            height: 100%;
            width: 100%;
            cursor: pointer;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            .manImg {
              background-color: #b2b2b2;
              width: 100%;
              height: 2rem;
              line-height: 2rem;
              i {
                font-size: 24px;
                color: white;
              }
            }
            .manText {
              font-size: 1rem;
              padding: 8px 0;
              color: #b2b2b2;
            }
            .sexActive {
              background-color: rgb(195, 152, 98);
            }
            .textActive {
              color: rgb(195, 152, 98);
            }
          }
        }
      }
      .formItem {
        display: flex;
        justify-content: space-between;
        margin: 0 20px 1rem 20px;
        border-bottom: 1px solid rgb(202, 147, 94);
        position: relative;
        i {
          color: rgb(202, 147, 94);
          line-height: 42px;
          padding-left: 1rem;
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
  }
}
</style>