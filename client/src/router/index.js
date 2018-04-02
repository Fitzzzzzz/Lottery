import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Home from '@/components/HelloFromVux'
import SignUp from '@/components/user/SignUp'
import SignIn from '@/components/user/SignIn'
import UserCenter from '@/components/user/UserCenter'
import LotteryType from '@/components/lottery/LotteryType'
import IEcharts from '@/components/echarts/IEcharts'
import MyLottery from '@/components/user/MyLottery'
import LotteryDetail from '@/components/lottery/LotteryDetail'
import store from '../store'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    }, {
      path: '/home',
      name: 'HelloFromVux',
      component: Home
    }, {
      path: '/signup',
      name: 'SignUp',
      component: SignUp
    }, {
      path: '/profile',
      name: 'UserCenter',
      component: UserCenter
    }, {
      path: '/signin',
      name: 'SignIn',
      component: SignIn
    }, {
      path: '/type',
      name: 'LotteryType',
      component: LotteryType
    }, {
      path: '/show',
      name: 'ShowLottery',
      component: IEcharts
    }, {
      path: '/mine',
      name: 'MyLottery',
      component: MyLottery
    }, {
      path: '/detail',
      name: 'LotteryDetail',
      component: LotteryDetail
    }
  ]
})

router.beforeEach((to, from, next) => {
  switch (to.name) {
    case 'UserCenter' :
      if (!store.state.isLogIn) {
        next('signin')
        return
      }
      store.commit('setAppPath', { path: '个人中心' })
      break
    case 'SignIn' :
      store.commit('setAppPath', { path: '登陆' })
      break
    case 'SignUp' :
      store.commit('setAppPath', { path: '注册' })
      break
    case 'LotteryDetail' :
      store.commit('setAppPath', { path: '投票详情' })
      break
    case 'MyLottery' :
      to.query.type === 'create' ? store.commit('setAppPath', { path: '我创建的投票' }) : store.commit('setAppPath', { path: '我参与的投票' })
      break
    case 'LotteryType' :
      if (!store.state.isLogIn) {
        store.commit('setEntryPath', { entryPath: 'type' })
        next('signin')
        break
      }
      store.commit('setAppPath', { path: '类型' })
      break
    default : store.commit('setAppPath', { path: 'Lottery' })
  }
  next()
})

export default router
