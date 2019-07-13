import request from '@/utils/request'

export function fetchPage(data) {
  return request({
    url: '/role/fetchPage',
    method: 'get',
    params:data
  })
}
export function fetchRoleList(){
  return request({
    url: '/role/fetchList',
    method: 'get',
  })
}
export function getRoleInfo(roleId) {
    return request({
      url: '/role/fetch/'+roleId,
      method: 'get',
    })
  }
export function addRole(data) {
    return request({
      url: '/role/create',
      method: 'post',
      data
    })
}

export function updRole(data) {
    return request({
      url: '/role/update',
      method: 'post',
      data
    })
}

export function deleteRole(roleId){
  return request({
    url:'/role/delete/'+roleId,
    method:'post'
  })
}