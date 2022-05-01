<template>
  <div class="reveal">
    <loading time=1></loading>
    <div class="reveal-anim">
      <h3>2 motorisations sont faites pour vous</h3>
      <div class="tops">
        <svg id="demo" xmlns="http://www.w3.org/2000/svg" width="100%" :height="windowHeight-145" >
          <defs>
            <mask id="theMaskTop1" maskUnits="userSpaceOnUse">
              <rect class="rectTop1" fill="white" :x="(myWidth*0)-(myWidth/2)" :y="(myWidth/4)-(myWidth)" :width="(myWidth)" :height="myWidth*2" />
            </mask>
            <mask id="theMaskTop2" maskUnits="userSpaceOnUse">
              <rect class="rectTop2" fill="white" :x="(myWidth*1)-(myWidth/2)" :y="(myWidth/4)-(myWidth)" :width="(myWidth)" :height="myWidth*2" />
            </mask>
          </defs>
          <g id="maskRevealTop1" class="visuel" mask="url(#theMaskTop1)">
            <image :xlink:href="imageSourceTop1" x="0" y="0" :height="windowHeight-145" />
            <text text-anchor="start" class="line1" x="50">{{ texts[getTop(1)].line1 }}</text>
            <text text-anchor="start" class="line2" x="50">{{ texts[getTop(1)].line2 }}</text>
            <text text-anchor="start" class="line3" x="50">{{ texts[getTop(1)].line3 }}</text>
          </g>
          <g id="maskRevealTop2" class="visuel" mask="url(#theMaskTop2)">
            <image :xlink:href="imageSourceTop2" :x="windowWidth-((windowHeight-145)*2)" y="0" :height="windowHeight-145" />
            <text text-anchor="end" class="line1" :x="windowWidth-50">{{ texts[getTop(2)].line1 }}</text>
            <text text-anchor="end" class="line2" :x="windowWidth-50">{{ texts[getTop(2)].line2 }}</text>
            <text text-anchor="end" class="line3" :x="windowWidth-50">{{ texts[getTop(2)].line3 }}</text>
          </g>
        </svg>
        <NuxtLink to="/affinez-votre-choix" class="cta discover">Découvrez pourquoi et affinez votre choix</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script>
import gsap, {Expo} from "gsap";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import EventBus from "assets/js/utils/event-bus";

gsap.registerPlugin(DrawSVGPlugin);
const angle = -20;

export default {
  data: () => {
      return {
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,
        texts:{
          'ev':{
            line1: 'Niro EV',
            line2: '100% électrique',
            line3: 'le style conjugué au futur',
          },
          'phev':{
            line1: 'Niro',
            line2: 'Hybride Rechargeable',
            line3: 'la motorisation optimisée',
          },
          'hev':{
            line1: 'Niro',
            line2: 'Hybride',
            line3: 'le style allié à l\'intelligence',
          }
        }
      }
  },
  head() {
    return {
      bodyAttrs: {
        class: 'models'
      }
    }
  },
  computed: {
    imageSourceTop1(){
      return require(`~/assets/images/top1-${this.getTop(1)}-desktop2.jpg`)
    },
    imageSourceTop2(){
      return require(`~/assets/images/top2-${this.getTop(2)}-desktop2.jpg`)
    },
    myWidth(){
      return this.windowWidth;
    },

  },
  mounted() {
    EventBus.$on('LOAD_REVEAL_COMPLETE', this.startReveal)
    this.resize()
    window.addEventListener('resize', this.resize)



    this.$store.commit('setTwoCars', this.getSortedKeys(this.$store.state.top3).slice(0, 2))

  },
  methods:{

    resize(){

      this.windowWidth = window.innerWidth;
      this.windowHeight = window.innerHeight;

      const svg = document.querySelector('.tops svg').getBoundingClientRect()
      //
      gsap.set('#maskRevealTop1 .line1', {y:this.windowHeight - 280})
      gsap.set('#maskRevealTop1 .line2', {y:this.windowHeight - 235})
      gsap.set('#maskRevealTop1 .line3', {y:this.windowHeight - 200})
      //
      gsap.set('#maskRevealTop2 .line1', {y: 70})
      gsap.set('#maskRevealTop2 .line2', {y: 115})
      gsap.set('#maskRevealTop2 .line3', {y: 150})

    },
    getTop(n){
      if(!this.$route.query.top1) {
        const arr = this.$store.state.top3;
        return this.getSortedKeys(arr)[n-1]
      } else {
        return [this.$route.query.top1, this.$route.query.top2][n-1]
      }

    },
    getSortedKeys(obj) {
      // console.log(obj)
      const keys = Object.keys(obj);
      const arr =  keys.sort(function(a,b){return obj[b]-obj[a]})
      if(arr[1]==='ev' && (arr[0] === 'phev' || arr[0]==='hev')){
        const arr1 = arr[0];
        arr[0] = 'ev';
        arr[1] = arr1;
      }
      if(arr[0]==='hev' && arr[1] === 'phev'){
        arr[0] = 'phev';
        arr[1] = 'hev';
      }
      // console.log(arr)
      return arr;
    },
    startReveal(){
      const timing = 3;
      const timingTexts = 4
      // const svg = document.querySelector('.tops svg').getBoundingClientRect()
      gsap.to('.reveal-anim', {opacity:1, duration:1})

      gsap.set('#maskRevealTop1 .line1', {y:this.windowHeight - 280, opacity:0, x:"-=100"})
      gsap.set('#maskRevealTop1 .line2', {y:this.windowHeight - 235, opacity:0, x:"-=100"})
      gsap.set('#maskRevealTop1 .line3', {y:this.windowHeight - 200, opacity:0})

      gsap.set('#maskRevealTop2 .line1', {y: 70, opacity:0, x:"-=100"})
      gsap.set('#maskRevealTop2 .line2', {y: 115, opacity:0, x:"-=100"})
      gsap.set('#maskRevealTop2 .line3', {y: 150, opacity:0})

      gsap.set('.rectTop1', { transformOrigin: 'center center', rotation:0})
      gsap.to('.rectTop1', {duration:timing, rotation:-angle, ease:Expo.easeOut})

      gsap.set('.rectTop2', { transformOrigin: 'center center', rotation:0})
      gsap.to('.rectTop2', {duration:timing, rotation:-angle, ease:Expo.easeOut})

      gsap.to('#maskRevealTop1 .line1', {opacity:1, x:0, duration:timingTexts, delay:timing-2, ease:Expo.easeOut})
      gsap.to('#maskRevealTop1 .line2', {opacity:1, x:0, duration:timingTexts, delay:timing-2, ease:Expo.easeOut})
      gsap.to('#maskRevealTop1 .line3', {opacity:1, duration:timingTexts/2, delay:timing+timingTexts-4, ease:Expo.easeOut})

      gsap.to('#maskRevealTop2 .line1', {opacity:1, x:0, duration:timingTexts, delay:timing, ease:Expo.easeOut})
      gsap.to('#maskRevealTop2 .line2', {opacity:1, x:0, duration:timingTexts, delay:timing, ease:Expo.easeOut})
      gsap.to('#maskRevealTop2 .line3', {opacity:1, duration:timingTexts/2, delay:timing+timingTexts-4, ease:Expo.easeOut})
    }
  }
}
</script>

<style lang="scss">
.reveal {
  width: 100%;
  &-anim {
    opacity: 0;
    h3 {
      margin-top: 0;
    }
    .tops{
      position:relative;
      margin-top: 0px;
      display: flex;
      flex-direction: column;
      align-items: center;

      svg {
        .visuel {
          position:relative;
          text {
            fill: white;
            &.line1, &.line2 {
              font-size: 40px;
              font-family: "Kia Signature Fix Bold";
            }
            &.line3{
              font-size: 24px;
              font-family: "Kia Signature Fix Light";
            }
          }
        }
      }
      .cta.discover {
        position: absolute;
        z-index: 1000;
        bottom: 10px;

        @media screen and(max-width:640px) {
          bottom: -42px;
          padding:20px;
          font-size: 14px;
        }
      }
    }
  }
}
</style>
