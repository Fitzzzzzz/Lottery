<template>
  <div>
    <group v-for="item in items" :key="item.key">
      <form-preview 
        header-label="状态" 
        :header-value="item.status | itemChineseFilter" 
        :body-items="[{ label: '标题', value: item.config.title }, { label: '参与人数', value: item.list.length}]" 
        :footer-buttons="formFooterButtons"
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
      items: [],
      currentURL: '',
      showURLQr: false
    }
  },
  computed: {
    formFooterButtons () {
      let buttons = [
        {
          style: 'default',
          text: '查看投票地址',
          onButtonClick: (name) => {
            this.currentURL = `http://0.0.0.0:8080/#/detail?id=${name}`
            this.showURLQr = true
          }
        }, {
          style: 'primary',
          text: '查看详情',
          onButtonClick: (name) => {
            this.$router.push({ path: 'detail', query: { id: name } })
          }
        }
      ]
      if (this.$route.query.type === 'create') {
        buttons.push({
          style: 'color: red',
          text: '结束投票',
          onButtonClick: (name) => {
            this.$http.post('/api/lottery/closeLottery', { id: name }).then(response => {
              console.log(response.data)
            })
          }
        })
      }
      return buttons
    }
  },
  mounted () {
    if (this.$route.query.type === 'create') {
      this.$http.get(`/api/user/myCreateLottery?username=${this.$store.state.clientUserName}`).then(response => {
        this.items = response.data
      })
    } else {
      this.$http.get(`/api/user/myJoinLottery?username=${this.$store.state.clientUserName}`).then(response => {
        this.items = response.data
        let ids = this.items.map(item => item._id)
        this.$store.commit('setMyJoinLottery', {myJoinLottery: ids})
      })
    }
  }
}
</script>
