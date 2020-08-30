<template>
  <div class="resume">
    <div class="connect">
      <div class="gols">
        <div class="name">蒙婷</div>
        <div class="job">求职意向：前端开发工程师</div>
      </div>
      <div class="connect-way">
        <div class="phone">
          <svg-icon icon-class="phone" />&nbsp;&nbsp;15183353012
        </div>
        <div class="email">
          <svg-icon icon-class="email2" />&nbsp;&nbsp;997546598@qq.com
        </div>
      </div>
    </div>
    <div class="person-info">
      <div class="content">
        <div class="title">基本资料</div>
        <div class="info">
          <div class="left">
            <div class="item">
              <span>姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名:&nbsp;&nbsp;</span>
              <span>蒙&nbsp;&nbsp;婷</span>
            </div>
            <div class="item">
              <span>性&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;别:&nbsp;&nbsp;</span>
              <span>女</span>
            </div>
            <div class="item">
              <span>学&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;历:&nbsp;&nbsp;</span>
              <span>本&nbsp;&nbsp;科</span>
            </div>
          </div>
          <div class="right">
            <div class="item">
              <span>出生年月:</span>
              <span>1998年05月</span>
            </div>
            <div class="item">
              <span>毕业院校:</span>
              <span>成都东软学院</span>
            </div>
            <div class="item">
              <span>专&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;业:</span>
              <span>计算机科学与技术</span>
            </div>
          </div>
        </div>
      </div>
      <img src="@/assets/mt.jpg" width="120" />
    </div>
    <div class="honor">
      <div class="title">获得荣誉及证书</div>
      <div class="contain">
        <ul>
          <li>小学期项目三等奖</li>
          <li>2018-2019计科系学风标兵</li>
          <li>MOS大师级认证</li>
        </ul>
        <ul>
          <li>英语四六级证书</li>
          <li>计科系创青春书画比赛二等奖</li>
          <li>机动车驾驶证</li>
        </ul>
      </div>
    </div>
    <div class="experience">
      <div class="title">项目经验</div>
      <div class="container">
        <div class="app-project">
          <div class="name">京东行走书店APP端</div>
          <div
            class="background"
          >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;京东行走书店app端包含：浏览热门商品，根据分类查看对应商品，加购商品，商品结算，商品订单查询等功能。由前端使用vue独立开发和后端8人完成，周期为1个月</div>
          <div class="content">
            <p>项目成绩</p>
            <ul>
              <li>1.根据项目需求独立开发了轮播图，可以使用多种业务场景</li>
              <li>2.为了达到更好的交互效果，将商品分类的后端数据进行重组</li>
              <li>3.使用session Storage对用户登陆信息进行保存,以减少登录次数，提升性能</li>
            </ul>
          </div>
        </div>
        <div class="pc-project">
          <div class="name">京东行走书店PC端</div>
          <div
            class="background"
          >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;京东行走书店pc端是面向商家的管理系统，包含商品和商品分类的管理，商品轮播的管理，用户订单的查询，用户信息的查询，系统用户的管理等，前端使用了elementUI写框架,moment格式化时间等，由前端独立开发和联调。</div>
          <div class="content">
            <p>项目成绩</p>
            <ul>
              <li>1.重构了分页组件使之符合设计需求</li>
              <li>2.使用了阿里字体图库</li>
              <li>3.使用了elementUI减少了对页面样式的设置时间</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="skill">
      <div class="title">个人技能和素养</div>
      <ul>
        <li>掌握HTML5、CSS、JavaScript，能够使用vue进行开发，会使用组件；</li>
        <li>会使用Axure制作基础的网页原型，能够做需求评审</li>
        <li>能够使用word,excel,ppt等办公软件，能使用英语进行日常交流，有日语基础；</li>
        <li>具有较强的沟通能力与团队合作精神，具有良好的分析问题、解决问题的能力以及较强的学习能力、抗压能力</li>
      </ul>
    </div>
    <div class="footer"></div>
  </div>
</template>

<script>
export default {
  name:'mt'
};
</script>

<style lang="scss" scoped>
ul,
li,
p {
  margin: 0;
  padding: 0;
}
li {
  list-style: none;
}
.resume {
  max-width: 960px;
  min-width: 600px;
  border: 1px solid #999;
  margin-left: 100px;
  margin: 0 auto;
  .connect {
    background: rgb(18, 45, 75);
    color: #fff;
    padding: 30px 80px 30px 30px;
    display: flex;
    justify-content: space-between;

    .name {
      font-size: 40px;
      margin-bottom: 10px;
    }
    .email {
      margin-top: 35px;
    }
  }
  .person-info {
    padding-top: 30px;
    position: relative;
    .content {
      background-color: #eee;
      width: 75%;
      .title {
        font-size: 18px;
        background: linear-gradient(30deg, rgb(18, 45, 75) 60%, #eee 40%);
        height: 40px;
        color: #fff;
        padding-left: 30px;
        line-height: 40px;
        width: 50%;
      }
      .info {
        padding: 15px 0 15px 30px;
        background-color: #fff;
        display: flex;
        justify-content: space-between;
        .right {
          padding-right: 50px;
        }
        .item {
          line-height: 25px;
        }
      }
    }
    img {
      position: absolute;
      top: 30px;
      left: 80%;
    }
  }
  .honor {
    background-color: #eee;
    width: 75%;
    .title {
      font-size: 18px;
      background: linear-gradient(30deg, rgb(18, 45, 75) 60%, #eee 40%);
      height: 40px;
      color: #fff;
      padding-left: 30px;
      line-height: 40px;
      width: 60%;
    }
    .contain {
      display: flex;
      justify-content: space-between;
      background-color: #fff;
      ul {
        padding: 15px 43px 15px 30px;
        li {
          line-height: 30px;
        }
      }
    }
  }
}
.experience {
  background-color: #eee;
  width: 100%;
  .title {
    font-size: 18px;
    background: linear-gradient(30deg, rgb(18, 45, 75) 60%, #eee 40%);
    height: 40px;
    color: #fff;
    padding-left: 30px;
    line-height: 40px;
    width: 50%;
  }
  .container {
    background-color: #fff;
    padding: 15px 30px 5px 30px;
    .name {
      font-weight: bold;
    }
    .background{
      padding: 10px 0;
      color: #333;
    }
    .content{
      p{
        font-weight: 500;
      }
      ul{
        padding: 10px 0;
        li{
          line-height: 20px;
        }
      }
    }

  }
}
.skill {
  background-color: #eee;
  width: 100%;
  .title {
    font-size: 18px;
    background: linear-gradient(30deg, rgb(18, 45, 75) 60%, #eee 40%);
    height: 40px;
    color: #fff;
    padding-left: 30px;
    line-height: 40px;
    width: 50%;
  }
  ul {
    padding: 0;
    margin: 0;
    background-color: #fff;
    padding: 15px 0 15px 30px;
    li {
      line-height: 25px;
    }
  }
}
.footer {
  background-color: rgb(18, 45, 75);
  height: 30px;
}
</style>