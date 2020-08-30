<template>
  <div class="home-page">
      <div class="content" >
        <!-- 四个主页面 -->
      <router-view/>
      </div>      
      <div class="nav-bar">
        <div class="item">
          <router-link to="/home/hot">
          <i class="iconfont icon-home"></i>
            首页 
          </router-link>
        </div>
        <div class="item" >
          <router-link to="/home/cate">
            <i class="iconfont icon-cate"></i>
            分类
          </router-link>
        </div>
        <div class="item">
          <router-link to="/home/chart">
          <i class="iconfont icon-chart"></i>
            购物车
          </router-link>
        </div>
        <div class="item">
          <router-link to="/home/user">
            <i class="iconfont icon-my"></i>
            我的
          </router-link>
        </div>
      </div>
  </div>
</template>

<script>
import AppHeader from '@/components/AppHeader'
import layer from 'vue-layer-mobile'

    var websocket = null;
    var contentString = '';
    var dVisible = false;
    //判断当前浏览器是否支持WebSocket
    if('WebSocket' in window){
        websocket = new WebSocket("ws://39.97.253.86:8082/socket/"+JSON.parse(sessionStorage.getItem('loginAccount')));
    }else{
        alert('Not support websocket')
    }
    //连接发生错误的回调方法
    websocket.onerror = function(){
        setMessageInnerHTML("error");
    };
    //连接成功建立的回调方法
    websocket.onopen = function(event){
        setMessageInnerHTML("open");
        console.log(2222);
        
    }
    //接收到消息的回调方法
    websocket.onmessage = function(event){
      // console.log(event);
      
      console.log(event.data);
      // debugger
      layer.dialog({
        title: ['公告', 'background:#ccc;'], // 第一个是标题内容  第二个是标题栏的style(可以为空) 
        content: event.data,
        contentClass: 'dialogs',
        btn: ['我知道了'],
      //   time: 2000
      })
      // 如果有btn 
      .then(function (res){
        // res为0时是用户点击了左边  为1时用户点击了右边 
        let position = res === 0 ? 'left' : 'right'
          console.log(position)
        })

    }
    //连接关闭的回调方法
    websocket.onclose = function(){
      console.log(11111);
      
        setMessageInnerHTML("close");
    }
    //监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
    window.onbeforeunload = function(){
        websocket.close();
    }
    //将消息显示在网页上
    function setMessageInnerHTML(innerHTML){
        // document.getElementById('message').innerHTML += innerHTML + '<br/>';
        contentString = innerHTML
    }
    //关闭连接
    function closeWebSocket(){
        websocket.close();
    }


export default {
  name:"Homepage",
  components:{
    AppHeader,
    // Dialog
  },
  
  data(){

    return{
      contentStr:contentString
    }
  },
 
}
</script>

<style lang="scss" scoped>
.home-page{
  width:100%;
  .layui-m-layerbtn span{
    width:100%;
    text-align: center;
  }
  .nav-bar{
    position: fixed;
    border-top:1px solid rgba($color: #aaa, $alpha: .3);
    padding:6px  0;
    height: 48px;
    width:100%;
    left:0;
    bottom:0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    .item{
      border-right:1px solid rgba($color: #aaa, $alpha: .3);
      flex-basis: 25%;
      i{
        display: block;
        font-size:1.5rem
      }
      a{
        text-decoration: none;
        color:rgb(94, 87, 87);
        &:active{
          color:#c39862;
        }
      }

      &:last-child{
        border-right:none;
      }
    }
  }
}
.router-link-active{
  color:#c39862 !important;
}

</style>