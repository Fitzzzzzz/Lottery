<template>
  <div>
    <group title="投票标题">
      <x-input title="标题" text-align="right" v-model="lotteryTitle"></x-input>
    </group>
    <group title="单选或多选">
      <radio
        :options="selectMode" 
        :selected-label-style="{color: '#FF9900'}"
        v-model="currentSelectMode"
        @on-change="changeSelectMode"/>
    </group>
    <group title="展示类型">
      <radio
        :options="clientDisplayMode" 
        :selected-label-style="{color: '#FF9900'}"
        v-model="currentDisplayMode"
        @on-change="changeDisplayMode"/>
    </group>
    <group title="备选项">
      <radio
        disabled
        :options="selectItems"
        @on-change="deleteItem"/>
    </group>
    <group>
      <x-button text="添加备选项" @click.native="openDialog"></x-button>
      <x-button text="完成" @click.native="finish" type="primary"></x-button>
    </group>
    <x-dialog
      v-model="showDialog"
      :dialog-style="{'padding': '20px'}"
      hide-on-blur>
      <group title="添加备选项">
        <x-input v-model="selectItem" title="备选项：" label-width="80px" novalidate :show-clear="false" placeholder-align="right"></x-input>
      </group>
      <x-button text="确定" type="primary" @click.native="pushSelectItem"></x-button>
    </x-dialog>
    <alert v-model="showResult" title="投票创建成功">
      投票地址为 :
      <vue-qr :text="lotteryURL" :size="250"></vue-qr>
    </alert>
  </div>
</template>

<script>
  import { Group, Cell, Radio, XButton, XDialog, XInput, Alert } from 'vux'
  import VueQr from 'vue-qr'
  export default {
    components: {
      Group,
      Cell,
      Radio,
      XButton,
      XDialog,
      XInput,
      Alert,
      VueQr
    },
    data () {
      return {
        currentSelectMode: 'single',
        lotteryTitle: '',
        selectMode: [{
          key: 'single',
          value: '单选'
        }, {
          key: 'multiple',
          value: '多选'
        }],
        currentDisplayMode: 'bar',
        clientDisplayMode: [{
          key: 'bar',
          value: '柱状图'
        }, {
          key: 'line',
          value: '线状图'
        }, {
          key: 'pie',
          value: '饼状图'
        }],
        selectItems: [],
        showDialog: false,
        selectItem: '',
        showResult: false,
        lotteryURL: ''
      }
    },
    methods: {
      changeSelectMode (val, label) {
        this.currentSelectMode = val
      },
      changeDisplayMode (val, label) {
        this.currentDisplayMode = val
      },
      openDialog () {
        this.showDialog = true
      },
      pushSelectItem () {
        this.selectItems.push(this.selectItem)
        this.selectItem = ''
        this.showDialog = false
      },
      finish () {
        let obj = {
          config: {}
        }
        let body = {}
        obj.config.title = this.lotteryTitle
        obj.config.selectType = this.currentSelectMode
        obj.config.eChartsType = this.currentDisplayMode
        obj.config.xAxis = this.selectItems
        obj.list = new Array(this.selectItems.length).fill(0)
        body.obj = obj
        body.username = this.$store.state.clientUserName
        this.$http.post('/api/lottery/addLottery', body).then(response => {
          if (response.data.errorcode === 0) {
            this.lotteryURL = `http://0.0.0.0:8080/#/detail?id=${response.data.msg.insertedIds[0]}`
            this.showResult = true
          }
        })
      },
      deleteItem (value, label) {
        console.log('change ', value, label)
        this.$vux.toast.show({
          text: '密码错误',
          type: 'warn'
        })
      }
    }
  }
</script>

<style>
.dialog {
  padding: 20px;
}
</style>

