<template>
  <div>
    <div class="echarts" id="echarts-dom"></div>
    <divider>下方投票 ({{checkerType | checkerTypeFilter}})</divider>
    <checker
    v-model="selectedAns"
    :type="checkerType"
    default-item-class="selected-item"
    selected-item-class="selected-item-selected"
    >
      <checker-item v-for="(item, index) in option.xAxis.data" :key="index" :value="index">{{item}}</checker-item>
    </checker>
    <x-button type="primary" @click.native="submitData">投票</x-button>
  </div>
</template>

<script>
  import echarts from 'echarts'
  import { Checker, CheckerItem, XButton, Divider } from 'vux'
  export default {
    components: {
      Checker,
      CheckerItem,
      XButton,
      Divider
    },
    props: [
      'option',
      'config'
    ],
    mounted () {
      this.checkerType = this.config.selectType === 'single' ? 'radio' : 'checkbox'
      let echartsDOM = document.getElementById('echarts-dom')
      let iEcharts = echarts.init(echartsDOM)
      this.$echartsDOM = iEcharts
      iEcharts.setOption(this.option)
      this.$socket.emit('identify by id', this.$route.query.id)
    },
    beforeDestroy () {
      this.$socket.emit('leave room by id', this.$route.query.id)
    },
    sockets: {
      connect: () => {
        console.log('Socket is connected.')
      },
      identifyById: function (msg) {
        this.temMsg = msg
      },
      updateData: function (data) {
        // this.newResponseData = data
        this.changeData(data)
      }
    },
    methods: {
      changeData (data) {
        this.$echartsDOM.setOption({
          series: [{
            data: data
          }]
        })
      },
      submitData () {
        let newData = []
        if (Array.isArray(this.selectedAns)) {
          newData = this.selectedAns
        } else {
          newData.push(this.selectedAns)
        }
        let body = {}
        body.newData = newData
        this.$socket.emit('update lottery data', body)
      }
    },
    data () {
      return {
        temMsg: 'MSG',
        selectedAns: [],
        checkerType: '',
        newResponseData: []
      }
    },
    filters: {
      checkerTypeFilter: (value) => {
        if (!value) return ''
        return value === 'radio' ? '单选' : '多选'
      }
    }
  }
</script>

<style>
.echarts {
  width: 100%;
  height: 30rem;
}
.selected-item {
  width: 46%;
  height: 34px;
  line-height: 34px;
  vertical-align: middle;
  text-align: center;
  border-radius: 3px;
  border: 2px solid #ccc;
  background-color: #fff;
  margin: 4px 2px;
}
.selected-item-selected {
  border-color: #25ac2f;
}
</style>
