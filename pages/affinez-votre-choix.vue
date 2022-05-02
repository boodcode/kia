<template>
  <div>
    <div class="slider">
      <div class="slider-slides">
        <div
            v-for="(qType,i) in qTypes" :key="qType"
            class="slider-slide"
            :data-slide-index="i"
            data-slide-active=false
            data-liked=false
            :data-car="twoCars[0]"
          >
            <div class="overlay"></div>
            <NiroCard :q-type="qType" :car="twoCars[0]" />
          </div>
        <div
          v-for="(qType,i) in qTypes" :key="qType + i"
          class="slider-slide"
          :data-slide-index="i+8"
          data-slide-active=false
          data-liked=false
          :data-car="twoCars[1]"
        >
          <div class="overlay"></div>
          <NiroCard :q-type="qType" :car="twoCars[1]" />
        </div>
        <div class="slider-slide" data-slide-index="16" data-slide-active=false data-liked=false :data-car="twoCars[0]">
          <div class="overlay"></div>
          <NiroCard :q-type="userPriority(1)" :car="twoCars[0]" />
        </div>
        <div class="slider-slide" data-slide-index="17" data-slide-active=false data-liked=false :data-car="twoCars[1]">
          <div class="overlay"></div>
          <NiroCard :q-type="userPriority(1)" :car="twoCars[1]" />
        </div>
        <div class="slider-slide" data-slide-index="18" data-slide-active=false data-liked=false :data-car="twoCars[0]">
          <div class="overlay"></div>
          <NiroCard :q-type="userPriority(2)" :car="twoCars[0]" />
        </div>
        <div class="slider-slide" data-slide-index="19" data-slide-active=false data-liked=false :data-car="twoCars[1]">
          <div class="overlay"></div>
          <NiroCard :q-type="userPriority(2)" :car="twoCars[1]" />
        </div>
      </div>
      <div class="slider-nav">
        <div :class="{fantom: activeIndex===0}" class="slider-nav-prev" @click="prevSlide"><bt /></div>
        <div @click="toggleLike(activeIndex)"><like-bt/></div>
        <div :class="{fantom: activeIndex===maxSlides-1}" class="slider-nav-next" @click="nextSlide"><bt /></div>
      </div>
    </div>
    <div class="tuto">
      <div class="content">
        <h4>À vous le dernier mot&nbsp;!</h4>
        <p>Pour affiner votre choix, faites défiler les propositions<br>et «&#8239;likez&#8239;» celles qui vous correspondent le mieux.</p>
        <figure><img src="~/assets/images/picto-affinez@2x.png" alt="principe slider"></figure>
        <div class="cta" @click="closeTuto">C'est parti</div>
      </div>
    </div>
  </div>
</template>


<script>
import gsap , {Expo} from 'gsap'
import {removeNode} from "vuedraggable/src/util/helper";
import Emitter from '~/assets/js/Emitter'
import SwipeEvents from "assets/js/utils/SwipeEvents";

export default {
  components: {
  },
  data () {
    return {
      qTypes: ['kmByDay', 'kmByYear', 'voyagesOver400km', 'frequenceVille', 'frequenceExtraUrbain', 'frequenceAutoroute', 'rechargeDomicile', 'rechargeBorne'],
      activeIndex: 4,
      maxSlides: 2,
      statusLike: false,
      sliderOptions: {
        timing: 0.5,
        ease: Expo.easeOut,
        particules: null,
      },
      evScore: 0,
      phevScore:0,
      hevScore:0,
      swipeInstance: null,
      twoCars: this.$store.state.twoCars
    }
  },
  head() {
    return {
      bodyAttrs: {
        class: 'affinez'
      }
    }
  },
  computed: {
  },
  created(){
    if(this.twoCars.length===0) {
      this.twoCars = getCookie('twoCars').split(',')
      this.$store.commit('setTwoCars', this.twoCars)
    }
  },
  mounted(){
    const slides = document.querySelectorAll('.slider-slide')

    this.maxSlides = slides.length
    this.activeIndex = this.maxSlides/2

    // mix les slides
    for(let i=0; i< this.maxSlides; i++){
      const target1 = Math.floor(Math.random() * this.maxSlides -1) + 1;
      const target2 = Math.floor(Math.random() * this.maxSlides -1) + 1;
      slides[target1].before(slides[target2]);
    }
    // reattribute des data
    document.querySelectorAll('.slider-slide').forEach((s, index)=> {
      s.dataset.slideIndex = ''+index;
      s.dataset.slideActive =  (index === this.maxSlides/2 ) ? 'true' : 'false';
      s.dataset.liked = 'false';
      s.classList.remove('active')
    })
    document.querySelector('.slider-slide[data-slide-active="true"]').classList.add('active')


    const activeSlide = slides[this.activeIndex];
    activeSlide.dataset.slideActive = true

    if(!getCookie('tutoShown')){
      gsap.to('.tuto', {scale:1,opacity:1, duration:0.5, ease:Expo.easeOut})
      setCookie('tutoShow', true, 10)
    }
    // this.particules = new Emitter();
    //
    const swipeTouch = new SwipeEvents()
    this.swipeInstance = swipeTouch

    document.addEventListener('touchstart', swipeTouch.handleTouchStart, false);
    document.addEventListener('touchmove', this.swipe, false);

  },
  methods:{
    userPriority(priority){
      return this.$store.state.user.conduite.priority['p'+priority]
    },
    closeTuto(){
      gsap.to('.tuto', {scale:0, opacity:0,duration:0.5, ease:Expo.easeOut})
    },
    swipe(e){
      const r = this.swipeInstance.handleTouchMove(e)
      if(r === 'left'){
        this.nextSlide()
      } else if(r === 'right'){
        this.prevSlide()
      }
    },
    //
    toggleLike(index){
      const slide = document.querySelector('.slider-slide:nth-of-type(' + (index+1) +')')

      if(slide.dataset.liked==="true") {
        slide.dataset.liked = 'false'
        this.$store.commit('decrementCarLikes', slide.dataset.car)
        this.stopParticules()
      } else {
        slide.dataset.liked = 'true';
        this.startParticules(index)
        this.$store.commit('incrementCarLikes', slide.dataset.car)
      }
      //
      if(this.$store.state.evLikes>=3){
        setCookie('match', 'ev')
        this.$router.push({path: '/votre-match', params:{car: 'ev'}})
        this.$store.commit('setTheMatch', 'ev')
        this.stopParticules()
      }
      else if(this.$store.state.phevLikes>=3){
        setCookie('match', 'ev')
        this.$router.push({path: '/votre-match', params:{car: 'phev'}})
        this.$store.commit('setTheMatch', 'phev')
        this.stopParticules()
      }
      else if(this.$store.state.hevLikes>=3){
        setCookie('match', 'hev')
        this.$router.push({path:'/votre-match', params:{car: 'hev'}})
        this.$store.commit('setTheMatch', 'hev')
        this.stopParticules()
      }
    },
    startParticules(index){
      const slide = document.querySelector('.slider-slide:nth-of-type(' + (index+1) +')')
      document.querySelector('#emitter').classList.add('liked')

      slide.dataset.liked = 'true'
      this.particules = new Emitter();
      this.particules.startAnim()
    },
    stopParticules(){
      this.particules = null
      document.querySelector('#emitter').classList.remove('liked')

      gsap.to('.dot',  {
        duration: 1,
        opacity:0,onComplete: ()=>{
          document.querySelectorAll('.dot').forEach(elem=>removeNode(elem))
        }
      });
    },
    //
    prevSlide(){
      const elem = document.querySelector('.slider-slide.active');
      const styles = window.getComputedStyle(elem)
      const decal = elem.offsetWidth + parseFloat(styles.marginLeft) + parseFloat(styles.marginRight)

      if(this.activeIndex>=1 ){
        if(!gsap.isTweening('.slider-slides')){
          const prevTween = gsap.to('.slider-slides', {x: '+='+decal, ease:this.sliderOptions.ease, duration: this.sliderOptions.timing})
          prevTween.play();
          --this.activeIndex;

          document.querySelectorAll('.slider-slide[data-slide-index]:not([data-slide-index="'+this.activeIndex+'"])').forEach(s=>{s.classList.remove('active')})
          document.querySelector('.slider-slide[data-slide-index="'+this.activeIndex+'"]').classList.add('active')

          if(document.querySelector('.slider-slide:nth-of-type(' + (this.activeIndex + 1) +')').dataset.liked === 'true'){
            this.startParticules(this.activeIndex)
          } else {
            this.stopParticules()
          }
        }
      } else {
        this.activeIndex = 0
      }
    },
    nextSlide(){
      const elem = document.querySelector('.slider-slide.active');
      const styles = window.getComputedStyle(elem)
      const decal = elem.offsetWidth + parseFloat(styles.marginLeft) + parseFloat(styles.marginRight)



      if(this.activeIndex<this.maxSlides-1){
        if(!gsap.isTweening('.slider-slides')){
          const nextTween = gsap.to('.slider-slides', {x: '-='+decal, ease:this.sliderOptions.ease, duration: this.sliderOptions.timing})
          nextTween.play();
          ++this.activeIndex;

          document.querySelectorAll('.slider-slide[data-slide-index]:not([data-slide-index="'+this.activeIndex+'"])').forEach(s=>{s.classList.remove('active')})
          document.querySelector('.slider-slide[data-slide-index="'+this.activeIndex+'"]').classList.add('active')

          if(document.querySelector('.slider-slide:nth-of-type(' + (this.activeIndex+1) +')').dataset.liked === 'true'){
            this.startParticules(this.activeIndex)
          } else {
            this.stopParticules()
          }
        }
      } else {
        this.activeIndex = this.maxSlides-1
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
  }
}
</script>
<style lang="scss">
.slider {
  position: absolute;
  top:50%;
  transform: translate3d(-50%, -50%, 0);
  width:100vw;
  //overflow:hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  &-slides{
    display: flex;
    flex-direction: row;
  }
  &-slide {
    position: relative;
    width:350px;
    transform: translate3d(-195px, 0, 0);
    margin:0 20px;
    //box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
    .overlay {
      position: absolute;
      top:0;left:0;width:100%;height:100%;
      background-color: rgba(42,32,24,0.85);
      z-index:1000;
    }
    &.active {
      .overlay {
        opacity:0;
        z-index: 0;
      }
      .nirocard{
        background-color: #FFF;
        color: black;

        .content {
          &:after {
            background: linear-gradient(0deg, rgba(255, 255, 255, 1) 10%, rgba(255, 255, 255, 0) 100% );
          }
          .picto {
            svg {
              path {
                fill: black;
              }
            }
          }
        }
      }
    }

    @media screen and (max-width:640px){
      margin:0 5px;
      transform: translate3d(-180px, 0, 0);
    }


  }
  &-nav {
    display:flex;
    justify-content: space-between;
    align-items: center;
    width: 350px;
    padding:10px 0;

    .fantom {
      opacity:0;
      cursor:pointer;
      pointer-events: none;
    }

    &-prev{
      transform: rotate(180deg);
      .bt {
        cursor: pointer !important;
      }
    }

    &-next{
      .bt {
        cursor: pointer !important;
      }
    }
  }
}
.tuto {
  background-color: rgba(45, 36, 32, 0.9);
  position:absolute;
  top:0;  left:0; width:100vw;height:100vh;
  z-index: 5000;
  transform: scale(0);
  opacity:0;
  .content {
    position:absolute;
    top:50%;
    left:50%;
    width:60%;
    max-width:640px;
    transform: translate3d(-50%, -50%, 0);
    @media screen and(max-width: 640px) {
      transform: translate3d(-50%, calc(-50% - 50px), 0);
      figure {
        margin: 40px auto 60px !important;
      }
    }
    h4{
      font-size: 36px;
      color:#FFFFFF;
      margin-bottom: 20px;
    }
    figure {
      width:145px;
      margin: 40px auto 100px;
      img {
        width:100%;
        height: auto;
      }
    }

  }

}
</style>
