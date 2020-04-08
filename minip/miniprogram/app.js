//app.js
App({
  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: '',
        traceUser: true,
      })
    }

    this.globalData = {}

    // 最近播放歌单列表
    if(!wx.getStorageSync('recentPlaylist')) {
      wx.setStorageSync('recentPlaylist', [])
    }

    // 最近播放歌曲列表
    if(!wx.getStorageSync('recentMusiclist')) {
      wx.setStorageSync('recentMusiclist', [])
    }

  }
})
