import page from '@/mixins/page'
import tableScrollHeight from '@/mixins/tableScrollHeight'
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
    }
  },
  mixins: [page, tableScrollHeight],
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
    generateTable () {
      return [
        { field: 'index', title: '实收', width: 80 },
        { field: 'index', title: '应收', width: 80 },
        { field: 'index', title: '完整率', width: 80 }
      ]
    }
  }
}
