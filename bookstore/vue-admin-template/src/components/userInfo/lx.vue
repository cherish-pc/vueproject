<template>
  <div class="container">
    <div class="header">
      <span class="img">
        <img src="@/assets/4.jpg" alt="">
      </span>
      <div class="work">
        <div class="info">
          <svg-icon icon-class="name" />
          罗鑫
        </div>
        <div class="info">
          <svg-icon icon-class="location" />
          四川省眉山市丹棱县
        </div>
        <div class="info">
          <svg-icon icon-class="email" />
          luo_xin59@163.com
        </div>
        <div class="info">
          <svg-icon icon-class="tel" />
          17761411424
        </div>
      </div>
      <div class="head_title">
      <span>个人简历</span>
      <span class="s_title">求职意向--前端开发工程师</span>

      </div>


    </div>
    <div class="content">
      <div class="left">
        <div class="baseInfo">
          <div class="title">教育经历</div>
          <div class="detail">
            <span>学校名称：成都东软学院(本科)</span>
            <span>所学专业：计算机科学与技术</span>
            <span>就读时间：2017年9月-至今</span>
          </div>
        </div>
        <div class="baseInfo">
          <div class="title">自我评价</div>
          <div class="detail">
            <span>个性开朗，热爱生活，热爱运动。能快速适应环境，善于管理时间，有良好的编码习惯，具有一定的团队精神和沟通能力。</span>
          </div>
        </div>
         <div class="baseInfo">
          <div class="title">获得荣誉</div>
          <div class="detail">
            <span>国家励志奖学金</span>
            <span>全国英语六级(CET-6)</span>
            <span>校三好学生</span>
            <span>校优秀共青团员</span>
          </div>
        </div>
      </div>
      <div class="right">
        <div class="wrap">
          <div class="title">项目经验</div>
          <div class="baseInfo experience">
            <div class="base_title">京东行走书店APP用户端</div>
            <div class="detail">
              <p class="intro">
                京东网上书店用户端，包含商品分类展示、购物车、结算、充值、查看订单等购物流程。前端使用vue独立开发完成，后端使用java,由8人开发完成，周期1个月。
              </p>
              <h3>项目成绩</h3>
              <div class="score">
                <span>1.定制化开发滚动级联组件，使页面获得更好的交互效果。</span>
                <span>2.对后端'商品分类'数据进行重组。</span>
                <span>3.为达到设计稿要求，使用原生flex布局完成所有样式开发。</span>
                <span>4.组件间的数据流转，提高组件的复用程度。</span>

              </div>
            </div>
          </div>
          <div class="baseInfo experience">
            <div class="base_title">京东行走书店PC客户端</div>
            <div class="detail">
              <p class="intro">
                面向商家用户的管理系统，其中包括商品、订单、用户、广告等多种管理模块，前端使用vue和elementUI进行构建，并集成moment、分页等组件，独立完成前端开发及联调任务。
              </p>
              <h3>项目成绩</h3>
              <div class="score">
                <span>1.使用elementUI，简化了项目的样式编辑工作。</span>
                <span>2.使用多种方法持久化用户数据，减少了页面请求数据，提升了页面性能。</span>
                <span>3.使用部分es6语法减少代码量，提升工作效率。</span>
                <span>4.实现充值管理页面开发。</span>
                <span>5.使用echarts插件，提供数据可视化图表。</span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name:'lx'
}
</script>

<style lang="scss" scoped>
  .container{
    width:80%;
    margin:10px auto;
    // border:1px solid red;
    font-size: 0;
    // height: 1000px;
    .header{
      height: 186px;
      background: #fafafa;
      display: flex;
      justify-content: space-around;
      align-items: center;
      border-bottom: 1px solid gainsboro;
      .head_title{
        display: flex;
        justify-content: space-around;
        flex-direction: column;
        font-size: 30px;
        height: 65%;
        color: burlywood;
        .s_title{
          font-size:23px;
        }
      }
      .img,.work,.head_title{
        padding-right: 15px;
      }
      .work{
        font-size: 18px;
        color: burlywood;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: flex-start;
        height: 100%;
      }
      .img{
        img{
          width: 115px;
        }
      }
    }
    .content{
      margin-top: 20px;
      display: flex;
      justify-content: space-around;
      align-items: flex-start;
      .left{
        width: 40%;
        padding: 0 10px 0 0;
      }
      .right{
        width:60%;
      }
      .left,.right{
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        .title{
            font-size: 18px;
            font-weight: bold;
            background-color: burlywood;
            color: white;
            height: 30px;
            line-height: 30px;
            border-radius: 20px;
            width: 130px;
            text-align: center;
            margin-bottom: 10px;
        }

        .baseInfo{
          height: auto;
          padding-bottom: 20px;
          .title{
            font-size: 18px;
            font-weight: bold;
            background-color: burlywood;
            color: white;
            height: 30px;
            line-height: 30px;
            border-radius: 20px;
            width: 130px;
            text-align: center;
            margin-bottom: 10px;
          }
          .base_title{
            font-size: 16px;
            color: burlywood;
            font-weight: 600;
            padding-left: 27px;

          }
          .detail{
            font-size:15px;
            // color: burlywood;
            color: #6c5c48;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            align-items: flex-start;
            padding-left:20px;
            span{
              padding: 5px 0;
            }
          }
        }
        .experience{
          .detail{
            .intro{
              padding-left:7px
            }
            h3{
              font-size: 16px;
              font-weight: 600;
              margin: 5px;
              color: burlywood;
            }
            .score{
              display: flex;
              flex-direction: column;
              padding-left: 20px;
              span{
                padding:2px 0;
              }
            }
          }
        }
      }




    }
  }
</style>
