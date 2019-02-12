import select from '../select'
import { parseTime } from '@/utils'
import equipmentCont3020 from 'static/equipmentCont3020'
const nationalStandard = {
  data (vm) {
    return {
      tableData17: [
        { name: '超时时间与重发次数', result: '', btnList: vm.btnList('set', 'Exceed17') },
        { name: '现场机时间', result: '', btnList: vm.btnList(['set', 'draw'], 'Site17') },
        { name: '实时数据间隔', result: '', btnList: vm.btnList(['set', 'draw'], 'RealIval17') },
        { name: '分钟数据间隔', result: '', btnList: vm.btnList(['set', 'draw'], 'MinuteIval17') },
        { name: '访问密码', result: '', btnList: vm.btnList('set', 'AccessPass17') },
        { name: '污染物实时数据', result: '', btnList: vm.btnList(['draw', 'stop'], 'RealTimePoll17') },
        { name: '设备运行状态数据', result: '', btnList: vm.btnList(['draw', 'stop'], 'EquipmentStatus17') },
        { name: '设备运行时间日历史数据', result: '', btnList: vm.btnList('draw', 'EquipmentHisStatus17') },
        { name: '污染物历史数据', result: '', btnList: vm.btnList('draw', 'PollHisData17') }, // 分钟、小时、日
        // { name: '自动上报现场机开关机时间', result: '', btnList: vm.btnList('set', 'SwitchTime17') },
        { name: '校零校满(仪表)', result: '', btnList: vm.btnList('set', 'TestFull17') },
        { name: '即时采样(仪表)', result: '', btnList: vm.btnList('set', 'InstantSamp17') },
        { name: '启动清洗(仪表)', result: '', btnList: vm.btnList('set', 'StartClean17') },
        { name: '比对采样(仪表)', result: '', btnList: vm.btnList('set', 'AlignmentSamp17') },
        { name: '启动超标留样(仪表)', result: '', btnList: vm.btnList('set', 'StartOverSample17') },
        { name: '采样时间周期(仪表)', result: '', btnList: vm.btnList(['set', 'draw'], 'SamplPeriod17') },
        { name: '出样时间(仪表)', result: '', btnList: vm.btnList('draw', 'SampleTime17') },
        { name: '设备唯一标识(仪表)', result: '', btnList: vm.btnList('draw', 'DeviceUni17') },
        { name: '现场机信息(仪表)', result: '', btnList: vm.btnList(['draw'], 'SiteInfo17') }
        // { name: '设备参数(仪表)', result: '', btnList: vm.btnList('draw', 'DeviceParams17') },
        // { name: '数采仪日志(数采仪)', result: '', btnList: vm.btnList('draw', 'DataCollLog17') },
        // { name: '设备状态(仪表)', result: '', btnList: vm.btnList('draw', 'DeviceStatus17') }
      ]
      // info3020: Object.freeze(equipmentCont3020.info)
    }
  },
  created () {
  },
  methods: {
    // 设置-超时时间与重发次数
    setExceed17 (is) {
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
    // 设置-现场机时间
    setSite17 (is) {
      if (!is) {
        this.defForm(1012)
        let form = this.form
        form.inputs = [...form.inputs,
          { label: '污染物编码', type: 'select', value: 'pollCode', select: this.contaminantSelect },
          { label: '时间', type: 'dateTime', value: 'time' }
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
        params.time = parseTime(params.time).replace(/\D/g, '')
        this.processResult(params)
      }
    },
    // 提取-现场机时间
    drawSite17 (is) {
      if (!is) {
        this.defForm(1011)
        let form = this.form
        form.inputs = [...form.inputs,
          { label: '污染物编码', type: 'select', value: 'pollCode', select: this.contaminantSelect }
        ]
        form.values = {
          ...form.values,
          pollCode: ''
        }
        form.rules = {
          ...form.rules,
          pollCode: { required: true, message: '请选择污染物编码', trigger: 'change' }
        }
        this.only.fn = (data) => {
          try {
            if (data.reverseControlState === '1') {
              return `，现场机时间：${this.transformTime(data.SystemTime)}`
            }
          } catch (error) {}
          return ''
        }
      } else {
        let params = {...this.form.values}
        this.processResult(params)
      }
    },
    // 设置-实时数据间隔
    setRealIval17 (is) {
      if (!is) {
        this.defForm(1062)
        let form = this.form
        form.inputs = [...form.inputs,
          { label: '间隔时间', type: 'select', value: 'interval', select: select.reportingInterval }
        ]
        form.values = {
          ...form.values,
          interval: 30
        }
        form.rules = {
          ...form.rules,
          interval: { required: true, message: '请选择间隔时间', trigger: 'change' }
        }
      } else {
        let params = {...this.form.values}
        this.processResult(params)
      }
    },
    // 提取-实时数据间隔
    drawRealIval17 (is) {
      this.defForm(1061, false)
      this.only.fn = (data) => {
        try {
          if (data.reverseControlState === '1') {
            return `，时间间隔：${select.reportingInterval.find(e => e.value === Number(data.RtdInterval)).label}`
          }
        } catch (error) {}
        return ''
      }
      let params = {...this.form.values}
      this.processResult(params)
    },
    // 设置-分钟数据间隔
    setMinuteIval17 (is) {
      if (!is) {
        this.defForm(1064)
        let form = this.form
        form.inputs = [...form.inputs,
          { label: '间隔时间', type: 'select', value: 'time', select: select.minuteInterval }
        ]
        form.values = {
          ...form.values,
          time: 1
        }
        form.rules = {
          ...form.rules,
          time: { required: true, message: '请选择间隔时间', trigger: 'change' }
        }
      } else {
        let params = {...this.form.values}
        this.processResult(params)
      }
    },
    // 提取-分钟数据间隔
    drawMinuteIval17 (is) {
      this.defForm(1063, false)
      this.only.fn = (data) => {
        try {
          if (data.reverseControlState === '1') {
            return `，时间间隔：${data.MinInterval}分钟`
          }
        } catch (error) {}
        return ''
      }
      let params = {...this.form.values}
      this.processResult(params)
    },
    // 设置-访问密码
    setAccessPass17 (is) {
      if (!is) {
        this.defForm(1072)
        let form = this.form
        form.inputs = [...form.inputs,
          { label: '密码', type: 'input', value: 'password', types: 'password' }
        ]
        form.values = {
          ...form.values,
          password: ''
        }
        form.rules = {
          ...form.rules,
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { pattern: /^[0-9a-zA-z]{1,9}$/, message: '请输入1-9位数字或字母的密码', trigger: 'blur' }
          ]
        }
      } else {
        let params = {...this.form.values}
        this.processResult(params)
      }
    },
    // 提取-污染物实时数据
    drawRealTimePoll17 (is) {
      this.defForm(2011, false)
      let params = {...this.form.values}
      this.processResult(params)
    },
    // 停止-污染物实时数据
    stopRealTimePoll17 (is) {
      this.defForm(2012, false)
      let params = {...this.form.values}
      this.processResult(params)
    },
    // 提取-设备运行状态数据
    drawEquipmentStatus17 (is) {
      this.defForm(2021, false)
      let params = {...this.form.values}
      this.processResult(params)
    },
    // 停止-设备运行状态数据
    stopEquipmentStatus17 (is) {
      this.defForm(2022, false)
      let params = {...this.form.values}
      this.processResult(params)
    },
    // 提取-设备运行时间日历史数据
    drawEquipmentHisStatus17 (is) {
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
    // 提取-污染物历史数据 :: 分钟、小时、日
    drawPollHisData17 (is) {
      if (!is) {
        this.defForm()
        let form = this.form
        form.inputs = [...form.inputs,
          { label: '数据类型', type: 'select', value: 'command', select: select.dataType },
          { label: '开始时间', type: 'dateTime', value: 'beginTime' },
          { label: '结束时间', type: 'dateTime', value: 'endTime' }
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
    // 设置-自动上报现场机开关机时间
    setSwitchTime17 (is) {},
    // 设置-校零校满(仪表)
    setTestFull17 (is) {
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
    setInstantSamp17 (is) {
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
    // 设置-启动清洗(仪表)
    setStartClean17 (is) {
      if (!is) {
        this.defForm(3013)
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
    setAlignmentSamp17 (is) {
      if (!is) {
        this.defForm(3014)
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
    // 设置-启动超标留样(仪表)
    setStartOverSample17 (is) {
      this.defForm(3015, false)
      let params = {...this.form.values}
      this.processResult(params)
    },
    // 设置-采样时间周期(仪表)
    setSamplPeriod17 (is) {
      if (!is) {
        this.defForm(3016)
        let form = this.form
        form.inputs = [...form.inputs,
          { label: '污染物编码', type: 'select', value: 'pollCode', select: this.contaminantSelectNot },
          { label: '起始时间', type: 'time', value: 'beginTime' },
          { label: '时间间隔', type: 'input', dataType: 'number', value: 'time', append: '小时' }
        ]
        form.values = {
          ...form.values,
          pollCode: '',
          beginTime: '',
          time: null
        }
        form.rules = {
          ...form.rules,
          pollCode: { required: true, message: '请选择污染物编码', trigger: 'change' },
          beginTime: { required: true, message: '请选择起始时间', trigger: 'change' },
          time: { required: true, message: '请输入时间间隔（正整数）', trigger: 'blur', type: 'number' }
        }
      } else {
        let params = {...this.form.values}
        params.beginTime = parseTime(params.beginTime, '{h}:{i}:{s}').replace(/\D/g, '')
        this.processResult(params)
      }
    },
    // 提取-采样时间周期(仪表)
    drawSamplPeriod17 (is) {
      if (!is) {
        this.defForm(3017)
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
        this.only.fn = (data) => {
          try {
            if (data.reverseControlState === '1') {
              let get = this.getCusText
              let { CstartTime: time } = data
              return `，时间间隔：${get(time, 0, 2)}:${get(time, 2, 4)}:${get(time, 4, 6)}`
            }
          } catch (error) {}
          return ''
        }
      } else {
        let params = {...this.form.values}
        this.processResult(params)
      }
    },
    // 提取-出样时间(仪表)
    drawSampleTime17 (is) {
      if (!is) {
        this.defForm(3018)
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
        this.only.fn = (data) => {
          try {
            if (data.reverseControlState === '1') {
              return `，时间间隔：${data.Stime}分钟`
            }
          } catch (error) {}
          return ''
        }
      } else {
        let params = {...this.form.values}
        this.processResult(params)
      }
    },
    // 提取-设备唯一标识(仪表)
    drawDeviceUni17 (is) {
      if (!is) {
        this.defForm(3019)
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
        this.only.fn = (data) => {
          try {
            if (data.reverseControlState === '1') {
              return `，唯一标识：${this.transformTime(data, '-SN')}`
            }
          } catch (error) {}
          return ''
        }
      } else {
        let params = {...this.form.values}
        this.processResult(params)
      }
    },
    // 设置-现场机信息(仪表)
    setSiteInfo17 (is) {
      if (!is) {
        this.defForm(3021)
        let form = this.form
        form.inputs = [...form.inputs,
          { label: '污染物编码', type: 'select', value: 'pollCode', select: this.contaminantSelectNot },
          { label: '信息因子编码', type: 'select', value: 'infoid', select: this.infoidSelect },
          { label: '参数', type: 'input', value: 'temperature', hidden: true }
        ]
        form.values = {
          ...form.values,
          pollCode: '',
          infoid: '',
          temperature: ''
        }
        form.rules = {
          ...form.rules,
          pollCode: { required: true, message: '请选择污染物编码', trigger: 'change' },
          infoid: { required: true, message: '请选择信息因子编码', trigger: 'change' }
        }
      } else {
        let params = {...this.form.values}
        this.processResult(params)
      }
    },
    // 提取-现场机信息(仪表)
    drawSiteInfo17 (is) {
      if (!is) {
        this.defForm(3020)
        let form = this.form
        form.inputs = [...form.inputs,
          { label: '污染物编码', type: 'select', value: 'pollCode', select: this.contaminantSelectNot },
          { label: '类型', type: 'select', value: 'type', select: select.typeSelect },
          { label: '信息因子编码', type: 'select', value: 'infoid', select: this.infoidSelect, hidden: true }
        ]
        form.values = {
          ...form.values,
          pollCode: '',
          infoid: '',
          type: 1
        }
        form.rules = {
          ...form.rules,
          pollCode: { required: true, message: '请选择污染物编码', trigger: 'change' },
          infoid: { required: true, message: '请选择信息因子编码', trigger: 'change' },
          type: { required: true, message: '请选择类型', trigger: 'change' }
        }
        this.only.fn = (data) => {
          try {
            if (data.reverseControlState === '1') {
              const polName = this.contaminantSelectNot.find(e => e.value === data.PolId)
              const infoKey = Object.keys(data)
                .find(e => e.indexOf('Info') >= 0)
              const info = equipmentCont3020.info.find(e => e.infocode === infoKey.split('-')[0])
              let status = ''
              let text = '，'
              if (info) {
                status = info.extend.find(e => e.value === (data[infoKey] ? Number(data[infoKey]) : '')) || {}
                text += status.status ? `状态：${status.status}` : `值：${data[infoKey]}`
              }
              return `，${polName.label}的信息因子：${info.infoname || ''}${text}`
            }
          } catch (error) {}
          return ''
        }
      } else {
        let params = {...this.form.values}
        this.processResult(params)
      }
    },
    // 提取-设备参数(仪表)
    drawDeviceParams17 (is) {},
    // 提取-数采仪日志(数采仪)
    drawDataCollLog17 (is) {},
    // 提取-设备状态(仪表)
    drawDeviceStatus17 (is) {}
  }
}

export default nationalStandard
