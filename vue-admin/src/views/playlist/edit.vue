<template>
  <el-form ref="form" :model="listInfo" label-width="120px" class="el-form">
    <el-form-item label="歌单封面">
      <el-col :span="15">
        <el-input v-model="listInfo.picUrl" />
      </el-col>
    </el-form-item>

    <el-form-item label="歌单名称">
      <el-col :span="15">
        <el-input v-model="listInfo.name" />
      </el-col>
    </el-form-item>

    <el-form-item label="歌单描述">
      <el-col :span="15">
        <el-input v-model="listInfo.copywriter" :autosize="{ minRows: 1, maxRows: 3}" />
      </el-col>
    </el-form-item>

    <el-form-item>
      <el-button :disabled="disabled" type="primary" @click="onUpdate">更新</el-button>
      <el-button @click="onCancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { getById, updateById } from '@/api/playlist'
export default {
  data() {
    return {
      listInfo: {},
      initInfo: {}
    }
  },
  computed: {
    disabled() {
      let flag = true
      for (const p in this.listInfo) {
        if (this.listInfo[p] !== this.initInfo[p]) {
          flag = false
          return
        }
      }
      return flag
    }
  },
  created() {
    getById({
      id: this.$route.params.id
    }).then(res => {
      this.listInfo = res.data
      this.initInfo = Object.assign({}, res.data)
    })
  },
  methods: {
    onUpdate() {
      const { _id, picUrl, name, copywriter } = this.listInfo
      updateById({
        _id,
        picUrl,
        name,
        copywriter
      }).then(res => {
        if (res.data.modified > 0) {
          this.$message({
            message: '更新成功 ^o^',
            type: 'success'
          })
        } else {
          this.$message.error('更新失败 ~_~')
        }
        this.$router.back()
      })
    },
    onCancel() {
      this.$router.back()
    }
  }
}
</script>

<style>
.el-form {
  margin-top: 20px;
}
</style>
