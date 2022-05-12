<template>
  <div>
    <loading time="2"></loading>
    <div class="match" >
      <div class="bg" :style="{backgroundImage: `url(${datas[car].img})`}"></div>
      <div class="text">
        <h4 v-html="datas[car].h4"></h4>
        <p v-html="datas[car].p"></p>
      </div>
      <div class="conseiller">
        <h4>Un conseiller Kia prendra contact avec vous dans les prochains jours.</h4>
        <a class="cta" href="https://www.kia.com/fr/modeles/niro/pre-lancement/" target="_blank">En savoir plus</a>
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
          h4: 'Niro EV 100% électrique',
          p : 'Le style conjugué au futur'
        },
        phev : {
          img: phevImg,
          h4: 'Niro Hybride rechargeable',
          p : 'La motorisation optimisée'
        },
        hev : {
          img: hevImg,
          h4: 'Niro Hybride',
          p : 'Le style allié  à l\'intelligence'
        },

      },
      car: this.$store.state.thematch
    }
  },
  mounted(){
    EventBus.$on('LOAD_REVEAL_COMPLETE', this.revealMatch)
    //
    let carName = 'NIRO EV (SG2 EV)';
    if(this.car === 'phev') { carName = 'NIRO PHEV (SG2)'} else
    if(this.car === 'hev') {carName = 'NIRO HEV (SG2)'
    }
    this.$axios.$post('/webservice/rest/kia/lp_niro_2022.php?step=2', {
      id:this.$store.state.user.id,
      model:carName
    }).then(
      (res) => {
        console.log(res);
        // iosWindowRef.location = 'https://www.kia.com/fr/modeles/niro/pre-lancement/'
      },
      (err) => {
        console.log(err)
      }
    );
    //

  },
  methods:{

    revealMatch(){
      gsap.set('.text, .conseiller', {y: '+=50', opacity:0})
      gsap.to('.match', {opacity:1, duration:2, ease:Expo.easeIn})
      gsap.to('.match .bg', {scale: 1, yoyo: true, repeat: -1, duration:15, ease:Sine.easeInOut})
      gsap.to('.text', {opacity: 1, y:0, delay:2, duration:2, ease:Expo.easeOut})
      // gsap.to('.text', {opacity: 0, y:'-=50', delay:5.5, duration:1.5, ease:Expo.easeIn})
      gsap.to('.text', {opacity: 1, y:'-=140', delay:5.5, duration:3, ease:Expo.easeInOut})
      gsap.to('.conseiller', {opacity: 1, y:0, delay:6.8, duration:3, ease:Expo.easeOut})
    },
    more(){

      // const iosWindowRef = window.open('', '_blank');


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
    transform: scale(1.2);

    @media screen and(max-width:640px){
      transform: scale(1.1);
      background-position: 40% center;
    }
  }

  .text, .conseiller {
    position: absolute;
    z-index:1000;
    width:100%;
    bottom:50px;
    text-align: center;
    color:#FFFFFF;

    @media screen and (max-width: 640px)  {
      bottom:100px;
    }

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
    p{
      margin-top: 0.5em;
    }
  }
  .conseiller{
    opacity:0;
    h4{
      width: 80%;
      margin: 0 auto 20px;
      font-size: 30px;

      @media screen and (max-width: 640px)  {
        font-size: 16px;
        margin: 0 auto 15px;
      }
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
