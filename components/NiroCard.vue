<template>
  <div :id="qType" :class="car" class="nirocard"  >
    <div :class="`visuel visuel-${car}`">
      <span style="background-color: black;color:#999 !important;padding:3px 6px;">{{qType}} - {{car}}</span>
    </div>
    <div class="content">
      <div class="picto">
        <pictoEV v-if="car==='ev'"></pictoEV>
        <pictoPHEV v-if="car==='phev'"></pictoPHEV>
        <pictoHEV v-if="car==='hev'"></pictoHEV>
      </div>
      <smooth-scrollbar id="scroll-area">
        <h4>{{ question }}</h4>
        <p>{{ reponse }}</p>
      </smooth-scrollbar>
    </div>

  </div>
</template>

<script>
import SmoothScrollbar from '~/assets/js/utils/vue-smooth-scrollbar'

import pictoEV from "~/assets/images/picto_ev.svg?inline";
import pictoPHEV from "~/assets/images/picto_phev.svg?inline";
import pictoHEV from "~/assets/images/picto_hev.svg?inline";
export default{
  components: { pictoEV, pictoPHEV, pictoHEV },
  props:{
    qType: String,
    car: String,
  },
  data() {
    return {
      textCards:null,
      question:'',
      reponse:'',
    }
  },
  computed:{
    src() {
      return require(`~/assets/images/picto_${this.car}.svg`)
    }
  },
  created(){
    fetch('/cards.json')
      .then(r => r.json())
      .then(json => {
        this.textCards = json
        this.question = this.getQuestion(this.qType, this.car)
        this.reponse = this.getReponse(this.qType, this.car)
      })
  },
  mounted(){
  },
  methods: {
    getUserResponseByqType(qType){
      let rep = 0;
      if(qType==="kmByDay") {rep = (this.$store.state.user.conduite[qType] < 50)  ? 0 : (this.$store.state.user.conduite[qType] >= 150) ? 2 : 1; }
      else if (qType === "kmByYear") { rep = (this.$store.state.user.conduite[qType] < 10000)  ? 0 : (this.$store.state.user.conduite[qType] >= 20000) ? 2 : 1; }
      else if (qType === "voyagesOver400km") { rep = (this.$store.state.user.conduite[qType] === "rarement")  ? 0 : (this.$store.state.user.conduite[qType] === "De temps en temps") ? 1 : 2; }
      else if (qType === "frequenceVille") { rep = (this.$store.state.user.conduite[qType] === "Parfois")  ? 0 : (this.$store.state.user.conduite[qType] === "Régulièrement") ? 1 : 2; }
      else if (qType === "frequenceExtraUrbain") { rep = (this.$store.state.user.conduite[qType] === "Parfois")  ? 0 : (this.$store.state.user.conduite[qType] === "Régulièrement") ? 1 : 2; }
      else if (qType === "frequenceAutoroute") { rep = (this.$store.state.user.conduite[qType] === "Parfois")  ? 0 : (this.$store.state.user.conduite[qType] === "Régulièrement") ? 1 : 2; }
      else if (qType === "rechargeDomicile") { rep = (this.$store.state.user.conduite[qType] === true || this.$store.state.user.conduite[qType] === 1)  ? 0 : 1; }
      else if (qType === "rechargeBorne") { rep = (this.$store.state.user.conduite[qType] === true || this.$store.state.user.conduite[qType] === 1)  ? 0 : 1; }
      else if (qType === "coffre") {rep =0;}
      //
      return rep;
    },
    getQuestion(qType, car){
      const index = this.getUserResponseByqType(qType);
      return this.textCards[qType][index][car].question
    },
    getReponse(qType, car){
      const index = this.getUserResponseByqType(qType);
      return this.textCards[qType][index][car].reponse
    },

  }
}
</script>

<style lang="scss">
.nirocard{
  width:100%;
  height: 600px;
  background-color: transparent;
  color: white;
  transition: all 0.75s cubic-bezier(0.16, 1, 0.3, 1);

  @media screen and (max-width: 640px) {
    height: 500px;
  }


  .visuel {
    height: 180px;
    background-position: center center;
    background-size: cover;
    &-ev {
      background-image: url(~/assets/images/top1-ev-desktop2.jpg);
    }
    &-phev {
      background-image: url(~/assets/images/top1-phev-desktop2.jpg);
    }
    &-hev {
      background-image: url(~/assets/images/top2-hev-desktop2.jpg);
    }

  }
  .content {
    padding:20px 25px;
    position: relative;
    &:after {
      position:absolute;
      content:"";
      height:40px;
      bottom:20px;
      left:0;
      width:100%;
      background: linear-gradient(0deg, rgba(255, 255, 255, 0) 10%, rgba(255, 255, 255, 0) 100% );
    }
    .picto{
      width:50px;
      height:50px;

      svg {
        width: 100%;
        height: 100%;
        path {
          fill: white;
        }
      }
    }
    #scroll-area {
      position: relative;
      height:315px;

      @media screen and(max-width:640px) {
        height:250px;
      }

      .scroll-content {
        padding: 0 10px 20px 0;
      }
    }
    h4, p {
      color: inherit;
      text-align: left;
    }
    h4 {
      font-family: "Kia Signature Fix Bold", serif;
      font-size: 30px;
      line-height: 1.1em;
      font-weight: normal;
      margin-top: 10px;
      margin-bottom: 0;
    }
    p {
      font-size: 16px;
      line-height: 1.2em;
    }
  }


}
</style>
