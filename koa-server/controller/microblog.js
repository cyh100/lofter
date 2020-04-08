const { databaseQuery, databaseDelete } = require('../utils/_callCloudDb')
const { get_downloadUrl, delete_file } = require('../utils/_callCloudStorage')


// 查询microblog表中记录数量
const countHandle = async () => {
  const query = `db.collection('microblog').count()`
  return await databaseQuery(query)
}


/* 
  get '/microblog/list'请求所对应的处理函数
*/
const listHandle = async (req_query) => {
  let { start = 0, count = 10 } = req_query
  start = parseInt(start)
  count = parseInt(count)

  // 查询microblog表得到相应记录组成的数组: db_list
  const query = `db.collection('microblog')
                  .skip(${start}).limit(${count})
                  .orderBy('createTime', 'desc')
                  .get()`
  const db_res = await databaseQuery(query)
  const db_list = db_res.data
  // console.log('db_list: ', db_list)

  // microblog表中每条记录包含的fileIdsUrl字段，
  // 由微博中的每张图片对应的云存储fileid组成，为数组结构
  // 由fileid组成的fileIdsUrl => 由download_url组成的download_urls
  // 最后把转换后每条微博对应的_id,content,download_urls添加到tasks中
  const tasks = []
  for (let i = 0, len = db_list.length; i < len; i++) {
    const { _id, content, fileIdsUrl } = JSON.parse(db_list[i])

    const req_file_list = fileIdsUrl.map(item => {
      return { fileid: item, max_age: 3600 }
    })
    const res = await get_downloadUrl(req_file_list)
    const temp = res.file_list
    const download_urls = temp.map(item => item.download_url)

    const item = {
      _id,
      content,
      download_urls
    }
    tasks.push(item)
  }
  return tasks
}


const deleteHandle = async (_id) => {
  // 先删除云存储中的图片
  const query1 = `db.collection('microblog').doc('${_id}').get()`
  const queryRes = await databaseQuery(query1)
  const fileIdsUrl = JSON.parse(queryRes.data[0]).fileIdsUrl
  const deleteRes = await delete_file(fileIdsUrl)

  // 再删除博客记录
  const query2 = `db.collection('microblog').doc('${_id}').remove()`
  const removeRes = await databaseDelete(query2)

  // 最后返回图片和记录的删除结果
  return { deleteRes, removeRes }
}

module.exports = {
  countHandle,
  listHandle,
  deleteHandle
}