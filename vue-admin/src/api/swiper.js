import request from '@/utils/request'

export function getList(params) {
  return request({
    url: 'http://localhost:3000/swiper/list',
    method: 'get',
    params
  })
}

export function deleteList(params) {
  return request({
    url: 'http://localhost:3000/swiper/delete',
    method: 'post',
    data: {
      ...params
    }
  })
}
