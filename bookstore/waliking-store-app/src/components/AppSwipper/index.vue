<template>
  <div class="slider" ref="slider">
      <div class="slider-group" ref="sliderGroup">
          <slot>

          </slot>
      </div>
      <div class="dots">
          <span class="dot"
            v-for="(dot,index) in dotes"
            :key="index"
            :class="{'current':currentIndex == index}"></span>
      </div>
  </div>
  
</template>

<script>
import BScroll from 'better-scroll'
function addClass(el,className){
    let A_newClass = el.className.split(' ');
    A_newClass.push(className);
    el.className = A_newClass.join(' ');
}
export default {
    name:"AppSwipper",
    data(){
        return{
            dotes:[],
            // 当前的图片
            currentIndex:0
        }
        
    },
    watch:{
        bannerList(){
            setTimeout(()=>{
            this._setWidth();
            
            this._initSwipper();
            // 初始化导航
            this._initDot();
            // 自动播放
            if(this.autoPlay){
                 this.play();
            }           
        },20);
        }
    },
     // html加载完成后执行
    mounted(){
        /**
         * 在页面组件切换时，虚拟dom树如果没被更改会直接被渲染出来，这时候会出现先初始化组件后渲染dom元素的情况
         * 1.让等待的时间更长一点
         * 2、将父级v-if绑定的banner数据默认值改成undefined
         * 3.在子组件watch目标数据发生改变时，刷新页面
         */
        this.$nextTick(()=>{
            setTimeout(()=>{
                this._setWidth();
                
                this._initSwipper();
                // 初始化导航
                this._initDot();
                // 自动播放
                if(this.autoPlay){
                    this.play();
                }           
            },20);
        })
        
        // 监听窗口改变
        window.addEventListener('resize',()=>{
            if(!this.slider){
                return
            }
            this._setWidth(true)
            // 重新刷新实例 
            this.slider.refresh();
        })      
        

    },
    // 父组件传递过来的
    props:{
        // 自动播放
        autoPlay:{
            type:Boolean,
            default:true
        },
        // 循环
        loop:{
            type:Boolean,
            default:true
        },
        // 循环间隔时间 
        intervalTime:{
            type:Number,
            default:3000
        },
        //只是为了监听数据变化
        bannerList:{
            type:Array
        }

    },
    methods:{
        _setWidth(reset){
            var Dom_children = this.$refs.sliderGroup.children;
            var width = 0;
            // 获取banner宽度（展示出来的宽度）
            var sliderWidth = this.$refs.slider.clientWidth;
            for(var i=0;i<Dom_children.length;i++){
                var child = Dom_children[i];
                // 为每张图片添加类
                addClass(child,'slider-item');
                // 每个图片的宽度与父容器相同
                child.style.width = sliderWidth +'px'
                // 总宽度是所有图片宽度相加
                width += sliderWidth;
            }
            // 不是窗口改变，并且是循环，需要 前后加一个宽度
            if(this.loop && !reset){
                width += 2*sliderWidth;
            }
            // 设置轮播图片的容器宽度
            this.$refs.sliderGroup.style.width = width +'px'
        },
        // 初始化滚动插件
        _initSwipper(){
            // 创建实例
            this.slider = new BScroll(this.$refs.slider,{
                scrollY:false,
                // 开启横向滚动
                scrollX:true,               
                // 快速滑动是否有动画
                momentum:false,
                // 做 slide 组件用的
                snap:{
                    loop:this.loop,
                    threshold:0.3,
                    speed:400
                }
            });
            // 监听窗口滑动事件
            this.slider.on('scrollEnd',()=>{
                // 找到当前索引，做滚动操作
                var pageIndex = this.slider.getCurrentPage().pageX;                       
                this.currentIndex = pageIndex;
                if(this.autoPlay){
                    clearTimeout(this.timer);
                    this.play();
                }
            })            
        },
        // 播放
        play(){
            // 设置定时器自动播放
            this.timer = setTimeout(()=>{
                this.slider.next(400);                
            },this.intervalTime)
        },
        _initDot(){
            if(this.loop){
                this.dotes = new Array(this.$refs.sliderGroup.children.length-2);
            }
            else{
                this.dotes = new Array(this.$refs.sliderGroup.children.length);
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.slider{
    position:relative;
    min-height: 1px;
    overflow: hidden;
    height:200px;
    .slider-group{
        position: relative;
        overflow: hidden;
        white-space: nowrap;
        height: 100%;
        .slider-item{
            float: left;
            overflow: hidden;
            text-align: center;
            box-sizing: border-box;
            height: 100%;
            img{
                display: block;
                width:100%;
                max-width: 100%;
                height: 100%;
                max-height: 100%;
            }
        }
    }
    .dots{
        position:absolute;
        left:0;
        right: 0;
        bottom:.5rem;
        text-align: center;
        font-size: 0;
        .dot{
            width:.5rem;
            height: .5rem;
            display:inline-block;
            border-radius: 50%;
            margin:0 .25rem;
            background-color: rgba($color: #000000, $alpha: .5);
            &.current{
                width:1rem;
                border-radius: 5px;
                background:rgba($color: #c39862, $alpha: 1)
            }            
        }
    }
    
}

</style>