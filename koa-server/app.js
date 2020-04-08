const Koa = require('koa')
const cors = require('@koa/cors')
const Router = require('koa-router')
const bodyParser = require('koa-body')
const playlist = require('./router/playlist')
const swiper = require('./router/swiper')
const microblog = require('./router/microblog')


const app = new Koa()
const router = new Router()

app.use(cors())
app.use(bodyParser({
    multipart: true,
    formidable: {
        maxFieldsSize: 3 * 1024 * 1024, // 最大文件为3兆
        multipart: true // 是否支持 multipart-formdate 的表单
    }
}))

router.use(playlist.routes())
router.use(swiper.routes())
router.use(microblog.routes())


app.use(router.routes())
app.use(router.allowedMethods())

app.listen(3000, () => {
    console.log('server is runninng at port 3000')
})