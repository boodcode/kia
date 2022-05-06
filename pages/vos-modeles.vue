<template>
  <div class="reveal">
    <loading time=3></loading>
    <div class="reveal-anim">
      <h3>2 motorisations sont faites pour vous</h3>
      <div class="tops">
        <svg id="demo" xmlns="http://www.w3.org/2000/svg" width="100%" :height="windowHeight-145" >
          <defs>
            <mask id="theMaskTop1" maskUnits="userSpaceOnUse">
              <!--rect class="rectTop1" fill="white" :x="(myWidth*0)-(myWidth/2)" :y="(myWidth/4)-(myWidth)" :width="(myWidth)" :height="myWidth*2" /-->
              <rect class="rectTop1" fill="white" :x="(myWidth * 1/4)-maskWidth/2" :y="(myWidth/4)-maskHeight/2" :width="maskWidth" :height="maskHeight" />
            </mask>
            <mask id="theMaskTop2" maskUnits="userSpaceOnUse">
              <!--rect class="rectTop2" fill="white" :x="(myWidth*1)-(myWidth/2)" :y="(myWidth/4)-(myWidth)" :width="(myWidth)" :height="myWidth*2" /-->
              <rect class="rectTop2" fill="white" :x="(myWidth * 3/4)-maskWidth/2" :y="(myWidth/4)-maskHeight/2" :width="maskWidth" :height="maskHeight" />
            </mask>
          </defs>

          <g id="maskRevealTop2" class="visuel" mask="url(#theMaskTop2)">
            <image :xlink:href="imageSourceTop2" class="image2" :x="windowWidth-((windowHeight-145)*2)" y="0" :height="windowHeight-145" />
            <text text-anchor="end" class="line1" :x="windowWidth-30">{{ texts[getTop(2)].line1 }}</text>
            <text text-anchor="end" class="line2" :x="windowWidth-30">{{ texts[getTop(2)].line2 }}</text>
            <text text-anchor="end" class="line3" :x="windowWidth-30">{{ texts[getTop(2)].line3 }}</text>
          </g>
          <g id="maskRevealTop1" class="visuel" mask="url(#theMaskTop1)">
            <image :xlink:href="imageSourceTop1" class="image1" x="0" y="0" :height="windowHeight-145" />
            <text text-anchor="start" class="line1" x="30">{{ texts[getTop(1)].line1 }}</text>
            <text text-anchor="start" class="line2" x="30">{{ texts[getTop(1)].line2 }}</text>
            <text text-anchor="start" class="line3" x="30">{{ texts[getTop(1)].line3 }}</text>
          </g>
        </svg>
        <div class="mobile">
          <svg id="mask-models" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 1000 500" width="0" height="0">
            <defs>
              <clipPath id="clipImage1">
                <rect
                      :x="0"
                      :y="0"
                      :width="windowWidth"
                      :height="windowWidth/2"/>
              </clipPath>
              <clipPath id="clipImage2">
                <rect
                      :x="0"
                      :y="0"
                      :width="windowWidth+100"
                      :height="windowWidth/2"/>
              </clipPath>
            </defs>
          </svg>
          <div :style="{backgroundImage: `url(${imageSourceTop1})`}" class="imagemobile1 clip1">
            <div class="text">
              <div class="line1">{{texts[getTop(1)].line1}}</div>
              <div class="line2">{{texts[getTop(1)].line2}}</div>
              <div class="line3">{{texts[getTop(1)].line3}}</div>
            </div>
          </div>
          <div :style="{backgroundImage: `url(${imageSourceTop2})`}" class="imagemobile2 clip2">
            <div class="text">
              <div class="line1">{{texts[getTop(2)].line1}}</div>
              <div class="line2">{{texts[getTop(2)].line2}}</div>
              <div class="line3">{{texts[getTop(2)].line3}}</div>
            </div>
          </div>
        </div>
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
export default {
  data: () => {
      return {
        maskWidth: window.innerWidth/2 + window.innerWidth* Math.sin(10*Math.PI/180)/2,
        maskHeight: 5000,
        ratioLimit:1.25,
        angle: -10,
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
        },
        loaded: false,
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

      this.maskWidth = window.innerWidth/2 + window.innerWidth* Math.sin(10*Math.PI/180)/2

      if(this.loaded) {this.startReveal()}

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
      this.loaded = true;
      const timing = 3;
      const timingTexts = 4
      // const svg = document.querySelector('.tops svg').getBoundingClientRect()
      gsap.to('.reveal-anim', {opacity:1, duration:1})

      if(this.windowWidth/this.windowHeight > this.ratioLimit){

        gsap.to('.mobile', {opacity:0, duration:1})
        gsap.to('#demo', {opacity:1, duration:1})

        gsap.set('#maskRevealTop1 .line1', {y:this.windowHeight - 280, opacity:0, x:"-=100"})
        gsap.set('#maskRevealTop1 .line2', {y:this.windowHeight - 235, opacity:0, x:"-=100"})
        gsap.set('#maskRevealTop1 .line3', {y:this.windowHeight - 200, opacity:0})

        gsap.set('#maskRevealTop2 .line1', {y: 70, opacity:0, x:"-=100"})
        gsap.set('#maskRevealTop2 .line2', {y: 115, opacity:0, x:"-=100"})
        gsap.set('#maskRevealTop2 .line3', {y: 150, opacity:0})

        gsap.set('.rectTop1', { transformOrigin: 'center center', rotation:0})
        if(!gsap.isTweening('.rectTop1')) {
          const rect1Tween = gsap.to('.rectTop1', {duration: timing, x:(this.windowWidth * 1/4)-this.maskWidth/2, rotation: -this.angle, ease: Expo.easeOut})
          rect1Tween.play()
        }

        gsap.set('.rectTop2', { transformOrigin: 'center center', rotation:0})
        if(!gsap.isTweening('.rectTop2')) {
          const rect2Tween = gsap.to('.rectTop2', {duration:timing, rotation:-this.angle, ease:Expo.easeOut})
          rect2Tween.play()
        }


        gsap.to('#maskRevealTop1 .line1', {opacity:1, x:0, duration:timingTexts, delay:timing-2, ease:Expo.easeOut})
        gsap.to('#maskRevealTop1 .line2', {opacity:1, x:0, duration:timingTexts, delay:timing-2, ease:Expo.easeOut})
        gsap.to('#maskRevealTop1 .line3', {opacity:1, duration:timingTexts/2, delay:timing+timingTexts-5, ease:Expo.easeOut})

        gsap.to('#maskRevealTop2 .line1', {opacity:1, x:0, duration:timingTexts, delay:timing, ease:Expo.easeOut})
        gsap.to('#maskRevealTop2 .line2', {opacity:1, x:0, duration:timingTexts, delay:timing, ease:Expo.easeOut})
        gsap.to('#maskRevealTop2 .line3', {opacity:1, duration:timingTexts/2, delay:timing+timingTexts-4, ease:Expo.easeOut})
      }else {
        gsap.to('.mobile', {opacity:1, duration:1})
        gsap.to('#demo', {opacity:0, duration:1})

        gsap.set('#clipImage1, #clipImage2',{transformOrigin:"50% 50%"})

        if(this.windowWidth>960){
          gsap.set('#clipImage2',{y:"135", scaleY:1.2})
          gsap.set('.imagemobile2', {y:'-170'})

        } else if (this.windowWidth>640 && this.windowWidth<=960) {
          gsap.set('#clipImage2',{y:"75", scaleY:1.2})
          gsap.set('.imagemobile2', {y:'-150'})

        } else {
          gsap.set('#clipImage2',{y:"75", scaleY:1.4, scaleX: 1.2})
          gsap.set('.imagemobile2', {y:'-140'})
        }


        // gsap.to('#clipImage1', {rotation:"-5", duration:3, ease:Expo.easeOut})
        gsap.to('#clipImage2', {rotation:"-6", duration:3, ease:Expo.easeOut})

      }

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
            text-shadow: 0 0  10px rgba(0, 0, 0, 0.35);
            &.line1, &.line2 {
              font-size: 36px;
              font-family: "Kia Signature Fix Bold";
            }
            &.line3{
              font-size: 24px;
              font-family: "Kia Signature Fix Light";
            }
          }
        }
      }
      .mobile{
        position:absolute;
        opacity: 0;
        width:100%;
        height:calc(100vh - 180px);
        left:0;

        @media screen and (max-width: 640px){
          height:calc(100vh - 200px);
        }
        .imagemobile1{
          position: relative;
          z-index:2;
          background-size: cover;
          background-position: top left;
          height: calc(50%);
          .text{
            text-align: right;
            position: absolute;
            top: 0;
            right:0;
          }
        }
        .imagemobile2{
          position: relative;
          z-index:10;
          background-size: cover;
          background-position: bottom right;
          height: calc(50%);
        }
        .text {
          position: absolute;
          bottom: 0;
          left:0;
          text-align: left;
          color: white;
          padding: 25px;
          text-shadow: 0 0  10px rgba(0, 0, 0, 0.35);
          .line1, .line2 {
            font-size: 30px;
            font-family: "Kia Signature Fix Bold";
            line-height: 30px;
          }
          .line3{
            margin-top:10px;
            font-size: 18px;
            font-family: "Kia Signature Fix Light";
          }
        }

        @media screen and (max-width: 960px){
          .text {

            padding: 10px;

            .line1, .line2 {
              font-size: 24px !important;
              line-height: 24px !important;
            }

            .line3 {
              margin-top: 5px !important;
              font-size: 14px !important;
            }
          }
        }

        .clip1 {
          clip-path: url(#clipImage1);
        }
        .clip2 {
          clip-path: url(#clipImage2);
        }
      }
      .cta.discover {
        position: absolute;
        z-index: 1000;
        bottom: 10px;

        @media screen and(max-width:960px) {
          bottom: 30px;
          padding:20px;
          font-size: 14px;
        }
      }
    }
  }
}
</style>
