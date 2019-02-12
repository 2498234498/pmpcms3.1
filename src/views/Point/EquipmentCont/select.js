export default {
  timeOut: Object.freeze([
    { label: '1秒', value: 1 },
    { label: '2秒', value: 2 },
    { label: '3秒', value: 3 },
    { label: '5秒', value: 5 },
    { label: '10秒', value: 10 }
  ]),

  resend: Object.freeze([
    { label: '不重发', value: 0 },
    { label: '1次', value: 1 },
    { label: '2次', value: 2 },
    { label: '3次', value: 3 },
    { label: '5次', value: 5 }
  ]),

  timeInterval: Object.freeze([
    { label: '30秒', value: 30 },
    { label: '1分钟', value: 60 },
    { label: '2分钟', value: 120 },
    { label: '3分钟', value: 180 },
    { label: '4分钟', value: 240 },
    { label: '5分钟', value: 300 },
    { label: '10分钟', value: 600 },
    { label: '15分钟', value: 900 },
    { label: '20分钟', value: 1200 },
    { label: '30分钟', value: 1800 }
  ]),

  reportingInterval: Object.freeze([
    { label: '30秒', value: 30 },
    { label: '1分钟', value: 60 },
    { label: '2分钟', value: 120 },
    { label: '3分钟', value: 180 },
    { label: '4分钟', value: 240 },
    { label: '5分钟', value: 300 },
    { label: '10分钟', value: 600 }
  ]),

  dataType: Object.freeze([
    { label: '分钟数据', value: 2051 },
    { label: '小时数据', value: 2061 },
    { label: '日数据', value: 2031 }
  ]),

  minuteInterval: Object.freeze([
    { label: '1分钟', value: 1 },
    { label: '2分钟', value: 2 },
    { label: '3分钟', value: 3 },
    { label: '4分钟', value: 4 },
    { label: '5分钟', value: 5 },
    { label: '10分钟', value: 10 }
  ]),

  typeSelect: Object.freeze([
    // { label: '提取现场机信息（日志）', value: 0 },
    { label: '提取现场机信息（状态）', value: 1 },
    { label: '提取现场机信息（参数）', value: 2 }
  ]),

  dataTimeSelect: Object.freeze([
    { label: '00:00', value: '0000' },
    { label: '01:01', value: '0101' },
    { label: '00:01', value: '0001' },
    { label: '01:00', value: '0100' }
  ])
}
