<template>
  <div class="kia">
    <div class="container">
      <LogoKia />
      <Nuxt />
    </div>
    <ExitPopin />
  </div>
</template>
<script>

import iNoBounce from 'inobounce';
import '~/assets/js/utils/Cookie'

export default {
  data(){
    return {

    }
  },
  mounted() {
   iNoBounce.enable();
   if(this.$route.query.source){
     this.$store.commit('setSource', this.$route.query.source)
   }
  }


}
</script>
<style lang="scss">
.kia {
  position: relative;
  background-image: url('~assets/images/bg-desktop@2x.jpg');
  background-size: cover;
  background-position: center top;
  background-repeat: no-repeat;
  height: 100%;
  min-height: 100vh;
}
</style>
