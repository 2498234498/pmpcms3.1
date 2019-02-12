const validate = {
  methods: {
    // 验证开始时间不能小于结束时间
    beginTimeValidate (rule, value, cb) {
      let end = this.form.values.endTime
      if (value === '') {
        cb(new Error('请选择开始时间'))
      } else {
        if (end) {
          this.cusForm().validateField('endTime')
        }
        cb()
      }
    },
    // 验证开始时间不能小于结束时间
    beginTimeValidateOne (rule, value, cb) {
      let end = this.form.values.endTime
      if (end) {
        this.cusForm().validateField('endTime')
      }
      cb()
    },
    // 验证结束时间不能小于开始时间
    endTimeValidate (rule, value, cb) {
      let begin = this.form.values.beginTime
      value = value ? value.getTime() : 0
      if (begin && value < begin.getTime()) {
        cb(new Error('结束时间不能小于开始时间'))
      } else {
        cb()
      }
    },
    // 上限值
    upValidate (rule, value, cb) {
      let low = this.form.values.lowValue
      if (Number(value) > 10000000 || Number(value) < -10000000) {
        cb(new Error('必须是小于10000000和大于-10000000'))
      } else {
        if (low) {
          this.cusForm().validateField('lowValue')
        }
        cb()
      }
    },
    // 下限值
    lowValidate (rule, value, cb) {
      let up = this.form.values.upValue
      if (Number(value) > 10000000 || Number(value) < -10000000) {
        cb(new Error('必须是小于10000000和大于-10000000'))
      } else if (up !== '' && Number(value) > Number(up)) {
        cb(new Error('下限值不能大于上限值'))
      } else {
        cb()
      }
    },
    // 转换时间格式
    transformTime (date) {
      let get = this.getCusText
      return `${get(date, 0, 4)}-${get(date, 4, 6)}-${get(date, 6, 8)} ${get(date, 8, 10)}:${get(date, 10, 12)}:${get(date, 12, 14)}`
    },
    getCusText (text, start, end) {
      let data = ''
      for (let i = start; i < end; i++) {
        data += text[i]
      }
      return data
    },
    // 获取对象中模糊匹配key的vaalue
    getObjectText (obj, keys) {
      let str = ''
      try {
        for (const [key, value] of Object.entries(obj)) {
          if (key.indexOf(keys) >= 0) {
            str += value + ','
          }
        }
        str = str.length ? str.substr(0, str.length - 1) : ''
        return str
      } catch (error) {
        return ''
      }
    }
  }
}

export default validate
