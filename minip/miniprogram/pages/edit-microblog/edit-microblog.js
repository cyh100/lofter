const MAx_COUNT = 9
let avatarUrl, nickName

Page({

    data: {
        content: '',
        imgsUrl: []
    },

    onLoad: function(options) {
        avatarUrl = options.avatarUrl
        nickName = options.nickName
    },

    // 获取已输入的文本长度
    inputHandler: function(e) {
        const value = e.detail.value
        this.setData({
            content: value
        })
    },

    // 选择图片
    imgSelect() {
        // 每次选择图片之前，先计算出此次最多可选的图片数量
        const _count = MAx_COUNT - this.data.imgsUrl.length
        if (_count > 0) {
            wx.chooseImage({
                count: _count,
                sourceType: ['album', 'camera'],
                sizeType: ['compressed', 'original'],
                success: (res) => {
                    this.setData({
                        imgsUrl: this.data.imgsUrl.concat(res.tempFilePaths)
                    })
                }
            })
        }
    },

    // 预览图片
    previewImgs: function (e) {
        wx.previewImage({
            urls: this.data.imgsUrl,
            current: e.target.dataset.imgsrc
        })
    },

    // 删除图片
    imgDelete: function(e) {
        const index = e.target.dataset.index
        this.data.imgsUrl.splice(index, 1)
        this.setData({
            imgsUrl: this.data.imgsUrl
        })
    },

    // 发送功能
    send: async function() {
        // 定义：待上传的图片列表 && 用于接收已上传云存储的图片对应的fileId列表
        const uploadImgsUrl = this.data.imgsUrl
        let fileIdsArr = []

        wx.showLoading({
            title: '发表中',
            mask: true
        })

        // 若图片列表不为空则依次上传至云存储空间
        if (uploadImgsUrl.length > 0) {
            const tasks = []
            for (let i = 0, len = uploadImgsUrl.length; i < len; i++) {
                const item = uploadImgsUrl[i]
                const suffix = /\.\w+$/.exec(item)[0]
                const itemColudPath = 'microblog/' + Date.now() + '_' + Math.floor(Math.random() * 10000) + suffix
                const promise = new Promise((resolve, reject) => {
                    wx.cloud.uploadFile({
                        cloudPath: itemColudPath,
                        filePath: item,
                        success: (res) => {
                            resolve(res.fileID)
                        },
                        fail: (err) => {
                            reject(err)
                        }
                    })
                })
                tasks.push(promise)
            }
            fileIdsArr = await Promise.all(tasks)
        }

        // 将博客内容、上传图片的fileId、用户头像、昵称、当前日期合并为一条记录，插入microblog表中
        const db = wx.cloud.database()
        const microblogCollection = db.collection('microblog')
        microblogCollection.add({
            data: {
                content: this.data.content,
                fileIdsUrl: fileIdsArr,
                avatarUrl,
                nickName,
                createTime: db.serverDate()
            }
        }).then(res => {
            wx.hideLoading()
            wx.showToast({
                title: '发表成功',
            })

            // 返回博客列表页，并刷新
            wx.navigateBack()
            const pages = getCurrentPages()
            const microblogPage = pages[0]
            microblogPage.onPullDownRefresh()

        }).catch(err => {
            wx.hideLoading()
            wx.showToast({
                title: '发表失败',
            })
        })

    }


})