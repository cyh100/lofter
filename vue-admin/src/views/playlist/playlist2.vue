<template>
  <div>
    <el-table :data="playlist2" height="550" :stripe="true" style="width: 100%;">
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

    <el-row :gutter="20">
      <el-col :span="12" :offset="5">
        <el-pagination
          :current-page="1"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="10"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </el-col>
    </el-row>

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
import { getListCount, getPlaylist, deleteById } from '@/api/playlist'
export default {
  data() {
    return {
      playlist2: [],
      index: '',
      start: 0,
      count: 10,
      total: 20,
      dialogVisible: false
    }
  },

  created() {
    this._getCount()
    this._getList()
  },

  methods: {
    _getCount() {
      getListCount().then(res => {
        this.total = res.data.pager.Total
      })
    },

    _getList() {
      this.loading = true
      getPlaylist({
        start: this.start,
        count: this.count
      }).then(res => {
        this.playlist2 = res.data
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
        _id: this.playlist2[this.index]._id
      }).then(res => {
        if (res.data.deleted > 0) {
          this.dialogVisible = false
          this.playlist2.splice(this.index, 1)
          this.$message({
            message: '删除成功 ~o~',
            type: 'success',
            duration: 3000
          })
        } else {
          this.$message.error('删除失败 -_-！')
        }
      })
    },

    handleSizeChange(size) {
      this.count = size
      this._getList()
    },

    handleCurrentChange(page) {
      this.start = (page - 1) * this.count
      this._getList()
    }
  }
}
</script>

<style lang="">
</style>
