<template>
  <div class="nav">
    <bt v-if="activeStep!==1 " :class="{active: true,   'nav-prev':true}" @click.native="prevStep"></bt>
    <bt v-if="activeStep!==6"  :class="{active: isBtActive,'nav-next':true}" @click.native="nextStep"></bt>
  </div>
</template>
<script>

import gsap from "gsap";
import ScrollToPlugin from 'gsap/ScrollToPlugin'
import EventBus from "assets/js/utils/event-bus";
gsap.registerPlugin(ScrollToPlugin)

export default {
  data: () => {
    return {
    }
  },
  computed: {
    activeStep(){
      return this.$store.state.activeStep;
    },
    isBtActive(){
      return this.$store.state.btActive;
    },
  },
  mounted() {
    EventBus.$on('IS_BT_ACTIVE', (bool) => {
      this.$store.commit('activeNextButton', bool)
    })
  },
  methods: {

    prevStep() {
      gsap.to(document.querySelector('.container'), {scrollTo:0, duration:.5})
      this.$store.commit('decrement', this.activeStep);
      this.$store.commit('activeNextButton', true)
    },
    nextStep() {
      gsap.to(document.querySelector('.container'), {scrollTo:0, duration:.5})
      if(this.isBtActive){
        this.$store.commit('increment', this.activeStep);
        this.$store.commit('activeNextButton', ((this.activeStep === 2 || this.activeStep === 4 || this.activeStep === 5) || (this.activeStep===3 && this.$store.state.user.conduite.frequenceAutoroute!=="" && this.$store.state.user.conduite.frequenceExtraUrbain!=="" && this.$store.state.user.conduite.frequenceVille!=="")))
      }
    }
  }
}
</script>
