const nationalStandard = {
  data (vm) {
    return {
      tableDataBcn: [
        { name: '基本参数', result: '', btnList: vm.btnList(['set', 'draw'], 'BasicParamsBcn') },
        { name: '串口参数', result: '', btnList: vm.btnList(['set', 'draw'], 'SerialPortParamsBcn') },
        { name: '模拟量参数', result: '', btnList: vm.btnList(['set', 'draw'], 'AnalogParamsBcn') },
        { name: '服务器参数', result: '', btnList: vm.btnList(['set', 'draw'], 'ServerParamsBcn') },
        { name: '本地网络参数', result: '', btnList: vm.btnList(['set', 'draw'], 'LocalParamsBcn') },
        { name: '用户参数', result: '', btnList: vm.btnList(['draw', 'add', 'deleteUp'], 'UserParamsBcn') },
        { name: '本机信息', result: '', btnList: vm.btnList('draw', 'NativeInfoBcn') },
        { name: '程序版本信息', result: '', btnList: vm.btnList('draw', 'VerInfoBcn') },
        { name: '智能监控', result: '', btnList: vm.btnList(['draw', 'add', 'deleteUp'], 'IntellMonitorBcn') },
        { name: 'DO电平', result: '', btnList: vm.btnList(['set', 'draw'], 'LevelBcn') },
        { name: '升级参数', result: '', btnList: vm.btnList(['set', 'draw'], 'UpgradeParamsBcn') },
        { name: '阀门控制标志', result: '', btnList: vm.btnList('set', 'ValveSignBcn') },
        { name: '阀门状态', result: '', btnList: vm.btnList('draw', 'ValveStatusBcn') },
        { name: '排放额度', result: '', btnList: vm.btnList('set', 'EmissionLimitBcn') },
        { name: '排放控制污染物', result: '', btnList: vm.btnList('deleteUp', 'EmissionPollBcn') },
        { name: '总量控制标志', result: '', btnList: vm.btnList('draw', 'TotalMarkBcn') },
        { name: '数采仪控制位', result: '', btnList: vm.btnList('set', 'DataAcqBitBcn') },
        { name: '超标控制位', result: '', btnList: vm.btnList('set', 'ExcessPosBcn') },
        { name: '超额控制位', result: '', btnList: vm.btnList('set', 'ExcessBitBcn') },
        { name: '开启站房门禁', result: '', btnList: vm.btnList('set', 'OpenControlBcn') },
        { name: '温控数据', result: '', btnList: vm.btnList('draw', 'TemControlDataBcn') },
        { name: '空调', result: '', btnList: vm.btnList(['open', 'close'], 'ConditionBcn') },
        { name: '站房温度', result: '', btnList: vm.btnList('set', 'StationTemBcn') },
        { name: '网络反控升级', result: '', btnList: vm.btnList('set', 'NetworkUpgradeBcn') }
      ]
    }
  },
  methods: {
    // 设置-基本参数
    async setBasicParamsBcn (is) {},
    // 提取-基本参数
    async drawBasicParamsBcn (is) {},
    // 设置-串口参数
    async setSerialPortParamsBcn (is) {},
    // 提取-串口参数
    async drawSerialPortParamsBcn (is) {},
    // 设置-模拟量参数
    async setAnalogParamsBcn (is) {},
    // 提取-模拟量参数
    async drawAnalogParamsBcn (is) {},
    // 设置-服务器参数
    async setServerParamsBcn (is) {},
    // 提取-服务器参数
    async drawServerParamsBcn (is) {},
    // 设置-本地网络参数
    async setLocalParamsBcn (is) {},
    // 提取-本地网络参数
    async drawLocalParamsBcn (is) {},
    // 提取-用户参数
    async drawUserParamsBcn (is) {},
    // 添加-用户参数
    async addUserParamsBcn (is) {},
    // 删除-用户参数
    async deleteUpUserParamsBcn (is) {},
    // 提取-本机信息
    async drawNativeInfoBcn (is) {},
    // 提取-程序版本信息
    async drawVerInfoBcn (is) {},
    // 提取-智能监控
    async drawIntellMonitorBcn (is) {},
    // 添加-智能监控
    async addIntellMonitorBcn (is) {},
    // 删除-智能监控
    async deleteUpIntellMonitorBcn (is) {},
    // 设置-DO电平
    async setLevelBcn (is) {},
    // 提起-DO电平
    async drawLevelBcn (is) {},
    // 设置-升级参数
    async setUpgradeParamsBcn (is) {},
    // 提取-升级参数
    async drawUpgradeParamsBcn (is) {},
    // 设置-阀门控制标志
    async setValveSignBcn (is) {},
    // 提取-阀门状态
    async drawValveStatusBcn (is) {},
    // 设置-排放额度
    async setEmissionLimitBcn (is) {},
    // 删除-排放控制污染物
    async deleteUpEmissionPollBcn (is) {},
    // 提取-总量控制标志
    async drawTotalMarkBcn (is) {},
    // 设置-数采仪控制位
    async setDataAcqBitBcn (is) {},
    // 设置-超标控制位
    async setExcessPosBcn (is) {},
    // 设置-超额控制位
    async setExcessBitBcn (is) {},
    // 设置-开启站房门禁
    async setOpenControlBcn (is) {},
    // 提取-温控数据
    async setTemControlDataBcn (is) {},
    // 打开-空调
    async openConditionBcn (is) {},
    // 关闭-空调
    async closeConditionBcn (is) {},
    // 设置-站房温度
    async setStationTemBcn (is) {},
    // 设置-网络反控升级
    async setNetworkUpgradeBcn (is) {}
  }
}

export default nationalStandard
