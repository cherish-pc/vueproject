import Vue from 'vue'
import Vuex from 'vuex'
import {login} from '@/api'
Vue.use(Vuex)

export default new Vuex.Store({
  // 全局共享的数据
  state: {
    userInfo:{}
  },
  mutations: {
    SET_USER:(state,data)=>{
      Object.assign(state.userInfo,data)
    },
    RESET_STATE: (state) => {
      Object.assign(state, {
        loginAccount:loginAccount,
        password:password,
        isAdmin:"0"
      })
    },
  },
  actions: {
    // 同步请求
    login({commit},userInfo){
      return new Promise((resolve,reject)=>{
        login(userInfo).then(response=>{
          const {data} = response;
          // console.log(data);
          sessionStorage.setItem('loginAccount',JSON.stringify(data.userAccount))
          sessionStorage.setItem('userId',JSON.stringify(data.id))
          commit('SET_USER',data)
          
          resolve()          
        }).catch(err=>{
          reject(err)
        })
      })
    }
    
    
  },
  modules: {
  }
})
