<template>
  <div>
    <h3 v-html="title"></h3>
    <div class="content">
      <ToggleRadioButton id="domicile" :value="progressValueDomicile" label="Prise à domicile ou installation possible"></ToggleRadioButton>
      <ToggleRadioButton id="borne" :value="progressValueBorne" label="Borne de rechargement à proximité"></ToggleRadioButton>
    </div>
    <NavButtons></NavButtons>
  </div>
</template>

<script>

import EventBus from "assets/js/utils/event-bus";
import ToggleRadio from "assets/js/ToggleRadio";

export default {
  data(){
    return {
      progressValueDomicile:0,
      progressValueBorne:0,
      title: 'Accès à la recharge',
    }
  },
  mounted() {
    console.log(new ToggleRadio(document.querySelector('#domicile'), { }));
    console.log(new ToggleRadio(document.querySelector('#borne'), { }));
    EventBus.$on("DRAGEND", (obj)=> {

      if (obj.eventType === 'onDragEndRecharge') {
        if(obj.elemId === 'domicile'){
          this.progressValueDomicile = obj.value;
          this.$store.commit('user/updateConduite', {...this.$store.state.user.conduite, rechargeDomicile:obj.value})
        }
        if(obj.elemId === 'borne'){
          this.progressValueBorne = obj.value;
          this.$store.commit('user/updateConduite', {...this.$store.state.user.conduite, rechargeBorne:obj.value})
        }
      }
    })
  },
}
</script>
<style lang="scss">

</style>
