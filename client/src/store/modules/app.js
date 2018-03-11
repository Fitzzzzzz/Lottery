const state = {
  appPath: 'default'
}

const mutations = {
  setAppPath (state, path) {
    state.appPath = path
  }
}

export default {
  state,
  mutations
}
