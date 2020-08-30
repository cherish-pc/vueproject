<template>
  <div class="recharge" v-show="visible">
    <div class="container">
      <!-- 头部 -->
      <div class="app-header">
        <div class="header-left" @click="handleBack">
          <i class="iconfont icon-return"></i>
        </div>
        <div class="header-title">充值中心</div>
      </div>
      <!-- 内容 -->
      <div class="rechargeForm">
        <div class="formItem">
          <span>卡密</span>
          <input type="text" name="card" id="card" v-model="rechargeCardCode" placeholder="请输入需要兑换的卡密" />
        </div>
        <div class="btn">
          <button class="login" @click="handerExchange()" type="button">兑换</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {getExchange} from '@/api'
export default {
  name: "Recharge",
  data() {
    return {
      rechargeCardCode:null,
    }
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  methods:{
    // 返回
    handleBack(){
      this.$emit('update:visible',false)
    },
    handerExchange(){
      var _params = {
        cardCode:this.rechargeCardCode,
        loginAccount:JSON.parse(sessionStorage.getItem('loginAccount'))
      }
      getExchange(_params).then(response=>{
        this.handleBack();
      })
    }
  }
};
</script>

<style lang="scss" scoped>
  .recharge{
    position:fixed;    
    top:0;
    left:0;
    z-index: 1000;
    width:100%;
    height: 100%;
    background:#efefef;
    .container{
      height:100%;
      overflow:hidden;
      .app-header{
        position:fixed;
        background:white;
        z-index: 100;
        top:0;
        left:0;
        width:100%;
        border-bottom:1px solid rgba($color: #aaa, $alpha: .3);
        // 一般header是不会自适应的，不会改变高度 
        height:48px;
        // 父级字体设为0，避免空格占宽度，影响布局
        font-size:0;
        // flex布局 
        display:flex;
        justify-content: space-between;
        align-items: center;
        .header-left{
          flex-basis: 35px;
          width:35px;
          height:35px;
          line-height: 35px;
          color:#777;
          font-size: 20px;
          i{
            font-size: 20px;
          }
          
        }
        .header-title{
          flex-grow: 1;
          font-size:1.3rem;
          font-family: "微软雅黑";
          color:#c39862;
          font-weight: 600;
        }
    
      }
      .rechargeForm{
        width:80%;
        height: 200px;
        margin: 80px auto;
        box-sizing: border-box;
        overflow: hidden;
       
        .formItem{
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
            background: #fff;
            height: 40px;
            span{
              line-height: 40px;
              padding-left: 20px;
              font-size: 13px;
            }
            input{
                border: none;
                outline: none;
                flex:1;
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
        }
        .btn{
          border-radius: 6px;
          border: none;
          height: 2.5rem;
          margin: 30px 0;
          background:linear-gradient(to right,#e6ab54 50%,#f39345);
          font-weight: bold;
          .login{
              border:none;
              background:none;
              color:white;
              font-size: 20px;
              line-height: 2.5rem;
              outline:none;

          }
        }
      }
    }
  }
</style>