<template>
  <div>
    <div v-if="this.$store.state.isLogIn">
      <div class="echarts" id="echarts-dom"></div>
      <div v-if="lotteryStatus !== 'close' && !didIJoin">
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
    </div>
    <x-dialog :show="!this.$store.state.isLogIn">
        <card :header="{title: '登陆了吗？'}" class="card">
          <div slot="content">
            <span class="span">先去登陆吧</span>
            <x-button type="primary" link="signin">登陆</x-button>
          </div>
        </card>        
      </x-dialog>
  </div>
</template>

<script>
  import echarts from 'echarts'
  import { Checker, CheckerItem, XButton, Divider, XDialog, Card } from 'vux'
  export default {
    components: {
      Checker,
      CheckerItem,
      XButton,
      Divider,
      XDialog,
      Card
    },
    props: [
      'option',
      'config',
      'lotteryStatus'
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
        let myChoice = new Array(data.length).fill(0)
        myChoice[this.selectedAns] = data[this.selectedAns]
        this.$echartsDOM.setOption({
          series: [{
            type: this.config.eChartsType,
            data: data
          }, {
            z: 20,
            type: this.config.eChartsType,
            data: myChoice
          }]
        })
      },
      submitData () {
        if (!this.$store.state.isLogIn) {
          console.log('No login')
          return
        }
        let newData = []
        if (Array.isArray(this.selectedAns)) {
          newData = this.selectedAns
        } else {
          newData.push(this.selectedAns)
        }
        let body = {}
        body.newData = newData
        this.$http.post('/api/user/insertLottery', { username: this.$store.state.clientUserName, id: this.$route.query.id, result: newData }).then(response => {
          if (response.data.errorcode === 0) {
            this.$socket.emit('update data', body)
          }
        })
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
    },
    computed: {
      didIJoin () {
        return this.$store.getters.didIJoin(this.$route.query.id)
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
.card {
  margin: 2em 1em;
}
.span {
  display: inline-block;
  width: 100%;
  margin: 2em 0;
}
</style>
