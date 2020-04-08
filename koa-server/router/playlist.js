const Router = require('koa-router')
const _callCloudFun = require('../utils/_callCloudFunc')
const { databaseQuery, databaseUpdate, databaseDelete } = require('../utils/_callCloudDb')


const router = new Router({
  prefix: '/playlist'
})

router.get('/count', async (ctx, next) => {
  const query = `db.collection('playlist').count()`
  const data = await databaseQuery(query)
  ctx.body = {
    code: 20000,
    data
  }
})

/*
  查询云数据库plalist表中记录,
  查询参数: start代表云数据库的skip, count代表云数据库的limit
*/
router.get('/playlist', async (ctx, next) => {
  let { start, count } = ctx.request.query
  start = parseInt(start)
  count = parseInt(count)
  const opts = {
    $url: 'playlist',
    start,
    count
  }

  const res = await _callCloudFun('music', opts)

  if (res.errcode === 0) {
    ctx.body = {
      code: 20000,
      data: JSON.parse(res.resp_data).data
    }
  } else {
    ctx.body = {
      code: 20000,
      errmsg: `errcode: ${res.errcode}, errmsg: ${res.errmsg}`
    }
  }

})

/*
  查询云数据库plalist表中指定id的记录
*/
router.get('/getById', async (ctx, next) => {
  const { id } = ctx.request.query
  const query = `db.collection('playlist').doc('${id}').get()`
  const res = await databaseQuery(query)
  ctx.body = {
    code: 20000,
    data: JSON.parse(res.data)
  }
})

/*
  更新云数据库playlist表中指定_id对应的数据
*/
router.post('/update', async (ctx, next) => {
  const { _id, picUrl, name, copywriter } = ctx.request.body
  const query = `
        db.collection('playlist').doc('${_id}').update({
          data: {
            picUrl: '${picUrl}',
            name: '${name}',
            copywriter: '${copywriter}'
          }
        })
  `
  const res = await databaseUpdate(query)

  ctx.body = {
    code: 20000,
    data: res
  }
})

/*
  删除云数据库playlist表中指定_id对应的数据
*/
router.post('/delete', async (ctx, next) => {
  const { _id } = ctx.request.body
  const query = `db.collection('playlist').doc('${_id}').remove()`
  const res = await databaseDelete(query)

  ctx.body = {
    code: 20000,
    data: res
  }
})

module.exports = router
