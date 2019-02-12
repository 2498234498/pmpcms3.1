const map = {
  data () {
    this.settings = {
      key: 'oBvDtR6nzWtVchkY4cLHtnah1VVZQKRK',
      bmap: {
        center: [113.378435, 23.129051],
        zoom: 14,
        roam: true
      }
    }
    return {
      search: '',
      series: {
        type: 'scatter',
        coordinateSystem: 'bmap',
        data: []
      },
      MNList: [],
      bmap: null,
      mapData: [],
      marker: [],
      initMn: ''
    }
  },
  beforeDestroy () {
    this.$refs.bmap && this.$refs.bmap.clean()
  },
  methods: {
    // 选择mn号
    selectMN (value) {
      this.$nextTick(() => {
        value = value.split(',')
        this.initMn = value[3]
        // TODO
        this.bmap && this.bmap.setZoom(15)
        this.bmap && this.bmap.panTo(new window.BMap.Point(...value))
        // let label = new window.BMap.Label(value[3], {offset: new window.BMap.Size(20, -10)})
        // label.setStyle({
        //   border: '1px solid #000'
        // })
        this.marker.forEach(ele => {
          ele.setAnimation('')
        })
        // this.marker[value[2]].setLabel(label)
        this.marker[value[2]].setAnimation(window.BMAP_ANIMATION_BOUNCE)
      })
    },
    // 地图初始化
    afterSet () {
      this.bmap = this.$refs.bmap.echarts.getModel().getComponent('bmap').getBMap()
      this.bmap.addControl(new window.BMap.NavigationControl())
      this.marker = []
      this.mapData.forEach(ele => {
        this.addOverlay(ele)
      })
      // eslint-disable-next-line
      // TODO 聚合
      // new window.BMapLib.MarkerClusterer(this.bmap, {markers: this.marker})
      this.defaultSearch()
    },
    // 默认选中的search
    defaultSearch () {
      if (!this.search) {
        if (this.MNList.length) {
          this.$nextTick(() => {
            this.search = this.MNList[0].value
            this.selectMN(this.search)
          })
        } else {
          this.search = ''
        }
      } else {
        this.$nextTick(() => {
          this.selectMN(this.search)
        })
      }
    },
    // 添加标注
    addOverlay (obj) {
      let pt = new window.BMap.Point(Math.floor(obj.longitude * 1000) / 1000, Math.floor(obj.latitude * 1000) / 1000)
      let img = ''
      if (obj.onlineStatus === '在线') {
        if (obj.dataStatus === '故障') {
          img = 'orange'
        } else if (obj.dataStatus === '超标') {
          img = 'red'
        } else if (obj.dataStatus === '正常') {
          img = 'green'
        }
      } else {
        img = 'gray'
      }
      // 创建图标
      let myIcon = new window.BMap.Icon(require(`@img/${img}.png`), new window.BMap.Size(50, 68))
      let marker = new window.BMap.Marker(pt, {icon: myIcon})
      // let label = new window.BMap.Label(obj.mn, {offset: new window.BMap.Size(20, -10)})
      // label.setStyle({
      //   border: '1px solid #000',
      //   display: 'none'
      // })
      // marker.setLabel(label)
      this.marker.push(marker)

      var html = `<div class='MapTig'>
                <div class="MapTig-cont">
                  <ul>
                    <li><span class="MapTig-li-title">监控点类型：</span><span class="MapTig-li-cont">${Number(obj.st) === 32 ? '水类' : '气类'}</span></li>
                    <li><span class="MapTig-li-title">企业名称：</span><span class="MapTig-li-cont">${obj.companyName}</span></li>
                    <li><span class="MapTig-li-title">监控点名称：</span><span class="MapTig-li-cont">${obj.pointName}</span></li>
                    <li><span class="MapTig-li-title">监控级别：</span><span class="MapTig-li-cont">${obj.monitorTypeName}</span></li>
                    <li><span class="MapTig-li-title">行业类型：</span><span class="MapTig-li-cont MapYellow">${obj.comIndustryName}</span></li>
                    <li><span class="MapTig-li-title">在线状态：</span><span class="MapTig-li-cont">${obj.onlineStatus}</span></li>
                    <li><span class="MapTig-li-title">数据状态：</span><span class="MapTig-li-cont MapRed">${obj.dataStatus}</span></li>
                    <li><span class="MapTig-li-title">最新时间：</span><span class="MapTig-li-cont">${obj.dataTime || ''}</span></li>
                    <li><span class="MapTig-li-title">mn号:</span><span class="MapTig-li-cont MapRed">${obj.mn}</span></li>
                  </ul>
                </div>
              </div>`
      let opts = {
        offset: {
          height: -40,
          width: 0
        }
      }
      // 信息框
      var infoWindow = new window.BMap.InfoWindow(html, opts)
      this.bmap.addOverlay(marker)
      marker.addEventListener('mouseover', function () {
        this.openInfoWindow(infoWindow)
      })
      marker.addEventListener('mouseout', function () {
        this.closeInfoWindow(infoWindow)
      })
    }
  }
}

export default map
