<template>
  <div class="index">
    <PopinML></PopinML>
    <CookieControl v-if="showCookieComponent===1" locale="fr"/>
    <div class="home-bg"></div>
    <div class="loading">
      <div class="loading-black"></div>
      <div class="loading-full"></div>
      <div class="loading-white"></div>
      <div class="coup-de-foudre"></div>
    </div>
    <div class="loadText">
      <h3>Rencontrez<br>votre Kia Niro idéal</h3>
    </div>
    <div class="home">
      <p>
        <strong>
          En version hybride, hybride rechargeable ou&nbsp;100&nbsp;%&nbsp;électrique,<br>
          découvrez le partenaire qui vous correspond vraiment en quelques étapes.
        </strong>
      </p>
        <NuxtLink class="cta" to="/vos-habitudes">Commencer</NuxtLink>
    </div>
    <div class="links">
      <div @click="popinML">Mentions légales</div>
    </div>
  </div>

</template>

<script>
import gsap, {Linear, Expo} from 'gsap'
export default {
  name: 'IndexPage',
  data(){
    return {
      showCookieComponent: 0,
    }
  },
  mounted() {
    setTimeout(()=>{this.showCookieComponent=1;}, 8000)
    const tl = gsap.timeline({});
    const loaderTiming = 2;
    gsap.set('.loading-white, .home p, .home .cta, .loading .coup-de-foudre', {opacity: 0})
    gsap.set('.loading-white', {opacity: 0})
    gsap.set('.home-bg', {scale: 1.15})
    gsap.set('.loading-full', {
      WebkitMaskPosition: '70% 0%'
    })
    tl.to('.loading-full', {WebkitMaskPosition: '30% 0%', duration: loaderTiming, delay: 0, ease: Linear.easeNone});

    tl.to('.loading-black', {opacity: 0, duration: 0})
    tl.to('.loading', {top: 180, duration: 2, ease: Expo.easeInOut}, loaderTiming + 0.5);
    tl.to('.loadText', {opacity: 0, y: 100, duration: 2, ease: Expo.easeInOut}, loaderTiming + 0.5);

    tl.to('.loading-full', {opacity: 0, duration: 1}, loaderTiming + 1.5)
    tl.to('.loading-white', {opacity: 1, duration: 1}, loaderTiming + 1.5)
    tl.to('.loading .coup-de-foudre', {opacity: 1, duration: 1}, loaderTiming + 2.5);

    tl.fromTo('.home-bg', {opacity: 0}, {opacity: 1, duration: 2}, loaderTiming + 1.5);
    tl.to('.home-bg', {scale: 1, duration: 20}, loaderTiming + 1.5);

    tl.to('.home p', {opacity: 1, duration: 1}, +loaderTiming + 2.5);
    tl.to('.home .cta', {opacity: 1, duration: 1.5}, loaderTiming + 3.5);


  },
  methods: {
    popinML(){
      document.querySelector('.popin').classList.add('visible');
    }
  }
}
</script>

<style lang="scss">
.index{
  position:absolute;
  height: 100vh;
  width: 100%;
  overflow: hidden;
}
.home {
  position: absolute;
  display:flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  text-align: center;
  width: 100%;
  height: calc(100vh - 50px);
  z-index: 10;

  p {
    color: #FFF;
    font-size:1.8em;
    text-shadow: 0 0 10px rgba(0, 0, 0, 0.8);
  }


  @media screen and (max-width: 640px){
    width:90%;
    height: calc(100vh - 100px);
    margin: 0 5%;
    p {
      font-size: 1em;
    }
  }


}


.home-bg {
  position:absolute;
  opacity: 0;
  width:100%;
  height:100vh;
  background-color: #000;
  background-image: url(~assets/images/home@2x.jpg);
  background-repeat: no-repeat;
  background-size: cover;
  @media only screen and (max-width: 640px) {
    background-image: url(~assets/images/home-mobile@2x.jpg);
    background-size: 230%;
    background-position: 27% 0;
  }
}
.loading{
  position:absolute;
  width:500px;
  height: 250px;
  top:calc(50% - 95px) ;left:50%;
  transform: translate3d(-250px, -125px, 0);

  &-black, &-white, &-full, .coup-de-foudre {
    position:absolute;
    top:50%;
    transform: translate3d(0, -50%, 0);
    width: 100%;
    height: 250px;
    background-size: contain;
    @media only screen and (max-width : 640px) {
      background-size: contain;
    }
    background-position: center center;
    background-repeat: no-repeat;
  }

  &-black{
    background-image: url('~assets/images/loader-black@2x.png');
    z-index: 1;
  }
  &-full{
    background-image: url('~assets/images/loader-full@2x.png');
    mask-image: url('~assets/images/loader-mask@2x.png');
    mask-position: -500px 0%;
    z-index: 2;
  }
  .coup-de-foudre {
    background-image: url('~assets/images/coup-de-foudre@2x.png');
    z-index: 4;
  }
  &-white{
    background-image: url('~assets/images/loader-white@2x.png');
    z-index: 3;
  }
  .logoblanc {
    position: absolute;
    opacity: 1;
    top: 50%;
    left:50%;
    transform: translate3d(-50%, -40%, 0);
    z-index:3;
  }

  @media screen and (max-width: 640px) {
    width:360px;
    margin: 0 auto;
    transform: translate3d(-180px, -125px, 0);
  }

}
.loadText{
  position:absolute;
  width:100%;
  bottom:150px;
  color: #fff;
  font-size: 24px;
  text-align: center;
  margin-bottom: 20px;
}

.loading-anim {
    position: absolute;
    width: 100vw;
    height: 100vh;
}


.cookieControl__ModalContent{
  max-width: 500px;
  overflow-y : auto;
  h3{
    text-shadow:none;
    text-align: left;
    font-family: "Kia Signature Fix Bold", serif;
    margin: 25px 0;
  }
  .cookieControl__ModalButtons {
    justify-content: center;
  }
  ul {}
  ul ul {
    padding-top: 1em;
  }
  li {
    display: inline;
    color:#222;
    &+li {
      padding-left: .75em;
      position:relative;
      &:before {
        position:absolute;
        content:',';
        left:0;
      }
    }
  }

  @media screen and (max-width: 768px) {
    position: absolute;
    width:90%;
    height:100vh;
    top:0;
    left:50%;
    right:unset;
    bottom:unset;
    transform: translate3d(-50%, 0, 0);
    .cookieControl__ModalButtons {
      margin-top: 30px;
    }
  }
}
.links {
  position:absolute;
  right:50px;
  bottom:20px;
  font-size:14px;
  color:#FFF;
  div {
    cursor: pointer;
  }
}
</style>
