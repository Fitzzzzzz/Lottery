import Vue from 'Vue'
import Vuex from 'Vuex'
// import app from './modules/app'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    appPath: 'Lottery',
    isLogIn: false,
    clientUserName: '',
    entryPath: ''
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
    }
  },
  actions: {
    setPath ({ commit, state }, {path}) {
      commit('setAppPath', {path})
    }
  }
})

export default store
