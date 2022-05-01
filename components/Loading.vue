<template>
  <div class="loading-cpt" >
    <div class="loading-cpt-black"></div>
    <div v-if="routename === 'votre-match'" class="loading-cpt-votrecoupdefoudre"></div>
    <div class="loading-cpt-full"></div>
  </div>
</template>
<script>
import gsap, {Linear} from "gsap";
import EventBus from "assets/js/utils/event-bus";

export default {
  props:[
    'time'
  ],
  data(){
    return {
      routename: this.$route.name
    }
  },
  mounted() {
    const tlLoad = gsap.timeline({});
    const time = this.time;
    gsap.set('.loading-cpt-full', { WebkitMaskPosition: '80% 0%' })

    tlLoad.to('.loading-cpt-full', { WebkitMaskPosition: '25% 0%', duration: time, ease: Linear.easeNone });
    if(this.$route.name === 'votre-match') {
      tlLoad.to('.loading-cpt-votrecoupdefoudre', {opacity: 1, duration: time, ease: Linear.easeNone});
      tlLoad.to('.loading-cpt-votrecoupdefoudre', {
        scale: 1.2,
        opacity: 0,
        duration: 0.5,
        ease: Linear.easeNone,
        onComplete: this.complete
      }, parseInt(time) + 4);
    }
    tlLoad.to('.loading-cpt-black', {opacity:0, duration:1}, time)
    tlLoad.to('.loading-cpt-full', { scale: 1.2, opacity:0, duration: 0.5, ease: Linear.easeNone, onComplete: this.complete }, parseInt(time)+4);
  },
  methods: {
    complete() {
      EventBus.$emit('LOAD_REVEAL_COMPLETE');
    }
  }
}
</script>

<style lang="scss">

.loading-cpt{
  position:absolute;
  width:500px;
  height: 250px;
  top:400px;
  left:50%;
  transform: translate3d(-250px, -125px, 0);

  &-black, &-full, &-votrecoupdefoudre {
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
  &-votrecoupdefoudre{
    opacity: 0;
    background-image: url('~assets/images/votrecoupdefoudre@2x.png');
    z-index: 1;
  }
  &-full{
    background-image: url('~assets/images/loader-full@2x.png');
    mask-image: url('~assets/images/loader-mask@2x.png');
    mask-position: -500px 0%;
    z-index: 2;
  }
  @media screen and (max-width: 640px) {
    width:360px;
    margin: 0 auto;
    transform: translate3d(-180px, -125px, 0);
  }

}

</style>
