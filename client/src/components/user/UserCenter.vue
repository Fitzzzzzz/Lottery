<template>
  <div>
    <group>
      <cell :title="this.$store.state.clientUserName">
        <img slot="icon" src="../../assets/logo.png" width="26">
      </cell>
    </group>
    <group>
      <cell-box is-link :link="{ path: 'mine', query: { type: 'create' }}">我创建的投票</cell-box>
      <cell-box is-link :link="{ path: 'mine', query: { type: 'join' }}">我参与的投票</cell-box>
    </group>
    <group>
      <x-button type="warn" @click.native="signOut">退出登陆</x-button>
    </group>
  </div>
</template>

<script>
  import { Group, Cell, XButton, CellBox } from 'vux'
  export default {
    components: {
      Group,
      Cell,
      XButton,
      CellBox
    },
    methods: {
      signOut () {
        this.$store.commit('logOut', { isLogIn: false })
        this.$router.push('home')
      }
    }
  }
</script>

<style>
img {
  display: block;
  margin-right: 8px;
}
</style>

