<template>
  <div class="time" style="display: inline-block;">
    <el-date-picker
      v-if="[1, 8, 7, 2, 3].includes(type)"
      class="w150"
      v-model="v"
      type="datetime"
      :size="size"
      @change="change"
      :picker-options="pickerOpt"
      :placeholder="placeholder">
    </el-date-picker>
    <el-date-picker
      v-else-if="[5, 10].includes(type)"
      class="w150"
      v-model="v"
      type="month"
      :size="size"
      @change="change"
      :picker-options="pickerOpt"
      :placeholder="placeholder">
    </el-date-picker>
    <el-date-picker
      v-else-if="[4].includes(type)"
      class="w150"
      v-model="v"
      type="year"
      :size="size"
      @change="change"
      :picker-options="pickerOpt"
      :placeholder="placeholder">
    </el-date-picker>
    <el-date-picker
      v-else-if="[6, 9].includes(type)"
      class="w150"
      v-model="v"
      type="date"
      :size="size"
      :default-time="isDayEnd ? '23:59:59' : ''"
      @change="change"
      :picker-options="pickerOpt"
      :placeholder="placeholder">
    </el-date-picker>
  </div>
</template>

<script>
import { parseTime, getCountDays } from '@/utils'
export default {
  props: {
    type: '', // 实时数据, 超标数据, 季度数据, 年度数据, 月度数据, 日数据, 小时数据, 分钟数据
    value: '',
    contrastValue: '',
    only: { // begin, end
      type: String,
      default: 'begin'
    }
  },
  data (vm) {
    return {
      specialArr: [1, 2, 9],
      pickerOpt: {
        disabledDate (time) {
          if (vm.contrastValue && typeof vm.contrastValue === 'object') {
            if (vm.only === 'end') {
              let begin = `${parseTime(vm.contrastValue, '{y}-{m}-{d}')} 00:00:00`
              begin = new Date(begin).getTime()
              // 实时数据，超标数据 只能选一天
              if (vm.specialArr.includes(vm.type) && time.getTime() >= begin + 1000 * 60 * 60 * 24) {
                return true
              } else if (vm.type === 10) { // 月报表
                const [beginYeah, beginMonth] = parseTime(vm.contrastValue, '{y}-{m}').split('-')
                const nextMonth = beginMonth >= 12 ? 1 : Number(beginMonth) + 1
                const nextYeah = beginMonth >= 12 ? Number(beginYeah) + 1 : beginYeah
                if (time.getTime() >= new Date(`${nextYeah}-${nextMonth}-01 00:00:00`)) return true
              }
              // 结束时间不能大于开始时间
              return time.getTime() < begin
            }
          }
          return false
        }
      },
      size: 'mini'
    }
  },
  methods: {
    change (time) {
      console.log(time)
      if (!(this.contrastValue && typeof this.contrastValue === 'object') || !time) return false
      if ([9, 10].includes(this.type)) {
        if (this.type === 9) {
          // 日报表，结束时间是开始时间的23时59分59秒
          const date = new Date(`${parseTime(time, '{y}-{m}-{d}')} 23:59:59`)
          if (this.only === 'begin') {
            this.$emit('update:contrastValue', date)
          } else {
            this.v = date
          }
        } else {
          // 月报表，结束时间是开始时间的最后一个天，23时59分59秒
          const [yeah, month] = parseTime(time, '{y}-{m}').split('-')
          const day = getCountDays(yeah, month)
          const date = new Date(`${yeah}-${month}-${day} 23:59:59`)
          if (this.only === 'begin') {
            this.$emit('update:contrastValue', date)
          } else {
            this.v = date
          }
        }
      } else {
        // 如果开始时间大于结束时间，则把开始时间的值赋给结束时间
        if (this.only === 'begin') {
          const startYMD = parseTime(time, '{y}-{m}-{d}')
          const endYMD = parseTime(this.contrastValue, '{y}-{m}-{d}')
          if (time.getTime() > this.contrastValue.getTime() || ([1, 2, 9].includes(this.type) && startYMD !== endYMD)) { // 实时数据、超标数据，开始时间改变，结束时间如果不是同一天就得跟着改变
            this.$emit('update:contrastValue', new Date(`${parseTime(time, '{y}-{m}-{d}')} 23:59:59`))
          }
        } else {
          // 如果结束时间小于开始时间，则把结束时间的值赋给开始时间
          if (time.getTime() < this.contrastValue.getTime()) {
            this.$emit('update:contrastValue', new Date(`${parseTime(time, '{y}-{m}-{d}')} 00:00:00`))
          }
        }
      }
    }
  },
  computed: {
    placeholder () {
      const strObj = { begin: '开始时间', end: '结束时间' }
      return strObj[this.only]
    },
    v: {
      get () {
        return this.value
      },
      set (val) {
        this.$emit('update:value', val)
      }
    },
    isDayEnd () {
      if (this.type === 9 && this.only === 'end') {
        return true
      }
      return false
    }
  }
}
</script>

<style lang="scss" scoped>
.w150 {
  width: 180px;
}
</style>
