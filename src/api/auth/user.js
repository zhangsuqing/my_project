import request from '@/utils/request'

export function fetchPage(data) {
  return request({
    url: '/user/fetchPage',
    method: 'get',
    params:data
  })
}

export function getUserInfo(userId) {
    return request({
      url: 'user/fetch/'+userId,
      method: 'get',
    })
  }
export function addUser(data) {
    return request({
      url: '/user/create',
      method: 'post',
      data
    })
}

export function updUser(data) {
    return request({
      url: '/user/update',
      method: 'post',
      data
    })
}

