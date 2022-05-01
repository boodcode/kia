export const state = () => ({
  ev:0,
  phev:0,
  hev:0
});

export const mutations = {
  updateTop3(state, datas) {
    state.ev += datas.ev;
    state.hev += datas.hev;
    state.phev += datas.phev;
  },
  initTop3(state) {
    state.ev = 0;
    state.hev = 0;
    state.phev = 0;
  },

}
