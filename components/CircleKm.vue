<template>
  <div class="circle">
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
    <div class="legend">
      <strong>
        <span class="value">{{ defValue }} km</span>
        <br>par {{ unit }}
      </strong>
    </div>

  </div>
</template>
<script>

export default {
  props:['value', 'unit', 'max'],
  data: () => ({
  }),
  computed: {
    defValue(){
      let def = this.value.toLocaleString()
      if(this.value === parseInt(this.max)) { def = '+ ' + def;}
      return def;
    }
  },
  mounted(){

  },
  methods: {
    sepMillier(value){
      return value;
    }
  }
}
</script>
<style lang="scss">
$circle-radius : 96px;


.circle {
  position:relative;
  margin:75px;
  height: calc(2 * #{$circle-radius});
  width: calc(2 * #{$circle-radius});
  @media only screen and (max-width : 640px) {
    margin:20px auto;
    transform: scale3d(0.8, 0.8, 1);
  }

  svg {
    position: absolute;
    z-index:1000;

    #path2 {
      filter: drop-shadow(0 0 15px rgba(224, 135, 46, 0.9));
    }
    .unitTextBg{
      filter: drop-shadow(0 0 10px #352b29);
    }
    text {
      fill:#8e7a5c;
      font-size: 12px;
      font-family: "Kia Signature Fix Regular";
      filter: drop-shadow(0 0 5px rgba(0, 0, 0, 1));
      background-color: #000;
    }
  }
  .legend{
    position:absolute;
    width: 100%;
    top:50%;
    left:50%;
    transform:translate3d(-50%, -50%, 0);
    text-align: center;
    color:#FFF;
    font-size: 20px;
    .value{
      color:#f8d7a1;
    }
  }

}


</style>
