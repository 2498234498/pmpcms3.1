import { getBeforeDate } from '@/utils'
const datePickerMixin = {
  data () {
    return {
      startDatePicker: this.startDate(),
      endDatePicker: this.endDate()
    }
  },
  methods: {
    startDate () {
      let _this = this
      return {
        shortcuts: [{
          text: '今天',
          onClick (picker) {
            picker.$emit('pick', new Date())
          }
        }, {
          text: '昨天',
          onClick (picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', date)
          }
        }, {
          text: '一周前',
          onClick (picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', date)
          }
        }],
        disabledDate (time) {
          if (_this.params.endTime) {
            if (_this.limitTime) {
              return time.getTime() < new Date(getBeforeDate(_this.limitTime, _this.params.endTime)).getTime() || time.getTime() > new Date(_this.params.endTime).getTime()
            } else {
              return time.getTime() > new Date(_this.params.endTime).getTime()
            }
          }
        }
      }
    },
    endDate () {
      let _this = this
      return {
        shortcuts: [{
          text: '今天',
          onClick (picker) {
            picker.$emit('pick', new Date())
          }
        }, {
          text: '昨天',
          onClick (picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', date)
          }
        }, {
          text: '一周前',
          onClick (picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', date)
          }
        }],
        disabledDate (time) {
          if (_this.params.beginTime) {
            if (_this.limitTime) {
              return time.getTime() > new Date(getBeforeDate(_this.limitTime, _this.params.beginTime, true)).getTime() || new Date(_this.params.beginTime).getTime() > time.getTime()
            } else {
              return new Date(_this.params.beginTime).getTime() > time.getTime()
            }
          }
        }
      }
    },
    beginTimeChange (value) {
      if (value && this.limitTime && !this.params.endTime) {
        this.params.endTime = getBeforeDate(this.limitTime, value, true)
      }
    },
    endTimeChange (value) {
      if (value && this.limitTime && !this.params.beginTime) {
        this.params.beginTime = getBeforeDate(this.limitTime, value)
      }
    }
  }
}
export default datePickerMixin
