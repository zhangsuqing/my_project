import request from '@/utils/request'
//获取验证码
export function getCaptcha(uuid) {
  const tokenKey = 'get'
  return request({
    url: '/admin/getCaptcha?uuid='+uuid,
    method: 'get',
  })
}
//登录
export function loginByUsername(data) {
  return request({
    url: '/admin/login',
    method: 'post',
    data
  })
}
//退出
export function logout() {
  return request({
    url: '/admin/logout',
    method: 'post'
  })
}



