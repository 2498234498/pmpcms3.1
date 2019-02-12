import { Message } from 'element-ui'

// 开启关闭按钮
const showClose = true

const isObject = (val) => val != null && typeof val === 'object' && Array.isArray(val) === false

const msg = (arg) => {
  if (!isObject(arg)) {
    arg = { message: arg }
  }
  Message(Object.assign({}, { showClose }, arg))
}

Object.assign(msg, Message)

msg.success = (arg) => {
  Message({ message: arg, type: 'success', showClose })
}

msg.warning = (arg) => {
  Message({ message: arg, type: 'warning', showClose })
}

msg.info = (arg) => {
  Message({ message: arg, type: 'info', showClose })
}

msg.error = (arg) => {
  Message({ message: arg, type: 'error', showClose })
}
// msg.closeAll = () => {
//   Message.closeAll()
// }

export default msg
