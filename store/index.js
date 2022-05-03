export const state = () => ({
  activeStep: 1,
  btActive: false,
  twoCars: [],
  evLikes:0,
  phevLikes:0,
  hevLikes:0,
  thematch:'hev',
  source: 'undefined'
})

export const mutations = {
  setSource(state, val){
    state.source = val;
  },
  increment(state) {
    state.activeStep++
  },
  decrement(state) {
    state.activeStep--
  },
  activeNextButton(state, bool) {
    state.btActive = bool
  },
  setTwoCars(state, arr){
    state.twoCars = arr
    setCookie('twoCars', arr, 30)
  },
  incrementCarLikes(state, car){
    if(car ==='ev') {
      state.evLikes++
    } else if(car ==='phev') {
    state.phevLikes++
    } else if(car ==='hev') {
      state.hevLikes++
    }
  },
  decrementCarLikes(state, car){
    if(car ==='ev') {
      state.evLikes--
    } else if(car ==='phev') {
      state.phevLikes--
    } else if(car ==='hev') {
      state.hevLikes--
    }
  },
  setTheMatch(state, car) {
    state.thematch = car
  }
}
