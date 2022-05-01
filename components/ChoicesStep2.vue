<template>
  <div>
    <h3 v-html="title"></h3>
    <div class="content">
      <circle-voyages id="voyages" :valuestep2="progressValueStep2"></circle-voyages>
    </div>
    <NavButtons></NavButtons>
  </div>
</template>

<script>
  import VoyagesSlider from "assets/js/VoyagesSlider";
  import EventBus from "assets/js/utils/event-bus";

export default {
  data(){
    return {
      title: 'Faites-vous des voyages de plus de 400 km ?',
      progressValueStep2: 0,
    }
  },
  mounted() {
    console.log(new VoyagesSlider(document.querySelector('#voyages'), {endRangeValue: 100 }));

    this.progressValueStep2 = 0;

    EventBus.$on("DRAGEND_CHOICE2", (obj)=> {
      this.progressValueStep2 = obj.valueStep2;

      if(obj.eventType==='onDragEndVoyages'){
        let value='';
        if(obj.valueStep2 >= 0 && obj.valueStep2 <40){
          value = 'Rarement';
        } else if(obj.valueStep2 >=40 &&  obj.valueStep2 <60 ){
          value = 'De temps en temps';
        } else if(obj.valueStep2 >=60){
          value = 'Souvent';
        }
        this.$store.commit('user/updateConduite', {...this.$store.state.user.conduite, voyagesOver400km: value})
      }

    });
  },
}
</script>
<style lang="scss">

</style>
