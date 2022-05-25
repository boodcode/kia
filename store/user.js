export const state = () => ({
  id:"",
  infos: {
      civ: 'M',
      email: '',
      firstname: '',
      lastname: '',
      tel: '',
      cp: '',
      ville: '',
      concession: '',
      offres: 'non',
      optin: false,
      // consent: false
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
  updateId(state, value){
    state.id = value;
  },
  updateInfos(state, value) {
    state.infos = value;
  },
  updateConduite(state, value) {
    state.conduite = value;
  },
}
