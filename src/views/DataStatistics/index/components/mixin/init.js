import page from '@/mixins/page'
import tableScrollHeight from '@/mixins/tableScrollHeight'
import { comSerial, cached, flatChildrenId, getType } from '@/utils'
import city from '@/utils/city'
export default {
  props: {
    loadingProp: {
      type: Boolean,
      default: false
    },
    data: {
      type: Array,
      default () {
        return []
      }
    },
    params: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  mixins: [page, tableScrollHeight],
  data () {
    return {
      city: Object.freeze(city)
    }
  },
  computed: {
    loadingAuto: {
      get () {
        return this.loadingProp
      },
      set (val) {
        this.$emit('update:loadingProp', val)
      }
    }
  },
  methods: {
    cachedAddr: cached(flatChildrenId),
    generateTable (key) {
      return [
        { field: `${key}Real`, title: '实收', width: 80 },
        { field: `${key}Expect`, title: '应收', width: 80 },
        { field: `${key}Rate`, title: '完整率', width: 80 }
      ]
    },
    formatter (row, property, cellValue, index) {
      property = getType(property) === 'Object' ? property.property : property
      let value = ''
      switch (property) {
        case 'index':
          value = comSerial(this.current, this.size, index)
          break
        case 'areaId':
          value = this.cachedAddr(this.city, cellValue, 'text').join('')
          break
        case 'dayRate':
        case 'hourRate':
        case 'minuteRate':
        case 'rtdRate':
          value = (cellValue + '') ? cellValue + '%' : cellValue
          break
      }
      return value || cellValue
    }
  }
}
