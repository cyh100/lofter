const rp = require('request-promise')
const _getToken = require('./_getToken')
const { ENV } = require('../config')

const upload_file = async (path, file) => {
  /* 首先：获取文件上传链接 */
  const access_token = await _getToken()
  const url_1 = `https://api.weixin.qq.com/tcb/uploadfile?access_token=${access_token}`
  const option_1 = {
    method: 'POST',
    uri: url_1,
    body: {
      env: ENV,
      path
    },
    json: true
  }
  const uploadUrlRes = await rp(option_1)

  /* 
    其次：上传链接使用说明
    用户获取到返回数据后，需拼装一个 HTTP POST 请求，
    其中 url 为返回包的 url 字段，Body 部分格式为 multipart/form-data
  */
  const { url: url_2, authorization, token, cos_file_id } = uploadUrlRes
  const option_2 = {
    method: 'POST',
    uri: url_2,
    headers: {
      'content-type': 'multipart/form-data'
    },
    formData: {
      key: path,
      Signature: authorization,
      'x-cos-security-token': token,
      'x-cos-meta-fileid': cos_file_id,
      file
    },
    json: true
  }
  await rp(option_2)

  /* 最终返回云存储中的fileid，后期需要插入到对应的数据库中 */
  return uploadUrlRes.file_id
}


const get_downloadUrl = async (file_list) => {
  const access_token = await _getToken()
  const url = `https://api.weixin.qq.com/tcb/batchdownloadfile?access_token=${access_token}`
  const option = {
    method: 'POST',
    uri: url,
    body: {
      env: ENV,
      file_list
    },
    json: true
  }
  return await rp(option)
}


const delete_file = async (fileid_list) => {
  const access_token = await _getToken()
  const url = `https://api.weixin.qq.com/tcb/batchdeletefile?access_token=${access_token}`
  const option = {
    method: 'POST',
    uri: url,
    body: {
      env: ENV,
      fileid_list
    },
    json: true
  }
  return await rp(option)
}

module.exports = {
  upload_file,
  get_downloadUrl,
  delete_file
}