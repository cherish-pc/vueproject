import axios from 'axios'
import layer from 'vue-layer-mobile'


// 后台地址
var BASE_URL = '/api'

// create an axios instance
const service = axios.create({
  baseURL: BASE_URL, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 50000 // request timeout
})


// response interceptor
// 请求后返回的数据拦截
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    console.log(response);
    const res = response.data
    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 1) {
      console.log('请求失败'+res.msg || '没有返回信息');

      layer.toast({
        icon: 'icon', // 图标clssName 如果为空 toast位置位于下方,否则居中
        content: res.msg,
        time: 2000 // 自动消失时间 toast类型默认消失时间为2000毫秒
      })
      return Promise.reject(new Error(res.msg || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log('网络不通' + error) // for debug
    
    return Promise.reject(error)
  }
)

export default service
