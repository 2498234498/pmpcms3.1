import select from '../select'
import { parseTime } from '@/utils'
const nationalStandard = {
  data (vm) {
    return {
      tableData05: [
        { name: '超时时间与重发次数', result: '', btnList: vm.btnList('set', 'Exceed05') },
        { name: '超限报警时间间隔', result: '', btnList: vm.btnList('set', 'Alarm05') },
        { name: '现场机系统时间', result: '', btnList: vm.btnList(['set', 'draw'], 'Site05') },
        { name: '污染物报警上下限', result: '', btnList: vm.btnList(['set', 'draw'], 'UpDownLimit05') },
        { name: '平台IP地址', result: '', btnList: vm.btnList(['set', 'draw'], 'PlatformIP05') },
        { name: '数据上报时间', result: '', btnList: vm.btnList(['set', 'draw'], 'DataReport05') },
        { name: '实时数据间隔', result: '', btnList: vm.btnList(['set', 'draw'], 'RealInterval05') },
        { name: '访问密码', result: '', btnList: vm.btnList('set', 'AccessPass05') },
        { name: '污染物实时数据', result: '', btnList: vm.btnList(['draw', 'stop'], 'RealTimePoll05') },
        { name: '设备运行状态数据', result: '', btnList: vm.btnList(['draw', 'stop'], 'EquipmentStatus05') },
        { name: '污染物历史数据', result: '', btnList: vm.btnList('draw', 'PollHisData05') }, // 日、分钟、小时
        { name: '设备运行时间日历史数据', result: '', btnList: vm.btnList('draw', 'EquipmentHisData05') },
        { name: '校零校满(仪表)', result: '', btnList: vm.btnList('set', 'TestFull05') },
        { name: '即时采样(仪表)', result: '', btnList: vm.btnList('set', 'InstantSamp05') },
        { name: '比对采样(仪表)', result: '', btnList: vm.btnList('set', 'ContrastSamp05') }
      ]
    }
  },
  methods: {
    // 设置-超时时间与重发次数，is:false:打开dialog，is:true:提交接口
    setExceed05 (is) {
      if (!is) {
        this.defForm(1000)
        let form = this.form
        form.inputs = [...form.inputs,
          { label: '超时时间', type: 'select', value: 'overTim', select: select.timeOut },
          { label: '重发次数', type: 'select', value: 'reCount', select: select.resend }
        ]
        form.values = {
          ...form.values,
          overTim: 1,
          reCount: 0
        }
        form.rules = {
          ...form.rules,
          overTim: { required: true, message: '请选择超时时间', trigger: 'change' },
          reCount: { required: true, message: '请选择重发次数', trigger: 'change' }
        }
      } else {
        let params = {...this.form.values}
        this.processResult(params)
      }
    },
    // 设置-超限报警时间间隔
    setAlarm05 (is) {
      if (!is) {
        this.defForm(1001)
        let form = this.form
        form.inputs = [...form.inputs,
          { label: '时间间隔', type: 'select', value: 'interval', select: select.reportingInterval }
        ]
        form.values = {
          ...form.values,
          interval: 30
        }
        form.rules = {
          ...form.rules,
          interval: { required: true, message: '请选择时间间隔', trigger: 'change' }
        }
      } else {
        let params = {...this.form.values}
        this.processResult(params)
      }
    },
    // 设置-现场机系统时间
    setSite05 (is) {
      if (!is) {
        this.defForm(1012)
        let form = this.form
        form.inputs = [...form.inputs,
          { label: '时间', type: 'dateTime', value: 'time' }
        ]
        form.values = {
          ...form.values,
          time: ''
        }
        form.rules = {
          ...form.rules,
          time: { required: true, message: '请选择时间', trigger: 'change' }
        }
      } else {
        let params = {...this.form.values}
        params.time = parseTime(params.time).replace(/\D/g, '')
        this.processResult(params)
      }
    },
    // 提取-现场机系统时间
    drawSite05 (is) {
      this.defForm(1011, false)
      this.only.fn = (data) => {
        try {
          if (data.reverseControlState === '1') {
            return `，现场机系统时间：${this.transformTime(data.SystemTime)}`
          }
        } catch (error) {}
        return ''
      }
      let params = {...this.form.values}
      this.processResult(params)
    },
    // 设置-污染物报警上下限
    setUpDownLimit05 (is) {
      if (!is) {
        this.defForm(1022)
        let form = this.form
        form.inputs = [...form.inputs,
          { label: '污染物编码', type: 'select', value: 'polId', select: this.contaminantSelectNot },
          { label: '上限值', type: 'input', value: 'upValue' },
          { label: '下限值', type: 'input', value: 'lowValue' }
        ]
        form.values = {
          ...form.values,
          polId: '',
          upValue: '',
          lowValue: ''
        }
        form.rules = {
          ...form.rules,
          polId: { required: true, message: '请选择污染物编码', trigger: 'change' },
          upValue: [
            { required: false, message: '请输入上限值', trigger: 'blur' },
            { pattern: /^(-|\+)?\d+(\.\d{1,2})?$/, message: '请输入符合正数、小数、负数、最多两位小数的规则', trigger: 'blur' },
            { validator: this.upValidate, trigger: 'blur' }
          ],
          lowValue: [
            { required: false, message: '请输入下限值', trigger: 'blur' },
            { pattern: /^(-|\+)?\d+(\.\d{1,2})?$/, message: '请输入符合正数、小数、负数、最多两位小数的规则', trigger: 'blur' },
            { validator: this.lowValidate, trigger: 'blur' }
          ]
        }
      } else {
        let params = {...this.form.values}
        this.processResult(params)
      }
    },
    // 提取-污染物报警上下限
    drawUpDownLimit05 (is) {
      if (!is) {
        this.defForm(1021)
        let form = this.form
        form.inputs = [...form.inputs,
          { label: '污染物编码', type: 'select', value: 'polId', select: this.contaminantSelectNot }
        ]
        form.values = {
          ...form.values,
          polId: ''
        }
        form.rules = {
          ...form.rules,
          polId: { required: true, message: '请选择污染物编码', trigger: 'change' }
        }
        this.only.fn = (data) => {
          try {
            if (data.reverseControlState === '1') {
              return `，上限值：${this.getObjectText(data, '-UpValu')}，下限值：${this.getObjectText(data, '-LowValu')}`
            }
          } catch (error) {}
          return ''
        }
      } else {
        let params = {...this.form.values}
        this.processResult(params)
      }
    },
    // 设置-平台IP地址
    setPlatformIP05 (is) {
      if (!is) {
        this.defForm(1032)
        let form = this.form
        form.inputs = [...form.inputs,
          { label: 'IPv4地址', type: 'input', value: 'serverIp' }
        ]
        form.values = {
          ...form.values,
          serverIp: ''
        }
        form.rules = {
          ...form.rules,
          serverIp: [
            { required: true, message: '请输入IPv4地址', trigger: 'blur' },
            { pattern: /^(?!\.)((^|\.)([1-9]?\d|1\d\d|2(5[0-5]|[0-4]\d))){4}$/gm, message: '请输入正确IPv4地址', trigger: 'blur' }
          ]
        }
      } else {
        let params = {...this.form.values}
        this.processResult(params)
      }
    },
    // 提取-平台IP地址
    drawPlatformIP05 (is) {
      this.defForm(1031, false)
      this.only.fn = (data) => {
        try {
          if (data.reverseControlState === '1') {
            return `，IP地址：${data.AlarmTarget}`
          }
        } catch (error) {}
        return ''
      }
      let params = {...this.form.values}
      this.processResult(params)
    },
    // 设置-数据上报时间
    setDataReport05 (is) {
      if (!is) {
        this.defForm(1042)
        let form = this.form
        form.inputs = [...form.inputs,
          { label: '上报时间', type: 'select', value: 'time', select: select.dataTimeSelect }
        ]
        form.values = {
          ...form.values,
          time: ''
        }
        form.rules = {
          ...form.rules,
          time: { required: true, message: '请选择上报时间', trigger: 'change' }
        }
      } else {
        let params = {...this.form.values}
        this.processResult(params)
      }
    },
    // 提取-数据上报时间
    drawDataReport05 (is) {
      this.defForm(1041, false)
      this.only.fn = (data) => {
        try {
          if (data.reverseControlState === '1') {
            let get = this.getCusText
            let { ReportTime: time } = data
            return `，上报时间：${get(time, 0, 2)}:${get(time, 2, 4)}`
          }
        } catch (error) {}
        return ''
      }
      let params = {...this.form.values}
      this.processResult(params)
    },
    // 设置-实时数据间隔
    setRealInterval05 (is) {
      if (!is) {
        this.defForm(1062)
        let form = this.form
        form.inputs = [...form.inputs,
          { label: '数据间隔', type: 'select', value: 'interval', select: select.reportingInterval }
        ]
        form.values = {
          ...form.values,
          interval: 30
        }
        form.rules = {
          ...form.rules,
          interval: { required: true, message: '请选择数据间隔', trigger: 'change' }
        }
      } else {
        let params = {...this.form.values}
        this.processResult(params)
      }
    },
    // 提取-实时数据间隔
    drawRealInterval05 (is) {
      this.defForm(1061, false)
      this.only.fn = (data) => {
        try {
          if (data.reverseControlState === '1') {
            return `，间隔时间：${select.reportingInterval.find(e => e.value === Number(data.RtdInterval)).label}`
          }
        } catch (error) {}
        return ''
      }
      let params = {...this.form.values}
      this.processResult(params)
    },
    // 设置-访问密码
    setAccessPass05 (is) {
      if (!is) {
        this.defForm(1072)
        let form = this.form
        form.inputs = [...form.inputs,
          { label: '访问密码', type: 'input', types: 'password', value: 'password' }
        ]
        form.values = {
          ...form.values,
          password: ''
        }
        form.rules = {
          ...form.rules,
          password: [
            { required: true, message: '请输入访问密码', trigger: 'blur' },
            { pattern: /^[0-9a-zA-z]{1,9}$/, message: '请输入1-9位数字或字母的密码', trigger: 'blur' }
          ]
        }
      } else {
        let params = {...this.form.values}
        this.processResult(params)
      }
    },
    // 提取-污染物实时数据
    drawRealTimePoll05 (is) {
      this.defForm(2011, false)
      let params = {...this.form.values}
      this.processResult(params)
    },
    // 停止-污染物实时数据
    stopRealTimePoll05 (is) {
      this.defForm(2012, false)
      let params = {...this.form.values}
      this.processResult(params)
    },
    // 提取-设备运行状态数据
    drawEquipmentStatus05 (is) {
      this.defForm(2021, false)
      let params = {...this.form.values}
      this.processResult(params)
    },
    // 停止-设备运行状态数据
    stopEquipmentStatus05 (is) {
      this.defForm(2022, false)
      let params = {...this.form.values}
      this.processResult(params)
    },
    // 提取-污染物历史数据 :: 日、分钟、小时
    drawPollHisData05 (is) {
      if (!is) {
        this.defForm()
        let form = this.form
        form.inputs = [...form.inputs,
          { label: '数据类型', type: 'select', value: 'command', select: select.dataType },
          { label: '开始时间', type: 'dateTime', value: 'beginTime', select: select.dataType },
          { label: '结束时间', type: 'dateTime', value: 'endTime', select: select.dataType }
        ]
        form.values = {
          ...form.values,
          command: 2051,
          beginTime: '',
          endTime: ''
        }
        form.rules = {
          ...form.rules,
          command: { required: true, message: '请选择数据类型', trigger: 'change' },
          beginTime: { validator: this.beginTimeValidate, trigger: 'change' },
          endTime: [
            { required: true, message: '请选择结束时间', trigger: 'change' },
            { validator: this.endTimeValidate, trigger: 'change' }
          ]
        }
      } else {
        let params = {...this.form.values}
        params.beginTime = parseTime(params.beginTime).replace(/\D/g, '')
        params.endTime = parseTime(params.endTime).replace(/\D/g, '')
        this.processResult(params)
      }
    },
    // 提取-设备运行时间日历史数据
    drawEquipmentHisData05 (is) {
      if (!is) {
        this.defForm(2041)
        let form = this.form
        form.inputs = [...form.inputs,
          { label: '开始时间', type: 'dateTime', value: 'beginTime' },
          { label: '结束时间', type: 'dateTime', value: 'endTime' }
        ]
        form.values = {
          ...form.values,
          beginTime: '',
          endTime: ''
        }
        form.rules = {
          ...form.rules,
          beginTime: { validator: this.beginTimeValidate, trigger: 'change' },
          endTime: [
            { required: true, message: '请选择结束时间', trigger: 'change' },
            { validator: this.endTimeValidate, trigger: 'change' }
          ]
        }
      } else {
        let params = {...this.form.values}
        params.beginTime = parseTime(params.beginTime).replace(/\D/g, '')
        params.endTime = parseTime(params.endTime).replace(/\D/g, '')
        this.processResult(params)
      }
    },
    // 设置-校零校满(仪表)
    setTestFull05 (is) {
      if (!is) {
        this.defForm(3011)
        let form = this.form
        form.inputs = [...form.inputs,
          { label: '污染物编码', type: 'select', value: 'pollCode', select: this.contaminantSelectNot }
        ]
        form.values = {
          ...form.values,
          pollCode: ''
        }
        form.rules = {
          ...form.rules,
          pollCode: { required: true, message: '请选择污染物编码', trigger: 'change' }
        }
      } else {
        let params = {...this.form.values}
        this.processResult(params)
      }
    },
    // 设置-即时采样(仪表)
    setInstantSamp05 (is) {
      if (!is) {
        this.defForm(3012)
        let form = this.form
        form.inputs = [...form.inputs,
          { label: '污染物编码', type: 'select', value: 'pollCode', select: this.contaminantSelectNot }
        ]
        form.values = {
          ...form.values,
          pollCode: ''
        }
        form.rules = {
          ...form.rules,
          pollCode: { required: true, message: '请选择污染物编码', trigger: 'change' }
        }
      } else {
        let params = {...this.form.values}
        this.processResult(params)
      }
    },
    // 设置-比对采样(仪表)
    setContrastSamp05 (is) {
      if (!is) {
        this.defForm(3014)
        let form = this.form
        form.inputs = [...form.inputs,
          { label: '污染物编码', type: 'select', value: 'pollCode', select: this.contaminantSelectNot },
          { label: '时间', type: 'time', value: 'time', format: 'HH' }
        ]
        form.values = {
          ...form.values,
          pollCode: '',
          time: ''
        }
        form.rules = {
          ...form.rules,
          pollCode: { required: true, message: '请选择污染物编码', trigger: 'change' },
          time: { required: true, message: '请选择时间', trigger: 'change' }
        }
      } else {
        let params = {...this.form.values}
        this.processResult(params)
      }
    }
  }
}

export default nationalStandard
