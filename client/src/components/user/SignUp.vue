<template>
  <div>
    <group title="设置用户名和密码">
      <x-input v-model="username" title="用户名" placeholder="4-16位英文字母和简单字符" label-width="80px" novalidate :show-clear="false" placeholder-align="right" text-align="right"></x-input>
      <x-input v-model="password" title="密码" placeholder="至少包含英文字母和简单字符" type="password" label-width="80px" novalidate :show-clear="false" placeholder-align="right" text-align="right"></x-input>    
    </group>
    <div style="padding:15px;">
      <x-button type="primary" @click.native="signUp">注册</x-button>
      <x-button link="/home">返回主页</x-button>
    </div>
  </div>
</template>

<script>
  import { Msg, Divider, XButton, XInput, Group } from 'vux'
  export default {
    components: {
      Msg,
      Divider,
      XButton,
      XInput,
      Group
    },
    methods: {
      changeIcon () {
        window.alert('66')
      },
      signUp: async function () {
        let body = {
          username: this.username,
          password: this.$md5(this.password)
        }
        let promise = await this.$http.post('/api/user/signup', body)
        let data = promise.data
        if (data.errorcode === 0) {
          this.$router.push('signin')
        }
      }
    },
    data () {
      return {
        username: '',
        password: ''
      }
    }
  }
</script>