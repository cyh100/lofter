import request from '@/utils/request'

// 查询microblog表中记录总数请求
export function getListCount() {
  return request({
    url: 'http://localhost:3000/playlist/count',
    method: 'get'
  })
}

// 查询playlist表中指定skip和limit的记录请求
export function getPlaylist(params) {
  return request({
    params,
    url: 'http://localhost:3000/playlist/playlist',
    method: 'get'
  })
}

// 查询playlist表中指定_id记录请求
export function getById(params) {
  return request({
    params,
    url: 'http://localhost:3000/playlist/getById',
    method: 'get'
  })
}

// 更新playlist表中指定_id记录请求
export function updateById(params) {
  return request({
    data: {
      ...params
    },
    url: 'http://localhost:3000/playlist/update',
    method: 'post'
  })
}

// 删除playlist表中指定_id记录请求
export function deleteById(params) {
  return request({
    data: {
      ...params
    },
    url: 'http://localhost:3000/playlist/delete',
    method: 'post'
  })
}
