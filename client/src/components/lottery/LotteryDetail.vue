<template>
  <div>
    <div v-if="loadEcharts">
      <card :header="{ title: '投票结果' }">
        <IEcharts :option="option" slot="content" :config="config"></IEcharts>
      </card>
    </div>
  </div>
</template>

<script>
import IEcharts from '@/components/echarts/IEcharts'
import { Card } from 'vux'
export default {
  components: {
    IEcharts,
    Card
  },
  mounted () {
    this.$http.get(`/api/getLotteryDetail?id=${this.$route.query.id}`).then(response => {
      let data = response.data
      let option = {
        title: {
          text: data[0].config.title
        },
        tooltip: {},
        legend: {
          data: ['数量']
        },
        xAxis: {
          data: data[0].config.xAxis
        },
        yAxis: {},
        series: [{
          name: '数量',
          type: data[0].config.eChartsType,
          data: data[0].list
        }]
      }
      Object.assign(this.option, option)
      Object.assign(this.config, data[0].config)
      this.loadEcharts = true
    })
  },
  data () {
    return {
      option: {},
      config: {},
      loadEcharts: false
    }
  }
}
</script>
