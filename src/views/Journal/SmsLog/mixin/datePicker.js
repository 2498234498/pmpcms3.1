import { getDate } from '@/utils'
export default {
  data (vm) {
    return {
      endDatePicker: {
        disabledDate (time) {
          let start = vm.params.beginTime
          start = start ? new Date(`${start.split(' ')[0]} 00:00:00`).getTime() : 0
          time = time.getTime()
          if (start <= time) {
            return false
          }
          return true
        }
      }
    }
  },
  watch: {
    'params.beginTime' (val) {
      const start = val ? new Date(val).getTime() : 0
      const end = this.params.endTime ? new Date(this.params.endTime).getTime() : 0
      if (start > end) {
        this.params.endTime = `${getDate({ timestamp: start, format: 'yyyy-MM-dd' })} 23:59:59`
      }
    }
  }
}
