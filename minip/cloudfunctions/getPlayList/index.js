// 云函数入口文件
const cloud = require('wx-server-sdk')
const rp = require('request-promise')

const URL = 'http://musicapi.xiecheng.live/personalized'

cloud.init()

const db = cloud.database()
const playlistCollection = db.collection('playlist')

const MAX_LIMIT = 100


exports.main = async(event, context) => {

    // 从指定api获取歌单列表数据（需要做去重处理，防止歌单重复）
    const playlist = await rp(URL).then((res) => {
        return JSON.parse(res).result
    })


    // 查询数据库中已存在的歌单列表: dbPlaylist
    //   先取出集合记录总数
    const countResult = await playlistCollection.count()
    const total = countResult.total
    //    计算需分几次取
    const batchTimes = Math.ceil(total / 100)
    //   承载所有读操作的 promise 的数组
    const tasks = []
    for (let i = 0; i < batchTimes; i++) {
        const promise = playlistCollection.skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
        tasks.push(promise)
    }
    //  等待所有
    const getAll = (await Promise.all(tasks)).reduce((acc, cur) => {
        return {
            data: acc.data.concat(cur.data),
            errMsg: acc.errMsg,
        }
    })
    //  得到palylist表中已有的全部数据
    const dbPlaylist = getAll.data



    // 新建一个接收数据库中未存在列表项的空数组
    const insertData = []

    // 去重：将palylist中已存在于dbPlaylist的列表项删除
    for (let i = 0, len = playlist.length; i < len; i++) {
        let flag = true
        for (let j = 0, len = dbPlaylist.length; j < len; j++) {
            if (dbPlaylist[j].id === playlist[i].id) {
                flag = false
                break
            }
        }
        if (flag)
            insertData.push(playlist[i])
    }

    // 将去重处理后的歌单列表数据, 插入数据库中对应的playlist表中
    for (let i = 0, len = insertData.length; i < len; i++) {
        await playlistCollection.add({
            data: {
                ...insertData[i],
                createTime: db.serverDate()
            }
        }).then((res) => {
            console.log('插入成功')
        }).catch((err) => {
            console.error(err)
        })
    }

    return insertData.length
}