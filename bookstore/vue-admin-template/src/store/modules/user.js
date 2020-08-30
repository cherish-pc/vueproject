import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken,getLoginAccount,setLoginAccount } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    userInfo:{}
  }
}

const state = getDefaultState()
// 更改 Vuex 的 store 中的状态
const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  // 保存用户信息
  SET_USER_INFO: (state, data) => {
    state.userInfo = data
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    // Promise可以处理同步请求
    return new Promise((resolve, reject) => {
      var _parmas = {
        "loginAccount":username,
        "password":password,
        // pc端是1
        "isAdmin":"1"
      }
      login(_parmas).then(response => {
        // console.log(response.data)
        // debugger
        const { data } = response
        // debugger
        // 使用框架的管理员权限，如果后台有权限定义，则要改造
        data.token = 'admin-token'
        // 调用mutation的方法
        commit('SET_TOKEN', data.token)
        setToken('admin-token')
        // debugger
        // 用户名
        commit('SET_NAME', data.userName)
        // 头像
        commit('SET_AVATAR','http://b-ssl.duitang.com/uploads/item/201511/21/20151121171107_zMZcy.jpeg')
        // 把用户账号保存在本地，以便页面刷新时可以调用
        sessionStorage.setItem('loginAccount',JSON.stringify(data.userAccount))
        sessionStorage.setItem('userId',JSON.stringify(data.id))
        // cookie方式保存用户数据
        // setLoginAccount(data.userAccount);
        // 其他信息
        commit('SET_USER_INFO', data)

        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },



  // user logout
  logout({ commit, state }) {
    var _params = {
      userAccount:JSON.parse(sessionStorage.getItem('loginAccount'))
    }
    return new Promise((resolve, reject) => {
      logout(_params).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token 切换用户时需要resetToken
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}
  // get user info
  // 可以用已写接口
  // getInfo({ commit, state }) {
  //   return new Promise((resolve, reject) => {
  //     getInfo(state.token).then(response => {
  //       const { data } = response

  //       if (!data) {
  //         reject('Verification failed, please Login again.')
  //       }

  //       const { name, avatar } = data

  //       commit('SET_NAME', name)
  //       commit('SET_AVATAR', avatar)
  //       resolve(data)
  //     }).catch(error => {
  //       reject(error)
  //     })
  //   })
  // },

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

