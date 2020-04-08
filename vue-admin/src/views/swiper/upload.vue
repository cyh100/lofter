<template>
  <div>
    <el-upload
      class="upload-demo"
      action="http://localhost:3000/swiper/upload"
      :on-success="handleUploadSuccess"
      :file-list="fileList"
    >
      <el-button size="small" type="primary">点击上传</el-button>
    </el-upload>
  </div>
</template>

<script>
export default {
  data() {
    return {
      fileList: []
    }
  },
  methods: {
    handleUploadSuccess(res) {
      if (res.data.length > 0) {
        this.$message({
          type: 'success',
          message: '上传成功'
        })
      }
    }
  }

}
</script>

<style>
.upload-demo {
  margin: 20px 40px;
}
</style>
