let currentIndex, musiclist
const bgAudioManager = wx.getBackgroundAudioManager()

Page({

    data: {
        picUrl: '',
        isPlaying: false
    },

    onLoad: async function (options) {

        const { index } = options
        currentIndex = parseInt(index)

        // 根据歌曲在列表中的index，从storage中获取所选中歌曲的相关信息
        musiclist = wx.getStorageSync('musiclist')

        await this._play(currentIndex)
    },

    playToggle() {
        if(this.data.isPlaying) {
            this.setData({
                isPlaying: false
            })
            bgAudioManager.pause()
        } else {
            this.setData({
                isPlaying: true
            })
            bgAudioManager.play()
        }
    },

    async playBefore() {
        bgAudioManager.stop()
        currentIndex = currentIndex === 0 ? musiclist.length - 1 : currentIndex -= 1
        await this._play(currentIndex)

        // 播放上一首時，把歌曲添加到最近播放列表recentMusiclist中
        let recentMusiclist = wx.getStorageSync('recentMusiclist')
        recentMusiclist = this.replaceUnshift(recentMusiclist, musiclist[currentIndex])
        wx.setStorageSync('recentMusiclist', recentMusiclist)
        // console.log(recentMusiclist)
    },

    async playNext() {
        bgAudioManager.stop()
        currentIndex = currentIndex === musiclist.length - 1 ? 0 : currentIndex += 1
        await this._play(currentIndex)

        // 播放下一首時，把歌曲添加到最近播放列表recentMusiclist中
        let recentMusiclist = wx.getStorageSync('recentMusiclist')
        recentMusiclist = this.replaceUnshift(recentMusiclist, musiclist[currentIndex])
        wx.setStorageSync('recentMusiclist', recentMusiclist)
        // console.log(recentMusiclist)
    },


    async _play(index) {

        const { name, al, ar } = musiclist[index]

        wx.setNavigationBarTitle({
            title: name
        })

        this.setData({
            picUrl: al.picUrl,
            isPlaying: true
        })

        // 调用music云函数，获取music对应的播放地址
        const musicUrl = await this._getMusicUrl(index)

        bgAudioManager.src = musicUrl
        bgAudioManager.title = name
        bgAudioManager.singer = ar[0].name
        bgAudioManager.coverImgUrl = al.picUrl
        bgAudioManager.epname = al.name
    },


    // 根据当前歌曲的index,得到对应歌曲的id,调用云函数获取该歌曲的url
    async _getMusicUrl(index) {

        const musicId = musiclist[index].id
        
        return await wx.cloud.callFunction({
            name: 'music',
            data: {
                musicId,
                $url: 'musicInfo'
            }
        }).then(res => res.result.url)
    },


    replaceUnshift(arr, obj) {
        let flag = false
        for (let i = 0, len = arr.length; i < len; i++) {
            if (arr[i].id === obj.id) {
                arr.splice(i, 1)
            }
        }
        arr.unshift(obj)
        return arr
    }
})