// 云函数入口文件
const cloud = require('wx-server-sdk')
const tcbRouter = require('tcb-router')
const rp = require('request-promise')

const baseUrl = 'http://musicapi.xiecheng.live'

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async(event, context) => {
    const app = new tcbRouter({ event })

    // 从playlist表中获取歌单列表
    app.router('playlist', async(ctx, next) => {
        ctx.body = await cloud.database().collection('playlist')
            .skip(event.start)
            .limit(event.count)
            .orderBy('createTime', 'desc')
            .get()
    })

    // 根据playlistId请求对应的歌曲列表
    app.router('musiclist', async (ctx, next) => {
        const url = baseUrl + `/playlist/detail?id=${event.playlistId}` 
        ctx.body = await rp(url)
    })

    app.router('musicInfo', async (ctx, next) => {
        const url = baseUrl + `/song/url?id=${event.musicId}`
        const res = await rp(url)
        ctx.body = JSON.parse(res).data[0]
    })

    return app.serve()
}
