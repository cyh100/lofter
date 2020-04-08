import request from '@/utils/request'

// 查询microblog表中记录总数请求
export function getBlogCount() {
  return request({
    url: 'http://localhost:3000/microblog/count',
    method: 'get'
  })
}

// 查询microblog表中指定skip和limit的记录请求
export function getBlogList(params) {
  return request({
    params,
    url: 'http://localhost:3000/microblog/list',
    method: 'get'
  })
}

// 删除microblog表中指定_id的记录请求
export function deleteById(params) {
  return request({
    data: {
      ...params
    },
    url: 'http://localhost:3000/microblog/delete',
    method: 'post'
  })
}
