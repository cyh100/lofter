// components/musiclist/musiclist.js

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        musiclist: Array
    },

    data: {
        playingId: ''
    },

    methods: {
        onSelected: function (event) {
            const {
                id: musicId,
                index
            } = event.currentTarget.dataset
            this.setData({
                playingId: musicId
            })
            wx.navigateTo({
                url: `/pages/player/player?musicId=${musicId}&index=${index}`,
            })

            /*
                播放歌曲时，
                把歌单信息放到对应的recentPlaylist,
                歌曲信息recentMusiclist
            */
            let recentPlaylist = wx.getStorageSync('recentPlaylist')
            recentPlaylist = this.replaceUnshift(recentPlaylist, wx.getStorageSync('playlist'))
            wx.setStorageSync('recentPlaylist', recentPlaylist)

            let recentMusiclist = wx.getStorageSync('recentMusiclist')
            recentMusiclist = this.replaceUnshift(recentMusiclist, wx.getStorageSync('musiclist')[index])
            wx.setStorageSync('recentMusiclist', recentMusiclist)

        },

        replaceUnshift(arr, obj) {
            for (let i = 0, len = arr.length; i < len; i++) {
                if (arr[i].id === obj.id) {
                    arr.splice(i, 1)
                }
            }
            arr.unshift(obj)
            return arr
        }
    }
})