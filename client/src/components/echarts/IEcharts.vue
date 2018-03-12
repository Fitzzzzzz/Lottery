<template>
  <div>
    <h1>{{ temMsg }}</h1>
    <button @click="updateData">UPDATE</button>
    <div class="echarts" id="echarts-dom"></div>
  </div>
</template>

<script>
  import echarts from 'echarts'
  export default {
    props: [
      'option'
    ],
    mounted () {
      console.log('IEcharts load')
      let echartsDOM = document.getElementById('echarts-dom')
      let iEcharts = echarts.init(echartsDOM)
      this.$echartsDOM = iEcharts
      iEcharts.setOption(this.option)
      this.changeData()
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
        console.log('recived id msg')
      },
      updateData: function (data) {
        this.temMsg = data
      }
    },
    methods: {
      changeData () {
        let data = []
        for (let i = 0, min = 5, max = 99; i < 6; i++) {
          data.push(Math.floor(Math.random() * (max + 1 - min) + min))
        }
        this.$echartsDOM.setOption({
          series: [{
            data: data
          }]
        })
        setTimeout(this.changeData, 2000)
      },
      updateData () {
        this.$socket.emit('update lottery data')
      }
    },
    data () {
      return {
        temMsg: 'MSG'
      }
    }
  }
</script>

<style>
.echarts {
  width: 100%;
  height: 30rem;
}
</style>
