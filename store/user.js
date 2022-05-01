export const state = () => ({
    datas: {
      civ: 'M',
      email: '',
      firstname: '',
      lastname: '',
      tel: '',
      cp: '',
      ville: '',
      concession: '',
      optin: false
    },
    conduite: {
     kmByDay: 0,
     kmByYear: 0,
     voyagesOver400km: 'Rarement',
     frequenceVille: '',
     frequenceAutoroute: '',
     frequenceExtraUrbain: '',
     rechargeDomicile: false,
     rechargeBorne: false,
     priority:{
       p1: 'coffre',
       p2: 'puissance',
       p3: 'autonomie',
       p4: 'silence'
     },
   }
})

export const mutations = {
    updateDatas(state, datasData) {
      state.datas = datasData;
    },
    updateConduite(state, conduiteData) {
      state.conduite = conduiteData;
    },
  }
