const fs = require('fs')
const path = require('path')
const XLSX = require('xlsx')
const _ = require('lodash')
const { exec } = require('child_process')

const sheetTitle = '房屋基本情况'

run()

function run(startTime = '2022.9.1', endTime = '2022.9.30') {
  const dirList = fs.readdirSync(path.resolve(__dirname, './files'))
  dirList.forEach((fileName) => {
    const filePath = path.resolve(__dirname, `./files/${fileName}`)
    const workBook = XLSX.read(filePath, { type: 'file' })
    const stime = new Date(startTime).getTime()
    const etime = new Date(endTime).getTime()
    const chunkList = workBook.SheetNames.slice(0, 6).map((sheetName) => {
      const list = XLSX.utils.sheet_to_json(workBook.Sheets[sheetName])
      return parseInfo(list, {
        startTime: stime,
        endTime: etime,
      })
    })
    const flatList = _.flatten(chunkList)
    console.log('读取完成，开始写入...')
    console.table(flatList)
    exec('rm -rf results/*')
    writeToSheet({
      fileName: `结果${startTime}-${endTime}`,
      header: ['地址', '收支信息', '收支金额', '日期'],
      list: flatList.map((v) => ({
        地址: v.address,
        收支信息: v.person,
        收支金额: v.money,
        日期: v.date,
      })),
    })
    console.log('写入完成')
  })
}

function writeToSheet({ fileName, header = [], list = [] }) {
  const wb = XLSX.utils.book_new()
  const ws = XLSX.utils.json_to_sheet(list, {
    header: header,
  })
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')
  XLSX.writeFile(wb, path.resolve(__dirname, `./results/${fileName}.xlsx`))
}

function parseInfo(list = [], { startTime = 0, endTime = 0 } = {}) {
  const address = list[0]['__EMPTY']
  const userInfoList = list.filter(
    (v) =>
      typeof v[sheetTitle] === 'string' && v[sheetTitle].includes('租金支付')
  )
  let resList = []
  _.chunk(userInfoList, 2).forEach(([dataItem, payItem]) => {
    const [person] = dataItem[sheetTitle].split('-')
    const list = _.keys(dataItem)
      .filter((key) => {
        const d = dataItem[key] || ''
        if (['22', '23', '24', '25'].includes(d.split('.')[0])) {
          dataItem[key] = `20${d}`
        }
        const dateVal = new Date(dataItem[key]).getTime()
        if (dateVal === NaN) {
          return false
        }
        return dateVal >= startTime && dateVal <= endTime
      })
      .reduce((sum, cur) => {
        sum.push({
          address,
          person,
          date: dataItem[cur],
          money: payItem[cur],
        })
        return sum
      }, [])
    resList = resList.concat(list)
  })
  console.table(resList)
  return resList
}
