import request from '@/utils/request'

export function getActivityPageList(data) {
  return request({
    url: '/activity/getActivityPageList',
    method: 'get',
    params:data
  })
}

export function getActivityDetail(id) {
    return request({
      url: '/activity/getActivityDetail?id='+id,
      method: 'get',
    })
}

export function getAddressPageList(data) {
    return request({
        url: '/activityAddress/getPageList',
        method: 'get',
        params: data
    })
}
export function getAddressDetail(id) {
    return request({
        url: '/activityAddress/getAddressDetail?id='+id,
        method: 'get',
    })
}
export function getPrizeList(data) {
    return request({
        url: '/prize/list',
        method: 'get',
        data
    })
}

export function getActivityPrizePageList(data) {
    return request({
        url: '/activityPrize/getPageList',
        method: 'get',
        params: data
    })
}
export function getActivityPrizeDetail(id) {
    return request({
        url: '/activityPrize/getActivityPrizeDetail?id='+id,
        method: 'get',
    })
}

export function getBatchPageList(data) {
    return request({
        url: '/batch/getBatchPageList',
        method: 'get',
        params: data
    })
}
export function addActivity(data) {
    return request({
      url: '/activity/addActivity',
      method: 'post',
      data
    })
}

export function addAddress(data) {
    return request({
      url: '/activityAddress/addAddress',
      method: 'post',
      data
    })
}

export function activityPrizeBinding(data) {
    return request({
      url: '/activityPrize/activityPrizeBinding',
      method: 'post',
      data
    })
}
export function updateActivity(data) {
    return request({
      url: '/activity/updateActivity',
      method: 'post',
      data
    })
}
export function updateAddress(data) {
    return request({
      url: '/activityAddress/updateAddress',
      method: 'post',
      data
    })
}

export function updateActivityPrize(data) {
    return request({
      url: '/activityPrize/updateActivityPrize',
      method: 'post',
      data
    })
}


export function getCodes(batchId) {
    return request({
      url: '/exchangeCode/getCodes?batchId='+batchId,
      method: 'get',
    })
}

export function generateCodes(data) {
    return request({
      url: '/exchangeCode/generateCodes',
      method: 'post',
      data
    })
}
export function deleteAddress(id) {
    return request({
      url: '/activityAddress/deleteAddress?id='+id,
      method: 'post',
    })
}

export function getCodeListByActivityId(data) {
    return request({
      url: '/exchangeCode/getCodeListByActivityId',
      method: 'get',
      params:data
    })
  }