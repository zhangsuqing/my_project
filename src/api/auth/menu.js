import request from '@/utils/request'
//路由获取当前用户拥有的菜单
export function getRouterMenuList() {
  return request({
    url: '/menu/nav',
    method: 'get',
  })
}
export function getMenuList() {
  return request({
    url: '/menu/list',
    method: 'get',
  })
}

export function getMenuInfo(menuId) {
  return request({
    url: '/menu/info/'+menuId,
    method: 'get',
  })
}
//选择菜单(添加、修改菜单)
export function getParentMenuList(){
  return request({
    url: '/menu/select',
    method: 'get',
  })
}
export function addMenu(data) {
    return request({
      url: '/menu/save',
      method: 'post',
      data
    })
}

export function updateMenu(data) {
    return request({
      url: '/menu/update',
      method: 'post',
      data
    })
}

export function deleteMenu(menuId){
  return request({
    url:'/menu/delete/'+menuId,
    method:'post'
  })
}
