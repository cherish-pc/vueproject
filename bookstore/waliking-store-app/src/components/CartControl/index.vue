<template>
  <div class="cart_control">
    <div class="decrease" @click.stop="decrease"
    v-show="good.shopNum>0">
      <i class="iconfont icon-jian"></i>
    </div>
    <div class="count" v-show="good.shopNum>0">{{good.shopNum}}</div>
    <div class="add" @click.stop="add">
      <i class="iconfont icon-jia"></i>
    </div>   
  </div>
</template>

<script>
import { addChart,deleteChart} from '@/api'

export default {
  name:"CartControl",
  data(){
    return{

    }
  },
  props:{
    good:{
      type:Object
    },
  },
  methods:{
    // 减
    decrease(){  
      this.good.shopNum--;
      var _params = {
        skuCode:this.good.skuCode,
        shopNum:this.good.shopNum+'',
        businessCode:this.good.businessCode,
        loginAccount:JSON.parse(sessionStorage.getItem('loginAccount'))
      }      
      if(this.good.shopNum == 0){
        deleteChart(_params).then(response=>{
          // console.log(response);
          this.$emit('fetch');                 
        });
      }else{
        addChart(_params).then(response=>{
        })
      }
    },
    // 改变父级组件的数据
    add(){
      this.good.shopNum++
      var _params = {
        skuCode:this.good.skuCode,
        shopNum:this.good.shopNum+'',
        businessCode:this.good.businessCode,
        loginAccount:JSON.parse(sessionStorage.getItem('loginAccount'))
      }
      addChart(_params).then(response=>{
        console.log(_params);
      })
    }
  }

}
</script>

<style lang="scss" scoped>
  .cart_control{
    .decrease,.count,.add{
      display:inline-block;
      padding:6px;
      color:#746164;
      i{
        font-size: 1rem;
        font-weight: normal;
        color:#c39862;
      }
    }
    .count{
      color:#333;
      font-size:1rem;
    }
  }
</style>