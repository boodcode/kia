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
            :data-qtype="qType"
          >
            <div class="overlay"></div>
            <NiroCard :q-type="qType" :car="twoCars[0]"  />
          </div>
        <div
          v-for="(qType,i) in qTypes" :key="qType + i"
          class="slider-slide"
          :data-slide-index="i+8"
          data-slide-active=false
          data-liked=false
          :data-car="twoCars[1]"
          :data-qtype="qType"
        >
          <div class="overlay"></div>
          <NiroCard :q-type="qType" :car="twoCars[1]"  />
        </div>
        <div class="slider-slide" data-slide-index="16" data-slide-active=false data-liked=false :data-car="twoCars[0]" :data-qtype="userPriority(1)">
          <div class="overlay"></div>
          <NiroCard :q-type="userPriority(1)" :car="twoCars[0]" />
        </div>
        <div class="slider-slide" data-slide-index="17" data-slide-active=false data-liked=false :data-car="twoCars[1]" :data-qtype="userPriority(1)">
          <div class="overlay"></div>
          <NiroCard :q-type="userPriority(1)" :car="twoCars[1]" />
        </div>
        <div class="slider-slide" data-slide-index="18" data-slide-active=false data-liked=false :data-car="twoCars[0]" :data-qtype="userPriority(2)">
          <div class="overlay"></div>
          <NiroCard :q-type="userPriority(2)" :car="twoCars[0]" />
        </div>
        <div class="slider-slide" data-slide-index="19" data-slide-active=false data-liked=false :data-car="twoCars[1]" :data-qtype="userPriority(2)">
          <div class="overlay"></div>
          <NiroCard :q-type="userPriority(2)" :car="twoCars[1]" />
        </div>
      </div>
      <div class="slider-nav">
        <div class="slider-nav-prev" @click="prevSlide"><bt /></div>
        <div @click="toggleLike(activeIndex)"><like-bt/></div>
        <div class="slider-nav-next" @click="nextSlide"><bt /></div>
      </div>
    </div>
    <div class="tuto">
      <div class="content">
        <h4>À vous le dernier mot&nbsp;!</h4>
        <p>Pour affiner votre choix, faites défiler les propositions<br>et «&#8239;likez&#8239;» celles qui vous correspondent le mieux.</p>
        <p>Votre motorisation idéale appaitra au bout de minimum 3 likes...</p>
        <figure><img src="~/assets/images/picto-affinez@2x.png" alt="principe slider"></figure>
        <div class="cta" @click="closeTuto">C'est parti</div>
      </div>
    </div>
  </div>
</template>


<script>

import gsap , {Expo} from 'gsap'
import {removeNode} from "vuedraggable/src/util/helper";
import SmoothScrollbar from '~/assets/js/utils/vue-smooth-scrollbar'

import Emitter from '~/assets/js/Emitter'
import SwipeEvents from "assets/js/utils/SwipeEvents";
import EventBus from "assets/js/utils/event-bus";



export default {
  components: {
  },
  data () {
    return {
      qTypes: ['kmByDay', 'kmByYear', 'voyagesOver400km', 'frequenceVille', 'frequenceExtraUrbain', 'frequenceAutoroute', 'rechargeDomicile', 'rechargeBorne'],
      activeIndex: 4,
      maxSlides: 2,
      intentDirection: 'next',
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
      twoCars: this.$store.state.twoCars,
      autoAnimAfterLike: false,
      clonedSlidesLength:6,
      textCards:null
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
    fetch('/cards.json')
      .then(r => r.json())
      .then(json => {
        this.textCards = json
        // clone pour le infinite slider
        this.clone(3)
      })
  },
  mounted(){
    // this.$cookie.modal = true;

    const slides = document.querySelectorAll('.slider-slide')
    this.maxSlides = slides.length
    this.activeIndex = this.maxSlides/2

    // mix les slides
    this.mixSlides(slides)

    //
    const activeSlide = slides[this.activeIndex];
    activeSlide.dataset.slideActive = true
    //
    if(!getCookie('tutoShown')){
      gsap.to('.tuto', {scale:1,opacity:1, duration:0.5, ease:Expo.easeOut})
      setCookie('tutoShow', true, 10)
    }
    //
    const swipeTouch = new SwipeEvents()
    this.swipeInstance = swipeTouch

    document.addEventListener('touchstart', swipeTouch.handleTouchStart, false);
    document.addEventListener('touchmove', this.swipe, false);

    //
    EventBus.$on("EMITTER_END", this.nextSlideAfterAnim)

    //


  },
  updated(){
  },
  methods:{

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
    clone(n){
      const slider = document.querySelector('.slider-slides')
      const first = slider.querySelector('.slider-slide:nth-child(1)')
      const last = slider.querySelector('.slider-slide:nth-child('+this.maxSlides+')')
      const arrClonesFirsts = []
      const arrClonesLasts = []


      for(let i=0; i<n; i++){
        const tempFirst = slider.querySelector('.slider-slide:nth-child(' + (i+1) + ')')
        const tempLast = slider.querySelector('.slider-slide:nth-child(' + (this.maxSlides - (n-1) + i) + ')')
        //
        const cloneFirst = tempFirst.cloneNode(true)
        cloneFirst.dataset.slideIndex = 1000;
        //
        const qFirst = this.getQuestion(cloneFirst.dataset.qtype, cloneFirst.dataset.car)
        const rFirst = this.getReponse(cloneFirst.dataset.qtype, cloneFirst.dataset.car)
        cloneFirst.querySelector('.scroll-content').innerHTML = '<h4>'+qFirst+'</h4><p>'+rFirst+'</p>'
        //
        const cloneLast = tempLast.cloneNode(true)
        cloneLast.dataset.slideIndex = 1000
        //
        const qLast = this.getQuestion(cloneLast.dataset.qtype, cloneLast.dataset.car)
        const rLast = this.getReponse(cloneLast.dataset.qtype, cloneLast.dataset.car)
        console.log(qLast, rLast)
        cloneLast.querySelector('.scroll-content').innerHTML = '<h4>'+qLast+'</h4><p>'+rLast+'</p>'
        //
        arrClonesFirsts.push(cloneFirst)
        arrClonesLasts.push(cloneLast)
        //
      }
      for(let i=0; i<n; i++){
        first.before(arrClonesLasts[i])
      }
      for(let i=0; i<n; i++){
        last.after(arrClonesFirsts[(n-1)-i])
      }
    },
    mixSlides(slides){
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
    },
    //
    nextSlideAfterAnim(){
      if(this.intentDirection==='next'){
        if(this.autoAnimAfterLike){
          setTimeout(this.nextSlide(), 1000)
        }
      } else if(this.intentDirection==='prev') {
        if (this.autoAnimAfterLike) {
          setTimeout(this.prevSlide(), 1000)
        }
      }
    },
    //
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
      // console.log(this.activeIndex, index)
      const slide = document.querySelector('.slider-slide[data-slide-index="'+index+'"]')

      if(slide.dataset.liked==="true") {
        slide.dataset.liked = 'false'
        this.$store.commit('decrementCarLikes', slide.dataset.car)
        this.stopParticules()
      } else {
        slide.dataset.liked = 'true';
        this.startParticules(index)
        this.autoAnimAfterLike= true;
        this.$store.commit('incrementCarLikes', slide.dataset.car)
      }
      //
      //
      if(this.$store.state.evLikes>=3){
        setCookie('match', 'ev')
        this.$router.push({path: '/votre-match', params:{car: 'ev'}})
        this.$store.commit('setTheMatch', 'ev')
        this.stopParticules()
        this.autoAnimAfterLike = false
      }
      else if(this.$store.state.phevLikes>=3){
        setCookie('match', 'phev')
        this.$router.push({path: '/votre-match', params:{car: 'phev'}})
        this.$store.commit('setTheMatch', 'phev')
        this.stopParticules()
        this.autoAnimAfterLike = false
      }
      else if(this.$store.state.hevLikes>=3){
        setCookie('match', 'hev')
        this.$router.push({path:'/votre-match', params:{car: 'hev'}})
        this.$store.commit('setTheMatch', 'hev')
        this.stopParticules()
        this.autoAnimAfterLike = false
      }
    },
    startParticules(index){
      const slide = document.querySelector('.slider-slide[data-slide-index="'+index+'"]')
      document.querySelector('#emitter').classList.add('liked')

      slide.dataset.liked = 'true'
      this.particules = new Emitter();
      this.particules.startAnim()
      // this.autoAnimAfterLike = true
    },
    stopParticules(){
      this.particules = null
      this.autoAnimAfterLike = false
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
      this.intentDirection = 'prev';
      this.autoAnimAfterLike = false
      const slider = document.querySelector('.slider-slides')
      const elem = document.querySelector('.slider-slide.active');
      const styles = window.getComputedStyle(elem)
      const decal = elem.offsetWidth + parseFloat(styles.marginLeft) + parseFloat(styles.marginRight)

      if(this.activeIndex>=1 ){
        if(!gsap.isTweening('.slider-slides')){
          const prevTween = gsap.to('.slider-slides', {x: '+='+decal, ease:this.sliderOptions.ease, duration: this.sliderOptions.timing})
          prevTween.play();
          --this.activeIndex;
          //
          this.initSlideAfterMove()
        }
      } else {
        this.activeIndex = this.maxSlides
        const sliderWidth = slider.getBoundingClientRect().width
        gsap.set(slider, {x:'-='+(sliderWidth  - decal*(this.clonedSlidesLength))})
        //
        this.prevSlide()
      }
    },
    nextSlide(){
      this.intentDirection = 'next'
      this.autoAnimAfterLike = false
      const slider = document.querySelector('.slider-slides')
      const elem = document.querySelector('.slider-slide.active');
      const styles = window.getComputedStyle(elem)
      const decal = elem.offsetWidth + parseFloat(styles.marginLeft) + parseFloat(styles.marginRight)
      //
       if(this.activeIndex<this.maxSlides-1){
        if(!gsap.isTweening('.slider-slides')){
          const nextTween = gsap.to('.slider-slides', {x: '-='+decal, ease:this.sliderOptions.ease, duration: this.sliderOptions.timing})
          nextTween.play();
          ++this.activeIndex;
          //
          this.initSlideAfterMove()
        }
       } else {
         this.activeIndex = -1
         const sliderWidth = slider.getBoundingClientRect().width
         gsap.set(slider, {x:'+='+(sliderWidth  - decal*(this.clonedSlidesLength))})
         //
         this.nextSlide()
       }
    },
    initSlideAfterMove(){
      document.querySelectorAll('.slider-slide[data-slide-index]:not([data-slide-index="'+this.activeIndex+'"])').forEach(s=>{s.classList.remove('active')})
      document.querySelector('.slider-slide[data-slide-index="'+this.activeIndex+'"]').classList.add('active')
      //
      if(document.querySelector('.slider-slide[data-slide-index="'+this.activeIndex+'"]').dataset.liked === 'true'){
        this.startParticules(this.activeIndex)
      } else {
        this.stopParticules()
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

    .nirocard {

    }


    &.active {
      .nirocard {

      }
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

/*    .fantom {
      opacity:0;
      cursor:pointer;
      pointer-events: none;
    }*/

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
    width:70%;
    max-width:640px;
    transform: translate3d(-50%, -50%, 0);
    @media screen and(max-width: 640px) {
      width:90%;
      transform: translate3d(-50%, calc(-50% - 50px), 0);
      figure {
        margin: 30px auto 20px !important;
      }
    }
    h4{
      font-size: 36px;
      color:#FFFFFF;
      margin-bottom: 20px;
    }
    figure {
      width:145px;
      margin: 30px auto 60px;
      img {
        width:100%;
        height: auto;
      }
    }

  }

}
</style>
