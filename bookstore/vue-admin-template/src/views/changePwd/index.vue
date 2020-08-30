<template>
  <div class="container">
    <el-form
      :rules="rules"
      ref="change"
      label-width="100px"
      :model="userFormTemp">
      <el-row>
          <!-- 姓名 -->
          <el-form-item label="原密码" prop="originPwd">
            <el-input v-model="userFormTemp.originPwd" type="password"/>
          </el-form-item>
      </el-row>
      <el-row>
          <!-- 密码 -->
          <el-form-item label="新密码" prop="newPwd">
            <el-input v-model="userFormTemp.newPwd" type="password"
            />
          </el-form-item>
      </el-row>
    </el-form>
     <!-- 底部确定取消按钮 -->
    <div slot="footer" class="footer">
      <el-button
        type="primary"
        @click="handleChangePwd()"
        >确定</el-button>
    </div>

  </div>
</template>

<script>
import {changePassword} from '@/api/user'
export default {
  name:'changePwd',
  data(){
    return {
      userFormTemp:{
        originPwd:"",
        newPwd:"",
      },
      rules:{
        originPwd:[
          {
            required:true,
            message:'请输入原始密码',
            trigger:'blur'
          },

        ],
        newPwd:[
          {
            required:true,
            message:'请输入新密码',
            trigger:'blur'
          },

        ],
      }
    }
  },
  methods:{
    handleChangePwd(){
      this.$refs.change.validate(valid =>{
        if(valid){
          var _parmas = {
            originPwd:this.userFormTemp.originPwd,
            newPwd:this.userFormTemp.newPwd,
            userId:JSON.parse(sessionStorage.getItem('userId')),
            userAccount:JSON.parse(sessionStorage.getItem('loginAccount'))
          };
          changePassword(_parmas).then(response=>{
            this.$notify({
                  title:'成功',
                  message:response.msg,
                  type:'success',
            });
          })
          this.userFormTemp={
              originPwd:"",
              newPwd:"",
          }
          this.$router.push('/login')
        }
       })

    },
  }
}
</script>

<style lang="scss" scoped>
.container{
  width: 70%;
  margin: 30px auto 0 auto;
  .footer{
    margin-left:50px;
  }
}
</style>
