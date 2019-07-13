import { Notification } from 'element-ui'
import { MessageBox } from 'element-ui'

const message = {
  showWarning: (message,callback) => {//message->string
    Notification({
      title: '警告',
      message: message,
      type: 'warning',
      duration: 2000,
      onClose: () => {
        if (typeof callback === "function")
          callback();
      }
    })
  },
  showError: (type, message, callback) => { // type->int(1:notify 2:alert) message->string
    switch (type) {
      case 1:
        Notification({
          title: '失败',
          message: message,
          type: 'error',
          duration: 2000,
          onClose: () => {
            if (typeof callback === "function")
              callback();
          }
        })
        break
      case 2:
        MessageBox.alert(message, {
          title: '失败',
          type: 'error',
          close: () => {
            if (typeof callback === "function")
              callback();
          }
        })
        break
    }
  },
  showSuccess: (message,callback) => {
    Notification({
      title: '成功',
      message: message,
      type: 'success',
      duration: 2000,
      onClose: () => {
        if (typeof callback === "function")
          callback();
      }
    })
  },
  showInfo: (title,message,callback) => {
    MessageBox.alert(message, {
      title: title,
      customClass: 'my-message',
      close: () => {
        if (typeof callback === "function")
          callback();
      }
    })
  },
}
export default message
