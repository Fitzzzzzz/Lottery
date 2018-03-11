<template>
  <div>
    <group v-for="item in items" :key="item.key">
      <form-preview 
        header-label="状态" 
        :header-value="item.status | itemChineseFilter" 
        :body-items="[{ label: '标题', value: item.config.title }, { label: '参与人数', value: item.list.length}]" 
        :footer-buttons="buttons"
        :name="item._id">
      </form-preview>
    </group>
    <alert v-model="showURLQr" title="投票地址为">
      <vue-qr :text="currentURL" :size="250"></vue-qr>
    </alert>
  </div>
</template>

<script>
import { FormPreview, Group, Alert } from 'vux'
import VueQr from 'vue-qr'
export default {
  components: {
    FormPreview,
    Group,
    Alert,
    VueQr
  },
  filters: {
    itemChineseFilter: (value) => {
      if (!value) return ''
      return value === 'in-process' ? '进行中' : '已结束'
    }
  },
  data () {
    return {
      buttons: [
        {
          style: 'default',
          text: '查看投票地址',
          onButtonClick: (name) => {
            this.currentURL = name
            this.showURLQr = true
          }
        }, {
          style: 'primary',
          text: '查看详情',
          onButtonClick: (name) => {
            this.$router.push({ path: 'detail', query: { id: name } })
          }
        }
      ],
      items: [],
      currentURL: '',
      showURLQr: false
    }
  },
  mounted () {
    if (this.$route.query.type === 'create') {
      this.$http.get(`/api/myCreateLottery?username=${this.$store.state.clientUserName}`).then(response => {
        this.items = response.data
      })
    }
  }
}
</script>
