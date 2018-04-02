import Vue from 'Vue'
import Vuex from 'Vuex'
// import app from './modules/app'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    appPath: 'Lottery',
    isLogIn: false,
    clientUserName: '',
    entryPath: '',
    myJoinLottery: []
  },
  getters: {
    didIJoin: (state) => (id) => {
      return state.myJoinLottery.some(item => item === id)
    }
  },
  mutations: {
    setAppPath (state, {path}) {
      state.appPath = path
    },
    logIn (state, {isLogIn}) {
      state.isLogIn = isLogIn
    },
    logOut (state, {isLogIn}) {
      state.isLogIn = isLogIn
    },
    setClientUserName (state, {clientUserName}) {
      state.clientUserName = clientUserName
    },
    setEntryPath (state, {entryPath}) {
      state.entryPath = entryPath
    },
    setMyJoinLottery (state, {myJoinLottery}) {
      state.myJoinLottery = [...myJoinLottery]
    }
  },
  actions: {
    setPath ({ commit, state }, {path}) {
      commit('setAppPath', {path})
    }
  }
})

export default store
