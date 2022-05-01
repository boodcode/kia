<template>
  <div>
    <loading time="4"></loading>
    <div class="match" >
      <div class="bg" :style="{backgroundImage: `url(${datas[car].img})`}"></div>
      <div class="text">
        <h4 v-html="datas[car].h4"></h4>
        <p v-html="datas[car].p"></p>
      </div>
      <div class="conseiller">
        <h4>Votre conseiller Kia prendra contact avec vous<br>
          dans les prochains jours pour convenir d’un rendez-vous.</h4>
        <div class="cta" @click="more">En savoir plus</div>
      </div>
    </div>
  </div>
</template>
<script>
import gsap, {Expo, Sine} from 'gsap';

import EventBus from "assets/js/utils/event-bus";
import evImg from '~/assets/images/match-ev.jpg'
import phevImg from '~/assets/images/match-phev.jpg'
import hevImg from '~/assets/images/match-hev.jpg'

export default {
  data(){
    return {
      datas: {
        ev : {
          img: evImg,
          h4: 'Niro<br>100% électrique',
          p : 'Le style conjugué au futur'
        },
        phev : {
          img: phevImg,
          h4: 'PHEV<br>100% électrique',
          p : 'Le style phev conjugué au futur'
        },
        hev : {
          img: hevImg,
          h4: 'HEV<br>100% électrique',
          p : 'Le style hev conjugué au futur'
        },

      },
      car: this.$store.state.thematch
    }
  },
  mounted(){
    EventBus.$on('LOAD_REVEAL_COMPLETE', this.revealMatch)

  },
  methods:{
    revealMatch(){
      gsap.set('.text, .conseiller', {y: '+=50', opacity:0})

      gsap.to('.match', {opacity:1, duration:2, ease:Expo.easeIn})
      gsap.to('.match .bg', {scale: 1, yoyo: true, repeat: -1, duration:15, ease:Sine.easeInOut})
      gsap.to('.text', {opacity: 1, y:0, delay:2, duration:2, ease:Expo.easeOut})
      gsap.to('.text', {opacity: 0, y:'-=50', delay:8, duration:2, ease:Expo.easeOut})
      gsap.to('.conseiller', {opacity: 1, y:0, delay:8.5, duration:2, ease:Expo.easeOut})
    },
    more(){

    }
  }
}

</script>
<style lang="scss">
.match {
  position:absolute;
  opacity:0;
  top:0;left:0;width:100vw;height: 100vh;
  overflow: hidden;

  .bg {
    position:absolute;
    top:0;left:0;width:100vw;height: 100vh;
    background-size:cover;
    background-position: center center;
    transform: scale(1.2)
  }

  .text, .conseiller {
    position: absolute;
    z-index:1000;
    width:100%;
    bottom:50px;
    text-align: center;
    color:#FFFFFF;
    h4 {
      font-family: "Kia Signature Fix Bold", serif;
      margin-bottom:0;
    }
  }
  .text {
    opacity:0;
    h4{
      font-size: 36px;
    }
  }
  .conseiller{
    opacity:0;
    h4{
      font-size: 30px;
      margin-bottom: 50px;
    }
  }


  &:after {
    position:absolute;
    bottom:0;left:0;
    width:100%;
    height:300px;
    content:"";

    background: linear-gradient(0deg, rgba(37, 28, 21, 1) 10%, rgba(37, 28, 21, 0) 100%);
    z-index:100;
  }
}
</style>
