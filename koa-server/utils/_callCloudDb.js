const rp = require('request-promise')
const _getToken = require('./_getToken')
const { ENV } = require('../config')

/**
 * @param {string} fnName databasequery || databaseadd || databaseupdate || databasedelete
 * @param {string} query 数据库操作语句
 */
const _callCloudDb = async (fnName, query) => {
  const access_token = await _getToken()
  const url = `https://api.weixin.qq.com/tcb/${fnName}?access_token=${access_token}`
  const option = {
    method: 'POST',
    uri: url,
    body: {
      env: ENV,
      query
    },
    json: true
  }
  return await rp(option)
}

const databaseAdd = async (query) => {
  return await _callCloudDb('databaseadd', query)
}

const databaseDelete = async (query) => {
  return await _callCloudDb('databasedelete', query)
}

const databaseQuery = async (query) => {
  return await _callCloudDb('databasequery', query)
}

const databaseUpdate = async (query) => {
  return await _callCloudDb('databaseupdate', query)
}

module.exports = {
  databaseAdd,
  databaseDelete,
  databaseQuery,
  databaseUpdate
}