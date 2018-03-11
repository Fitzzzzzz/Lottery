<template>
  <div>
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
      console.log(this.option)
      let echartsDOM = document.getElementById('echarts-dom')
      let iEcharts = echarts.init(echartsDOM)
      this.$echartsDOM = iEcharts
      iEcharts.setOption(this.option)
      // this.changeData()
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
