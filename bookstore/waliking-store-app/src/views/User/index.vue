<template>
  <div class="wrapper">
    <AppHeader title="个人中心"></AppHeader>
    <!-- 头像 -->
    <div class="avtar">
      <div class="avtarI">
        <img src="https://www.google.com/imgres?imgurl=https%3A%2F%2Fpic.feizl.com%2Fupload%2Fallimg%2F200229%2Fgxtxiybvzxtu5ld.jpg&imgrefurl=https%3A%2F%2Fwww.feizl.com%2Fhtml%2F134130.htm&tbnid=TFN8M0Ev9GKELM&vet=12ahUKEwiItrHhiKTrAhULDJQKHXHACKsQMygAegUIARCcAQ..i&docid=Verxo9oVVL8r4M&w=400&h=400&q=%E5%A4%B4%E5%83%8F&ved=2ahUKEwiItrHhiKTrAhULDJQKHXHACKsQMygAegUIARCcAQ" alt />
      </div>
      <div class="userName">{{userName}}</div>
    </div>
    <!-- 操作 -->
    <div class="operation">
      <div class="operItem" @click="handleOrders">
        <div class="icon">
          <i class="iconfont icon-dingdan"></i>
          <span class="text">我的订单</span>
        </div>
        <div class="iconJump">
          <i class="iconfont icon-return"></i>
        </div>
      </div>
      <div class="operItem" @click="handleRecharge">
        <div class="icon">
          <i class="iconfont icon-chongzhi"></i>
          <span class="text">充值中心</span>
        </div>
        <div class="iconJump">
          <i class="iconfont icon-return"></i>
        </div>
      </div>
      <div class="operItem" @click="handleUpdatePwd">
        <div class="icon">
          <i class="iconfont icon-change"></i>
          <span class="text">修改密码</span>
        </div>
        <div class="iconJump">
          <i class="iconfont icon-return"></i>
        </div>
      </div>
      <div class="operItem">
        <div class="icon">
          <i class="iconfont icon-erweima"></i>
          <span class="text">店铺邀请码</span>
        </div>
        <div class="iconJump">
          <i class="iconfont icon-return"></i>
        </div>
      </div>
      <div class="operItem">
        <div class="icon" @click="handleLoginOut">
          <i class="iconfont icon-logout"></i>
          <span class="text">退出登录</span>
        </div>
        <div class="iconJump"></div>
      </div>
    </div>
    <!-- 订单 -->
    <MyOrders :visible.sync="orderDetailVisible" :order="orders" />
    <!-- 修改密码 -->
    <ChangePwd :visible.sync="changepwdVisible" />
    <!-- 充值中心 -->
    <Recharge :visible.sync="rechargeVisible"></Recharge>
  </div>
</template>

<script>
import MyOrders from "@/components/MyOrders";
import ChangePwd from "@/components/ChangePwd";
import Recharge from "@/components/Recharge";
import { searchOrder, updatePwd, loginOut } from "@/api";
import AppHeader from "@/components/AppHeader";

var loginAccount = JSON.parse(sessionStorage.getItem("loginAccount"));
var uId = JSON.parse(sessionStorage.getItem("userId"));

export default {
  components: {
    MyOrders,
    ChangePwd,
    Recharge,
    AppHeader
  },
  data() {
    return {
      orderDetailVisible: false,
      changepwdVisible: false,
      rechargeVisible: false,
      orders: [],
      userName: "",
      isVisible: false
    };
  },
  created() {
    this.userName = loginAccount;
    console.log(loginAccount, uId);
  },
  methods: {
    // 查询订单
    handleOrders() {
      var _parmas = {
        userId: uId + ""
      };
      searchOrder(_parmas).then(response => {
        this.orders = response.data;
        this.orderDetailVisible = true;
      });
    },
    // 注销
    handleLoginOut() {
      var _params = {
        userAccount: loginAccount
      };
      loginOut(_params).then(response => {
        this.$router.push("/");
      });
    },
    // 修改密码
    handleUpdatePwd() {
      this.changepwdVisible = true;
    },
    // 充值
    handleRecharge() {
      this.rechargeVisible = true;
    }
  }
};
</script>

<style lang="scss" scoped>
.wrapper {
  position: absolute;
  left: 0;
  top: 48px;
  right: 0;
  bottom: 60px;
  overflow: hidden;
  display: flex;
  background: #efefef;
  flex-direction: column;
  .avtar {
    width: 100%;
    overflow: hidden;
    padding: 20px 40px;
    box-sizing: border-box;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .avtarI {
      height: 60px;
      width: 60px;
      margin-right: 20px;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }
    .userName {
      font-size: 16px;
    }
  }
  .operation {
    background: white;
    height: 200px;
    width: 94%;
    margin: 0 auto;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    .operItem {
      width: 100%;
      padding: 0 20px;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      .icon {
        i {
          color: #c39862;
          font-size: 18px;
          &.icon-erweima {
            font-size: 16px;
          }
          &.icon-chongzhi {
            font-weight: bold;
          }
        }
        .text {
          margin: 2px 10px;
          font-size: 14px;
        }
      }
      .iconJump {
        transform: rotateZ(180deg);
        color: #777;
        i {
          font-size: 14px;
        }
      }
    }
  }
}
</style>