<template>
  <div class="toggle-radio">
    <div class="label">{{label}}</div>
    <div class="input">
      <div class="legend">
        <span v-show="value" class="oui">OUI</span>
        <span v-show="!value" class="non">NON</span>
      </div>
      <svg xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="inner-glow">
            <feFlood flood-color="red"/>
            <feComposite in2="SourceAlpha" operator="out"/>
            <feGaussianBlur stdDeviation="2" result="blur"/>
            <feComposite operator="atop" in2="SourceGraphic"/>
          </filter>
        </defs>
      </svg>
    </div>
  </div>
</template>
<script>



export default {
  props: ['value', 'label'],
  data: () => ({
  }),
  watch: {

  },
  mounted(){

  }
}
</script>
<style lang="scss">
.toggle-radio {
  position:relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width:580px;
  height: 95px;
  border-top: 1px solid #514634;
  cursor: grab;
  pointer-events: auto;

  & + .toggle-radio {
    border-bottom: 1px solid #514634;
  }

  .label{
    font-size: 20px;
    font-family: "Kia Signature Fix Regular";
    color:#FFFFFF;
  }
  .input {
    position: relative;
    .legend{
      width:100%;

      font-size: 11px;
      font-family: "Kia Signature Fix Regular";

      span{
        position: absolute;
        top:4px;
        &.oui{
          left: 0px;
          color:#000000;
        }
        &.non{
          right: -2px;
          color:#8a6341;
        }
      }
    }
  }
  svg {

    z-index:1000;
    #path1 {
      filter: drop-shadow(0 0 5px rgba(224, 135, 46, 0.1));
    }
    #path2 {
      filter: drop-shadow(0 0 15px rgba(224, 135, 46, 0.9));
    }
  }
  span,svg {cursor: grab;}

  @media only screen and (max-width : 640px) {
    width:100%;
    justify-content: space-evenly;
    .label {
      font-size: 16px;
      max-width:60%
    }
  }
}

</style>
