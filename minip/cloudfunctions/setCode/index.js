// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    const openid = wxContext.OPENID

    try {
        const result = await cloud.openapi.wxacode.getUnlimited({
            scene: openid,
            lineColor: {
                r: '25',
                g: '239',
                b: '25'
            }
        })
        const res = await cloud.uploadFile({
            cloudPath: 'code/' + Date.now() + Math.floor(Math.random() * 10000) + '.jpeg',
            fileContent: result.buffer
        })
        return res
    } catch (err) {
        console.log(err)
        return err
    }


}