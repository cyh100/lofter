const fs = require('fs')
const { databaseQuery, databaseAdd, databaseDelete } = require('../utils/_callCloudDb')
const { upload_file, get_downloadUrl, delete_file } = require('../utils/_callCloudStorage')

/* 
  get '/swiper/list'请求所对应的处理函数
*/
const listHandle = async (req_query) => {
  let { start = 0, count = 10 } = req_query
  start = parseInt(start)
  count = parseInt(count)

  // 查询数据库得到相应记录组成的数组: db_list
  const query = `db.collection('swiper')
                  .skip(${start}).limit(${count})
                  .orderBy('createTime', 'desc')
                  .get()`
  const db_res = await databaseQuery(query)
  const db_list = db_res.data

  // 向云存储下载api传递的POST请求参数file_list：req_file_list
  const req_file_list = db_list.map(item => {
    const fileid = JSON.parse(item).fileid
    return { fileid, max_age: 3600 }
  })

  // 云存储下载POST请求所返回的响应：res
  const res = await get_downloadUrl(req_file_list)

  if (res.errcode === 0) {
    // 云存储下载POST请求所返回的file_list：res_file_list
    const res_file_list = res.file_list

    // 最终返回给前端的结果： Array<object>
    //  object中的属性：
    //     _id 来自数据库查询结果db_list
    //     fileid, download_url 来自云存储下载POST请求所返回的file_list
    const data = []
    for (let i = 0, len = res_file_list.length; i < len; i++) {
      const item = {
        _id: JSON.parse(db_list[i])._id,
        fileid: res_file_list[i].fileid,
        download_url: res_file_list[i].download_url
      }
      data.push(item)
    }
    return data
  } else {
    return 'error'
  }
}


/* 
  post '/swiper/upload'请求所对应的处理函数 
*/
const uploadHandle = async (file) => {
  // 上传路径 
  const path = `swiper/${Date.now()}_${file.name}`
  // 待上传云存储文件的二进制内容
  const content = fs.createReadStream(file.path)

  const fileid = await upload_file(path, content)

  const query = `
      db.collection('swiper').add({
        data: {
          fileid: '${fileid}',
          createTime: db.serverDate()
        }
      })`
  return await databaseAdd(query)
}



/* 
  post '/swiper/delete'请求所对应的处理函数
*/
const deleteHandle = async (list) => {
  const fileid_list = []
  for (let i = 0, len = list.length; i < len; i++) {
    const query = `db.collection('swiper').doc('${list[i]._id}').remove()`
    await databaseDelete(query)
    fileid_list.push(list[i].fileid)
  }
  return await delete_file(fileid_list)
}

module.exports = {
  listHandle,
  uploadHandle,
  deleteHandle
}
