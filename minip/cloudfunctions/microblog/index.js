// 云函数入口文件
const cloud = require('wx-server-sdk')
const tcbRouter = require('tcb-router')

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const microblog = db.collection('microblog')

// 云函数入口函数
exports.main = async (event, context) => {
    const app = new tcbRouter({
        event
    })

    app.router('microblog', async (ctx, next) => {
        const microblogList = await microblog.skip(event.start)
            .limit(event.count)
            .orderBy('createTime', 'desc')
            .get()
        ctx.body = microblogList
    })

    app.router('search', async (ctx, next) => {
        const searchList = await microblog.where({
            content: db.RegExp({
                regexp: event.keyword,
                options: 'i',
            })
        })
            .skip(event.start)
            .limit(event.count)
            .orderBy('createTime', 'desc')
            .get()
        ctx.body = searchList
    })

    app.router('myblog', async (ctx, next) => {
        const openid = cloud.getWXContext().OPENID
        const res = await microblog.where({
            _openid: openid
        }).skip(event.start)
            .limit(event.count)
            .orderBy('createTime', 'desc')
            .get()
        ctx.body = res
    })

    app.router('deleteById', async(ctx, next) => {

        const dbRes = await microblog.doc(event._id).remove()

        await cloud.deleteFile({
            fileList: event.fileIdsUrl
        })
        
        ctx.body = dbRes
    })

    return app.serve()
}