<template>
  <div class="slider-frequence">
      <div class="type">{{type}}</div>
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
      <div class="legend">{{value}}</div>
    </div>
</template>
<script>



export default {
  props: ['type', 'value'],
  data: () => ({
  }),
  watch: {

  },
  mounted(){

  }
}
</script>
<style lang="scss">
.slider-frequence {
  width: 33%;
  border-bottom: 1px solid #514634;
  display: flex;
  flex-direction: column;
  align-items: center;

  & + .slider-frequence{
    border-left:1px solid #514634;
  }

  .type {
    text-align: center;
    padding-top: 30px;

    font-size: 20px;
    color: #FFFFFF;
    font-family: "Kia Signature Fix Regular";
    @media only screen and (max-width : 640px) {
      font-size: 14px;
    }
  }
  .legend{
    height:24px;
    min-height: 24px;
    text-align: center;
    font-size: 18px;
    color: #FFFFFF;
    padding-bottom: 10px;
    font-family: "Kia Signature Fix Bold";
    @media only screen and (max-width : 640px) {
      font-size: 14px;
    }
  }
  svg {
    margin: 40px 0;
    z-index:1000;

    @media only screen and (max-width : 640px) {
      margin: 20px 0;
    }
    #path2 {
      filter: drop-shadow(0 0 15px rgba(224, 135, 46, 0.9));
    }
  }

  @media screen and (max-width: 640px) {
    //margin-top: 30px;
  }
}

</style>
