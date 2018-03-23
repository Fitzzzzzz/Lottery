<template>
  <div>
    <group title="输入用户名和密码">
      <x-input v-model="username" title="用户名" placeholder="4-16位英文字母和简单字符" label-width="80px" novalidate :show-clear="false" placeholder-align="right" text-align="right"></x-input>
      <x-input v-model="password" title="密码" placeholder="至少包含英文字母和简单字符" type="password" label-width="80px" novalidate :show-clear="false" placeholder-align="right" text-align="right"></x-input>    
    </group>
    <div id="sign-up">
      <router-link to="/signup">没有账号？</router-link>
    </div>
    <div style="padding:15px;">
      <x-button type="primary" @click.native="signIn" action-type="submit">登陆</x-button>
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
      signIn () {
        this.$http.get(`/api/user/signin?username=${this.username}&password=${this.$md5(this.password)}`).then(response => {
          if (response.data.errorcode === 0) {
            this.$store.commit('setClientUserName', { clientUserName: this.username })
            this.$store.commit('logIn', { isLogIn: true })
            if (this.$store.state.entryPath.length > 0) {
              this.$router.push(this.$store.state.entryPath)
            } else {
              this.$router.push('profile')
            }
          } else if (response.data.errorcode === 2) {
            this.$vux.toast.show({
              text: '用户不存在',
              type: 'warn'
            })
          } else if (response.data.errorcode === 3) {
            this.$vux.toast.show({
              text: '密码错误',
              type: 'warn'
            })
          }
        })
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

<style>
#sign-up {
  color: gray;
  text-align: right;
}
</style>

