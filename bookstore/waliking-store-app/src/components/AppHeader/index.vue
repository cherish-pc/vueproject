<template>
  <div class="app-header">
      <div class="header-left" :class="{'hidden':hiddenBack}" @click="change('/')">
        <i class="iconfont icon-return"></i>
      </div>
      <div class="header-title">{{title}}</div>
      <div class="header-right">更多</div>
  </div>
</template>
<script>
export default {
  name:"AppHeader",
  data(){
    return{

    }
  },
  props:{
    title:{
      type:String,
      default:'首页'
    },
    hiddenBack:{
      type:Boolean,
      default:true
    },
    hiddenExtend:{
      type:Boolean,
      default:true
    },
  },
  methods:{
    change(url){
      this.$router.push(url)
    }
  }
}
</script>

<style lang="scss" scoped>
  .app-header{
    position:fixed;
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
    .header-right{
      flex-basis: 40px;
      width:40px;
    }
  }
  .hidden{
    visibility: hidden;
  }
</style>