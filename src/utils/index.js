/**
 * Created by jiachenpan on 16/11/18.
 */
export function parseTime (time = new Date().getTime(), cFormat = '{y}-{m}-{d} {h}:{i}:{s}') {
  const format = cFormat
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (('' + time).length === 10) time = parseInt(time) * 1000
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const timeSrt = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1]
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return timeSrt
}

export function formatTime (time, option) {
  time = +time * 1000
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) { // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return d.getMonth() + 1 + '月' + d.getDate() + '日' + d.getHours() + '时' + d.getMinutes() + '分'
  }
}

/**
 * 获得指定的年月有多少天
 * @param {Number, String} y - 年
 * @param {Number，String} m - 月
 */
export function getCountDays (y, m) {
  let date = new Date()
  date.setYear(y)
  date.setMonth(m)
  date.setDate(0)
  return date.getDate()
}

/**
 * 获取时间，带格式
 * @param {Object} params
 * @param {Number} params.timestamp - 时间戳，可传/不穿，默认为当前时间
 * @param {String} params.format - 获取的时间格式，注意中间以空格切分“日期”和“时间”
 *                               - yyyy-MM-dd HH:mm:ss
 *                               - yyyy-MM-dd
 *                               - ...自定义
 */
export function getDate ({
  timestamp = null,
  format = 'yyyy-MM-dd HH:mm:ss'
} = {}) {
  const addZero = (num, len = 2) => (`0${num}`).slice(-len)
  try {
    let formatDate = ''
    let date = timestamp ? new Date(timestamp) : new Date()
    let objData = {}
    objData.yyyy = date.getFullYear()
    objData.MM = addZero(date.getMonth() + 1)
    objData.dd = addZero(date.getDate())
    objData.HH = addZero(date.getHours())
    objData.mm = addZero(date.getMinutes())
    objData.ss = addZero(date.getSeconds())

    format.split(' ').forEach(time => {
      formatDate = formatDate.length ? formatDate + ' ' : formatDate
      // 匹配非英文字母
      let other = time.match(/[^A-Za-z]+/g)
      // 匹配非其他字符
      time.match(/[A-Za-z]+/g).forEach((str, key) => {
        formatDate += `${objData[str]}${other[key] || ''}`
      })
    })
    return formatDate
  } catch (e) {
    console.log(e)
  }
}

/**
 * 下载文件
 * @param {Blod} blod - 文件流
 * @param {String} name - 文件名
 */
export function downFile (blod, name) {
  const blob = new Blob([blod])
  const fileName = name
  const elink = document.createElement('a')
  elink.download = fileName
  // elink.style.display = 'none'
  elink.href = URL.createObjectURL(blob)
  document.body.appendChild(elink)
  elink.click()
  URL.revokeObjectURL(elink.href) // 释放URL 对象
  document.body.removeChild(elink)
}

/**
 * 计算当前的序号
 * @param {Number} curPage - 当前页数
 * @param {Number} pageSize - 每页多少条
 * @param {Number} key - 循环的key
 */
export function comSerial (curPage, pageSize, key) {
  try {
    return (curPage - 1) * pageSize + (key + 1)
  } catch (error) {
    return curPage
  }
}

/**
 * 扁平化树形ID，找出属于该ID的一组数据
 * @param {Array} array - 操作的数组
 * @param {String} id - 想筛选出某级ID
 * @param {Boolean} act - 第一次递归标识符，不用传
 * @param {Array} reArr - 最后筛选出来的值，不用传
 */
export function flatChildrenId (array, id, key = 'id', act = true, reArr = [], find = false) {
  for (let i = 0; i < array.length; i++) {
    // 递归先把树形分类扁平化
    const e = array[i]
    if (e.id === id) {
      find = true
      reArr.push(e[key])
      break
    }
    if (Array.isArray(e.children)) {
      let rc = flatChildrenId(e.children, id, key, false, reArr, find)
      find = rc.find
      reArr = rc.reArr
      if (find) {
        reArr.unshift(e[key])
        break
      }
    }
  }
  // 最终筛选出符合条件的一组
  if (act) return reArr.length ? reArr : [id]
  return {
    find,
    reArr
  }
}

/**
 * 删除空的children
 * @param {Array} array - 要操作的数组
 */
export function deleteChildren (array) {
  if (Array.isArray(array)) {
    for (let i = 0; i < array.length; i++) {
      const e = array[i]
      if (Array.isArray(e.children)) {
        if (e.children.length <= 0) {
          delete e.children
        } else {
          e.children = deleteChildren(e.children)
        }
      }
    }
  }
  return array
}

/**
 * 获取当前指定的前几天的日期
 * @param {Number} n - 天数
 * @param {String} time - 时间
 * @param {Boolean} after - false是之前,true是之后
 */
export function getBeforeDate (n = 0, time = null, after = false) {
  let d = time ? new Date(time) : new Date()
  let year = d.getFullYear()
  let mon = d.getMonth() + 1
  let day = d.getDate()
  if (day <= n) {
    if (mon > 1) {
      mon = mon - 1
    } else {
      year = year - 1
      mon = 12
    }
  }
  after ? d.setDate(d.getDate() + n) : d.setDate(d.getDate() - n)
  year = d.getFullYear()
  mon = d.getMonth() + 1
  day = d.getDate()
  let s = year + '-' + (mon < 10 ? ('0' + mon) : mon) + '-' + (day < 10 ? ('0' + day) : day)
  return s
}

/**
 * 获取当前删除后的页码
 * @param {Number} current - 当前页码
 * @param {Number} size - 每页显示的数量
 * @param {Number} total - 总数量
 */
export function deleteAfterCurrent (current, size, total) {
  if ((total - 1) % size === 0 && current !== 1) {
    return current - 1
  } else {
    return current
  }
}

/**
 * 预估字体的宽度
 * @param {String, Number} str - 字符
 */
export function getFontWidth (str, style = { 'fontWeight': 'bold', 'fontSize': '14px', 'padding': '0 5px', 'display': 'inline-block' }) {
  const $span = document.createElement('span')
  $span.innerText = str
  $span.style = style
  $span.classList.add('rmv')
  document.body.appendChild($span)
  let width = Math.ceil(parseFloat(window.getComputedStyle($span).width))
  document.body.removeChild($span)
  return width
}

/**
 * 设置表头的宽度
 * @param {Array} array - 表头数组
 * @param {Array} notKey - 不参与计算的key
 * @param {Number} minWidth - 最小宽度
 * @param {Number} diverge - 单行偏移值
 * @param {Number} row - 最大行数
 */
export function computedWidth (array = [], notKey = [], minWidth = 110, diverge = 30, row = 2, i = 0) {
  i++
  array.forEach(e => {
    if (!notKey.includes(e.field)) {
      let width = getFontWidth(e.title)
      if (width > minWidth) {
        if (width <= (minWidth + diverge)) {
          e.width = width
        } else if ((width > (minWidth + diverge)) || (width <= (minWidth * row))) {
          e.width = minWidth
        } else if (width > (minWidth * row)) {
          e.width = width / row
        }
      } else {
        e.width = minWidth
      }
    }
    if (Array.isArray(e.children) && e.children.length) {
      computedWidth(e.children, notKey, minWidth, diverge, row, i)
    }
  })
  return array
}

/**
 * 动态表头以"("插入换行符号
 */
export function setTableHeadBr (title) {
  let w = title.indexOf('(')
  if (w > 0) {
    title = title.split('')
    title.splice(w, 0, '<br/>')
    title = title.join('')
  }
  return title
}

/**
 * 动态表头切换平均显示数据筛选，这里不修改源数据
 * @param {Array} table - 表头源数据
 * @param {Array} not - 不参与计算的key
 */
export function tableHeadTab (table, not) {
  return table.map(e => {
    let children = null
    if (!not.includes(e.field) && Array.isArray(e.children) && e.children.length) {
      children = e.children.filter(c => c.title.indexOf('平均值') >= 0)
    }
    return {
      ...e,
      children: children || e.children || [],
      title: setTableHeadBr(e.title)
    }
  })
}

/**
 * 查找树型结构的数据所属id的数据
 * @param {Array} tree - 树型结构
 * @param {String} id
 */
export function findTreeData (tree, id) {
  let obj = null
  for (let i = 0; i < tree.length; i++) {
    const e = tree[i]
    if (String(e.id) === String(id) || obj) {
      obj = obj || e
      break
    } else if (Array.isArray(e.children)) {
      obj = findTreeData(e.children, id)
    }
  }
  return obj
}
