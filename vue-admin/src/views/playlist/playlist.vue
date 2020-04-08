<template>
  <div>
    <el-table v-loading="loading" :data="playlist" :stripe="true" style="width: 100%">
      <el-table-column type="index" width="50" />
      <el-table-column label="封面" width="100">
        <template slot-scope="scope">
          <img :src="scope.row.picUrl" height="50" width="50">
        </template>
      </el-table-column>
      <el-table-column prop="name" label="歌单名称" />
      <el-table-column prop="copywriter" label="描述" />
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="onEdit(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="onDelete(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
      <span>确定要删除这份歌单么？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmDel">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getPlaylist, deleteById } from '@/api/playlist'
import scroll from '@/utils/scroll'
export default {
  data() {
    return {
      playlist: [],
      index: '',
      loading: true,
      dialogVisible: false
    }
  },

  created() {
    this._getList()
  },

  mounted() {
    scroll.start(this._getList)
  },

  methods: {
    _getList() {
      getPlaylist({
        start: this.playlist.length,
        count: 20
      }).then(res => {
        this.loading = false
        if (res.data.length < 20) {
          scroll.end()
        }
        this.playlist = this.playlist.concat(res.data)
      })
    },

    onEdit(row) {
      this.$router.push(`/playlist/edit/${row._id}`)
    },

    onDelete(scope) {
      this.index = scope.$index
      this.dialogVisible = true
    },

    confirmDel() {
      deleteById({
        _id: this.playlist[this.index]._id
      }).then(res => {
        if (res.data.deleted > 0) {
          this.dialogVisible = false
          this.playlist.splice(this.index, 1)
          this.$message({
            message: '删除成功',
            type: 'success',
            duration: 3000
          })
        } else {
          this.$message.error('删除失败')
        }
      })
    }
  }
}
</script>

<style lang="">
</style>
