<template>
  <div class="wrapper">
    <el-table
      ref="multipleTable"
      :data="list"
      :stripe="true"
      height="500"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="50" style="margin-left: 20;" />
      <el-table-column type="index" width="50" />
      <el-table-column label="图片" width="400">
        <template slot-scope="scope">
          <img :src="scope.row.download_url" height="200" width="300">
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button type="danger" @click="deleteItem(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div style="margin-top: 20px">
      <el-button :disabled="!multipleSelection.length" @click="toggleSelection()">取消选择</el-button>
      <el-button type="danger" :disabled="!multipleSelection.length" @click="deleteAll()">删除选中</el-button>
    </div>

    <el-dialog title="提示" :visible.sync="dialogVisible1" width="30%">
      <span>确定要删除所选图片么？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible1 = false">取 消</el-button>
        <el-button type="primary" @click="confirmDelItem">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="提示" :visible.sync="dialogVisible2" width="30%">
      <span>确定要删除所选图片么？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="confirmDelAll">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getList, deleteList } from '../../api/swiper'
export default {
  data() {
    return {
      list: [],
      multipleSelection: [],
      index: '',
      dialogVisible1: false,
      dialogVisible2: false
    }
  },

  created() {
    this.getSwiperList()
  },

  methods: {
    getSwiperList() {
      getList({
        start: this.list.length,
        count: 10
      }).then(res => {
        this.list = res.data
      })
    },

    handleSelectionChange(val) {
      this.multipleSelection = val
    },

    toggleSelection() {
      this.$refs.multipleTable.clearSelection()
    },

    deleteItem(scope) {
      this.index = scope.$index
      this.dialogVisible1 = true
    },

    confirmDelItem() {
      this.dialogVisible1 = false
      deleteList({
        list: [
          {
            _id: this.list[this.index]._id,
            fileid: this.list[this.index].fileid
          }
        ]
      }).then(res => {
        if (res.data.delete_list.length > 0) {
          this.list.splice(this.index, 1)
          this.$message({
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
        } else {
          this.$message.error('删除失败')
        }
      })
    },

    deleteAll() {
      this.dialogVisible2 = true
    },

    confirmDelAll() {
      this.dialogVisible2 = false
      deleteList({
        list: this.multipleSelection.map(item => {
          return {
            _id: item._id,
            fileid: item.fileid
          }
        })
      }).then(res => {
        if (res.data.delete_list.length > 0) {
          this.$message({
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          this.list = []
          this.getSwiperList()
        } else {
          this.$message.error('删除失败')
        }
      })
    }
  }
}
</script>

<style>
.wrapper {
  width: 90%;
  margin: 10px auto;
}
</style>
