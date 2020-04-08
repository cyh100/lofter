<template>
  <div>
    <el-table v-loading="loading" :data="blogList" :stripe="true" height="520" style="width: 100%">
      <el-table-column type="index" width="50" />
      <el-table-column prop="content" label="内容" />
      <el-table-column label="图片">
        <template slot-scope="scope">
          <template v-for="(item, _index) in scope.row.download_urls">
            <img :key="_index" :src="item" class="blog-img">
          </template>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="onDelete(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-row :gutter="20">
      <el-col :span="12" :offset="5">
        <el-pagination
          :current-page="1"
          :page-sizes="[10, 20, 50]"
          :page-size="10"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </el-col>
    </el-row>

    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
      <span>确定要删除这条微博么？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmDel">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getBlogCount, getBlogList, deleteById } from '@/api/microblog'
export default {
  data() {
    return {
      blogList: [],
      index: '',
      start: 0,
      count: 10,
      total: 20,
      loading: true,
      dialogVisible: false
    }
  },

  created() {
    this._getCount()
    this._getList()
  },

  methods: {
    _getCount() {
      getBlogCount().then(res => {
        this.total = res.data.pager.Total
      })
    },

    _getList() {
      getBlogList({
        start: this.start,
        count: this.count
      }).then(res => {
        this.loading = false
        this.blogList = res.data
      })
    },

    handleSizeChange(size) {
      this.count = size
      this._getList()
    },

    handleCurrentChange(page) {
      this.start = (page - 1) * this.count
      this._getList()
    },

    onDelete(scope) {
      this.index = scope.$index
      this.dialogVisible = true
    },

    confirmDel() {
      deleteById({
        _id: this.blogList[this.index]._id
      }).then(res => {
        if (res.data.removeRes.deleted > 0) {
          this.dialogVisible = false
          this.blogList.splice(this.index, 1)
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

<style>
.blog-img{
  width: 60px;
  height: 60px;
  margin: 5px;
}
</style>
