<template>
  <el-dialog title="请选择监控点位置"
    :visible.sync="mapShow"
    center
    append-to-body
    width="80%"
    class="map-dialog">
    <ve-bmap height="100%"
      ref="bmap"
      :settings="sttings"
      :series="series"
      :events="events">
      <h4>当前经度：{{ lng }}，维度：{{ lat }}</h4>
      <div class="search-bar">
        <label>搜索地址：</label>
        <el-autocomplete class="search"
          v-model="search"
          :fetch-suggestions="queryList"
          ref="autocomplete"
          @select="searchMap"
          select-when-unmatched
          placeholder="回车搜索"
          size="mini"></el-autocomplete>
      </div>
    </ve-bmap>
    <div slot="footer"
      class="dialog-footer">
      <el-button @click="mapShow = false">取 消</el-button>
      <el-button type="primary"
        @click="mapSubmit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import jsonp from 'jsonp'
export default {
  name: 'bmap',
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      mapShow: false,
      sttings: {
        key: 'oBvDtR6nzWtVchkY4cLHtnah1VVZQKRK',
        bmap: {
          // 默认定位广州博控
          center: [113.378435, 23.129051],
          zoom: 20,
          roam: true,
          mapStyle: {}
        }
      },
      series: {
        type: 'scatter',
        coordinateSystem: 'bmap',
        data: [
          // [120, 30, 1] // 经度，维度，value，...
        ]
      },
      events: {},
      init: false,
      geoc: null,
      timer: null,
      map: null,
      lng: '',
      lat: '',
      search: '',
      cid: 131 // 百度模糊搜索
    }
  },
  created () {
  },
  watch: {
    mapShow (val, od) {
      if (val && !od) {
        this.mapEventInit()
      }
      if (!val) clearInterval(this.timer)
      this.$emit('update:show', val)
    },
    show (val) {
      this.mapShow = val
      if (!val) {
        this.lng = ''
        this.lat = ''
      }
    }
  },
  methods: {
    // 初始化地图事件
    mapEventInit () {
      this.$nextTick(_ => {
        this.timer = setInterval(() => {
          try {
            let map = this.$refs.bmap.echarts.getModel().getComponent('bmap').getBMap()
            this.map = map
            this.geoc = new window.BMap.Geocoder()
            map.removeEventListener('click', this.mapClick)
            map.addEventListener('click', this.mapClick)
            map.clearOverlays() // 清空所有标注物
            this.lng = ''
            this.lat = ''
            clearInterval(this.timer)
            if (!this.init) {
              // 添加平移缩放控件
              const navigationControl = new window.BMap.NavigationControl({
                // 靠左上角位置
                anchor: window.BMAP_ANCHOR_TOP_RIGHT,
                // LARGE类型
                type: window.BMAP_NAVIGATION_CONTROL_LARGE
              })
              map.addControl(navigationControl)
            }

            this.init = true
          } catch (error) { }
        }, 100)
      })
    },
    // 地图点击标记
    mapClick ({ point }) {
      try {
        this.$refs.autocomplete.$refs.input.blur()
      } catch (error) {}
      this.lng = Math.floor(point.lng * 1000) / 1000
      this.lat = Math.floor(point.lat * 1000) / 1000
      let map = this.map
      let marker = new window.BMap.Marker(point)
      map.clearOverlays() // 清空所有标注物
      map.addOverlay(marker)
      marker.setAnimation(window.BMAP_ANIMATION_BOUNCE)
    },
    // 模糊查询地区列表
    queryList (addr, cb) {
      let param = `wd=${addr}&cid=${this.cid}&type=0&t=1543317575943&callback`
      jsonp('http://map.baidu.com/su?', { param }, (err, data) => {
        if (err) {
          console.log(err)
        } else {
          cb(data.s.map(e => {
            let v = ''
            if (e.indexOf('$$$') >= 0) {
              v = e.substr(e.indexOf('$$$'), e.length).replace(/\$/g, '')
              if (/[0]$/.test(v)) {
                v = v.substring(0, v.length - 1)
              }
            } else {
              v = e.substr(0, e.indexOf(this.cid) > 0 ? e.indexOf(this.cid) : e.length).replace(/\$/g, '')
            }
            return {
              value: v
            }
          }))
        }
      })
    },
    // 搜索
    searchMap ({ value }) {
      this.map.clearOverlays() // 清除地图上所有覆盖物
      const onSearchComplete = () => {
        try {
          let point = local.getResults().getPoi(0).point // 获取第一个智能搜索的结果
          this.map.centerAndZoom(point, 18)
          this.mapClick({point}) // 添加标注
        } catch (error) {}
      }
      let local = new window.BMap.LocalSearch(this.map, { // 智能搜索
        onSearchComplete
      })
      local.search(value)
    },
    // 地图提交
    mapSubmit () {
      if (this.lng && this.lat) {
        this.$emit('submit', `${this.lng}/${this.lat}`)
      }
      this.mapShow = false
    }
  },
  beforeDestroy () {
    try {
      // 解除地图点击事件
      let map = this.$refs.bmap.echarts.getModel().getComponent('bmap').getBMap()
      map.removeEventListener('click', this.mapClick)
    } catch (error) { }
  }
}

</script>

<style lang="scss">
.search-bar {
  position: absolute;
  top: 5px;
  left: 5px;
  opacity: .9;
  line-height: 40px;
  label, .search {
    float: left;
  }
  label {
    font-size: 14px;
  }
  .search {
    width: 300px;
  }
}
</style>
