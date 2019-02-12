const codeData = {
  state: {
    // 编码类型
    protocolType: Object.freeze([
      { label: '全部', value: '' },
      { label: '05国标', value: '05' },
      { label: '17国标', value: '17' },
      { label: '自定义', value: '00' }
    ]),
    // 监控点类型
    st: Object.freeze([
      { label: '全部', value: '' },
      { label: '水类', value: '32' },
      { label: '气类', value: '31' }
    ]),
    stArr: Object.freeze([
      { label: '水类', value: '32' },
      { label: '气类', value: '31' }
    ]),
    // 编码转义
    code: Object.freeze({
      '05': '05国标',
      '17': '17国标',
      '00': '自定义',
      '31': '气类',
      '32': '水类',
      '1': '国控',
      '2': '省控',
      '3': '市控',
      '4': '区控'
    }),
    // 监控点类型
    monitorType: Object.freeze([
      { label: '全部', value: '' },
      { label: '国控', value: '1' },
      { label: '省控', value: '2' },
      { label: '市控', value: '3' },
      { label: '区控', value: '4' }
    ]),
    // 协议
    reportType: Object.freeze([
      { label: '2005协议', value: '05' },
      { label: '2017协议', value: '17' }
    ])
  }
}

export default codeData
