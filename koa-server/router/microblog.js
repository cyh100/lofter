const Router = require('koa-router')
const { countHandle, listHandle, deleteHandle } = require('../controller/microblog')
const router = new Router({
  prefix: '/microblog'
})


router.get('/count', async (ctx, next) => {

  const data = await countHandle()
  ctx.body = {
    code: 20000,
    data
  }
})


router.get('/list', async (ctx, next) => {
  let req_query = ctx.request.query
  const data = await listHandle(req_query)
  ctx.body = {
    code: 20000,
    data
  }
})


router.post('/delete', async (ctx, next) => {
  const { _id } = ctx.request.body
  const res = await deleteHandle(_id)
  // console.log(res)
  ctx.body = {
    code: 20000,
    data: res
  }
})


module.exports = router