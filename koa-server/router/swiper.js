const Router = require('koa-router')
const { uploadHandle, listHandle, deleteHandle } = require('../controller/swiper')

const router = new Router({
  prefix: '/swiper'
})


/**
 *  请求参数：
 *    start：数据库读取操作的skip参数, 默认为0
 *    count：数据库读取操作的limit参数, 默认切最大为10
 *  最终期望返回： Array<object>
 *    object字段： _id(数据库_id), fileid(文件id), download_url(下载链接)
 */
router.get('/list', async (ctx, next) => {
  let req_query = ctx.request.query
  const data = await listHandle(req_query)
  ctx.body = {
    code: 20000,
    data
  }
})


/**
 * 
 */
router.post('/upload', async (ctx, next) => {
  const file = ctx.request.files.file
  const res = await uploadHandle(file)
  ctx.body = {
    code: 20000,
    data: res.id_list
  }
})


router.post('/delete', async (ctx, next) => {
  const { list } = ctx.request.body
  const res = await deleteHandle(list)
  ctx.body = {
    code: 20000,
    data: res
  }
})


module.exports = router