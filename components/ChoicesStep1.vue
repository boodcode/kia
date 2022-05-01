<template>
  <div>
    <h3 v-html="title"></h3>
    <div class="content">
      <circle-km id="byDay" :value=kmDay unit="jour" max=110></circle-km>
      <circle-km id="byYear" :value=kmYear unit="an" max=22000></circle-km>
    </div>
    <NavButtons></NavButtons>
  </div>
</template>

<script>
import RangeSlider from "assets/js/RangeSlider";
import EventBus from "assets/js/utils/event-bus";

export default {
  data(){
    return {
      title: 'Combien de km, parcourez&#8209;vous ?',
      kmDay:this.$store.state.user.conduite.kmByDay,
      kmYear:this.$store.state.user.conduite.kmByYear,
    }
  },
  mounted() {
    console.log(new RangeSlider(document.querySelector('#byDay'), {endRangeValue: 110 }));
    console.log(new RangeSlider(document.querySelector('#byYear'), {endRangeValue: 22000 }));

    EventBus.$on("DRAGEND_CHOICE1", (obj)=> {
      if(obj.elem.id === "byDay"){
        this.kmDay = Math.round(obj.value);
        this.$store.commit('user/updateConduite', {...this.$store.state.user.conduite, kmByDay:this.kmDay})
      }
      if(obj.elem.id === "byYear"){
        this.kmYear = Math.round(obj.value);
        if(obj.eventType === 'onDragEnd') {
          this.$store.commit('user/updateConduite', {...this.$store.state.user.conduite, kmByYear: this.kmYear})
        }
      }

      EventBus.$emit("IS_BT_ACTIVE", (this.kmDay > 0 && this.kmYear > 0))
    });
  },
}
</script>
