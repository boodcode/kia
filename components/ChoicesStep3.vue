<template>
  <div>
    <h3 v-html="title"></h3>
    <div class="content">
      <slider-frequence id="frequenceVille" type="En ville" :value="progressValueVille"></slider-frequence>
      <slider-frequence id="frequenceAutoroute" type="Sur autoroute" :value="progressValueAutoroute"></slider-frequence>
      <slider-frequence id="frequenceExtraUrbain" type="En extra urbain" :value="progressValueExtraUrbain"></slider-frequence>
    </div>
    <NavButtons></NavButtons>
  </div>
</template>
<script>
import VerticalSlider from "assets/js/VerticalSlider";
import EventBus from "assets/js/utils/event-bus";

export default {
  data(){
    return {
      progressValueVille:'',
      progressValueAutoroute:'',
      progressValueExtraUrbain:'',
      title: 'À quelle fréquence vous déplacez&#8209;vous ?',
    }
  },
  mounted() {
    console.log(new VerticalSlider(document.querySelector('#frequenceVille'), {endRangeValue: 100 }));
    console.log(new VerticalSlider(document.querySelector('#frequenceAutoroute'), {endRangeValue: 100 }));
    console.log(new VerticalSlider(document.querySelector('#frequenceExtraUrbain'), {endRangeValue: 100 }));

    EventBus.$on("DRAGEND_CHOICE3", (obj)=> {
      if(obj.eventType==='onDragFrequence'){
        let value='';
        if(obj.value < 10){
          value = '';
        } else if(obj.value >= 10 && obj.value <50 ){
          value = 'Parfois';
        } else if(obj.value >= 50 && obj.value <80 ){
          value = 'Régulièrement';
        } else if(obj.value >= 80 ){
          value = 'Souvent';
        }

        if(obj.elemId === 'frequenceVille'){
          this.$store.commit('user/updateConduite', {...this.$store.state.user.conduite, frequenceVille:value})
          this.progressValueVille = value;
        }
        if(obj.elemId === 'frequenceAutoroute'){
          this.$store.commit('user/updateConduite', {...this.$store.state.user.conduite, frequenceAutoroute:value})
          this.progressValueAutoroute = value;
        }
        if(obj.elemId === 'frequenceExtraUrbain'){
          this.$store.commit('user/updateConduite', {...this.$store.state.user.conduite, frequenceExtraUrbain:value})
          this.progressValueExtraUrbain = value;
        }

        EventBus.$emit("IS_BT_ACTIVE", (this.progressValueExtraUrbain !=="" && this.progressValueVille !=="" && this.progressValueAutoroute !==""))

      }
    });
  },
}
</script>
<style lang="scss">

</style>
