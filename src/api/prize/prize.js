import request from '@/utils/request'

export function getPrizePageList(data) {
  return request({
    url: '/prize/getListPage',
    method: 'get',
    params:data
  })
}

export function getPrize(id) {
    return request({
      url: '/prize/getPrize?id='+id,
      method: 'get',
    })
  }
export function addPrize(data) {
    return request({
      url: '/prize/add',
      method: 'post',
      data
    })
}

export function updPrize(data) {
    return request({
      url: '/prize/update',
      method: 'put',
      data
    })
}

