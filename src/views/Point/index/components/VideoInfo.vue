<template>
  <div class="video-info WH"
    :class="videoClass">
    <video-player class="video-player vjs-custom-skin"
      v-for="(item, index) in data" :key="index"
      ref="videoPlayer"
      @ready="playerIsReady"
      :playsinline="true"
      :options="playerOptions"></video-player>
  </div>
</template>

<script>
import load from './mixins/load'
import { videoPlayer } from 'vue-video-player'
import 'videojs-flash'
import 'videojs-contrib-hls'
import 'videojs-hotkeys'
require('video.js/dist/video-js.css')
require('vue-video-player/src/custom-theme.css')
export default {
  mixins: [load],
  components: { videoPlayer },
  data () {
    return {
      data: [],
      playerOptions: {
        overNative: true,
        autoplay: false,
        controls: true,
        techOrder: ['html5', 'flash'],
        sourceOrder: true,
        // flash: {
        //   hls: { withCredentials: false },
        //   swf: isProduction ? '/vue-videojs-demo/static/media/video-js.swf' : '/static/media/video-js.swf'
        // },
        html5: {
          hls: { withCredentials: false },
          swf: '/static/video-js.swf'
        },
        sources: [
          {
            withCredentials: false,
            type: 'application/x-mpegURL',
            // src: 'http://playertest.longtailvideo.com/adaptive/bipbop/gear4/prog_index.m3u8'
            src: 'http://ivi.bupt.edu.cn/hls/cctv3hd.m3u8' // CCTV3测试地址
          },
          {
            type: 'video/x-flv',
            src: 'https://flvopen.ys7.com:9188/openlive/00eb4d17ed3646e5a83fb716ae02f50a.hd.flv'
          },
          {
            type: 'rtmp/mp4',
            src: 'rtmp://rtmp.open.ys7.com/openlive/00eb4d17ed3646e5a83fb716ae02f50a'
          }
        ],
        notSupportedMessage: '此视频无法播放',
        // poster: isProduction ? '/vue-videojs-demo/static/images/logo.png' : '/static/images/logo.png'
        controlBar: {
          // timeDivider: false, // 时间分割线
          // durationDisplay: false, // 总时间
          progressControl: false // 进度条
          // customControlSpacer: true, // 未知
          // fullscreenToggle: true // 全屏
        }
      }
    }
  },
  deactivated () {
    this.data = []
  },
  computed: {
    player () {
      return this.$refs.videoPlayer.player
    },
    videoClass () {
      const classList = { 1: 'flex1', 2: 'flex2', 3: 'flex4', 4: 'flex4' }
      return classList[this.data.length]
    }
  },
  methods: {
    initQuery () {
      this.data = []
    },
    playerIsReady (player) {
      console.log('example 2 ready!', player)
      player.hotkeys({
        volumeStep: 0.1,
        seekStep: 5,
        enableModifiersForNumbers: false,
        fullscreenKey (event, player) {
          // override fullscreen to trigger when pressing the F key or Ctrl+Enter
          return ((event.which === 70) || (event.ctrlKey && event.which === 13))
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.video-info {
  position: relative;
  display: flex;
  .not {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate3d(-50%, -50%, 0);
    color: #909399;
    font-size: 14px;
  }
  .vjs-custom-skin {
    border-color: rgb(220, 223, 230);
    border-style: solid;
  }
  &.flex1 {
    .vjs-custom-skin {
      width: 100%;
      height: 100%;
    }
  }
  &.flex2 {
    flex-direction: column;
    .vjs-custom-skin {
      width: 100%;
      height: 50%;
      &:first-child {
        border-bottom-width: 1px;
      }
    }
  }
  &.flex4 {
    flex-wrap: wrap;
    .vjs-custom-skin {
      width: 50%;
      height: 50%;
      border-bottom-width: 1px;
      &:nth-child(1n) {
        border-right-width: 1px;
      }
    }
  }
  /deep/ {
    .video-js {
      height: 100%;
    }
  }
}
</style>
