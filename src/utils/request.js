import axios from 'axios'
import store from '@/store'
// import { getToken } from '@/utils/auth'
import loading from '@/utils/loading'
import message from '@/utils/message'
// import { logout } from '@/api/login'
import { clearLoginInfo } from '@/utils'
import router from '@/router'

const codeMessage = {
  404: '访问的网页不存在',
  500: '服务器发生错误',
  502: '网关错误。',
  503: '服务暂时不可用，服务器暂时过载或维护，请稍后再访问。',
  504: '连接超时，请稍后再试。',
}

// create an axios instance

axios.defaults.withCredentials = true
const service = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL, // api的base_url
  timeout: 180000 // request timeout
})

// request interceptor
service.interceptors.request.use(config => {
  // Do something before request is sent
  if (sessionStorage.getItem("token")) {
    config.headers['token'] = sessionStorage.getItem("token") // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
  }
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// respone interceptor
service.interceptors.response.use(
  response => {
  /**
  * 下面的注释为通过response自定义code来标示请求状态，当code返回如下情况为权限有问题，登出并返回到登录页
  * 如通过xmlhttprequest 状态码标识 逻辑可写在下面error中
  */
    const res = response.data
    if (res.code === 403) {
      // logout().then(() => {
        // location.reload()// 为了重新实例化vue-router对象 避免bug
        clearLoginInfo()
        router.push({ name: 'login' })
        return Promise.reject(response);
      // })
      // return Promise.reject('error')
    } else {
      return response
    }
  },
  error => {
    loading.close();
    let err = '系统崩溃';
    if(error && error.response) {
      err = codeMessage[error.response.status]?codeMessage[error.response.status]:err;
    }
    message.showError(2,err);
    return Promise.reject(err);
  })
export default service
